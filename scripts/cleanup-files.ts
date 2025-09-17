import { db } from "../src/server/db";
import { files, images, documents } from "../src/server/db/schema";
import {
  findOrphanedFiles,
  cleanupOrphanedFiles,
  getAllFileRecords,
  fileExistsAsync,
  deletePhysicalFile,
  deleteFileRecord,
  type OrphanedFile,
  type CleanupResult
} from "../src/lib/file-management-server";
import { eq } from "drizzle-orm";

interface CleanupOptions {
  dryRun?: boolean;
  deleteOrphanedFiles?: boolean;
  deleteOrphanedRecords?: boolean;
  updateOrphanedStatus?: boolean;
  verbose?: boolean;
}

async function performFileCleanup(options: CleanupOptions = {}) {
  const {
    dryRun = false,
    deleteOrphanedFiles = false,
    deleteOrphanedRecords = false,
    updateOrphanedStatus = true,
    verbose = true
  } = options;

  console.log("🧹 Starting comprehensive file cleanup...");
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE RUN'}`);
  console.log("Options:", {
    deleteOrphanedFiles,
    deleteOrphanedRecords,
    updateOrphanedStatus,
    verbose
  });

  const stats = {
    totalFiles: 0,
    orphanedFiles: 0,
    orphanedRecords: 0,
    filesDeleted: 0,
    recordsDeleted: 0,
    recordsUpdated: 0,
    errors: [] as string[]
  };

  try {
    // Step 1: Get all file records
    console.log("\n📊 Analyzing file records...");
    const allFileRecords = await getAllFileRecords();
    stats.totalFiles = allFileRecords.length;
    console.log(`Found ${stats.totalFiles} file records in database`);

    // Step 2: Find orphaned files
    console.log("\n🔍 Scanning for orphaned files...");
    const orphans = await findOrphanedFiles();
    
    const orphanedFiles = orphans.filter(o => o.type === 'file');
    const orphanedRecords = orphans.filter(o => o.type === 'record');
    
    stats.orphanedFiles = orphanedFiles.length;
    stats.orphanedRecords = orphanedRecords.length;

    console.log(`Found ${stats.orphanedFiles} orphaned files on disk`);
    console.log(`Found ${stats.orphanedRecords} orphaned records in database`);

    if (verbose) {
      if (orphanedFiles.length > 0) {
        console.log("\n📁 Orphaned files on disk:");
        orphanedFiles.forEach(orphan => {
          console.log(`  - ${orphan.filePath}: ${orphan.reason}`);
        });
      }

      if (orphanedRecords.length > 0) {
        console.log("\n📄 Orphaned records in database:");
        orphanedRecords.forEach(orphan => {
          console.log(`  - Record ID ${orphan.fileId}: ${orphan.reason}`);
        });
      }
    }

    // Step 3: Update orphaned status in database
    if (updateOrphanedStatus && !dryRun) {
      console.log("\n🏷️  Updating orphaned status in database...");
      
      for (const record of allFileRecords) {
        const physicalExists = await fileExistsAsync(record.filePath);
        const shouldBeOrphaned = !physicalExists;
        
        if (record.isOrphaned !== shouldBeOrphaned) {
          try {
            await db.update(files)
              .set({ isOrphaned: shouldBeOrphaned, updatedAt: new Date() })
              .where(eq(files.id, record.id));
            
            stats.recordsUpdated++;
            if (verbose) {
              console.log(`  ✅ Updated record ${record.id}: orphaned = ${shouldBeOrphaned}`);
            }
          } catch (error) {
            const errorMsg = `Failed to update record ${record.id}: ${error}`;
            stats.errors.push(errorMsg);
            console.log(`  ❌ ${errorMsg}`);
          }
        }
      }
      
      console.log(`Updated orphaned status for ${stats.recordsUpdated} records`);
    }

    // Step 4: Delete orphaned files from disk
    if (deleteOrphanedFiles && !dryRun) {
      console.log("\n🗑️  Deleting orphaned files from disk...");
      
      for (const orphan of orphanedFiles) {
        if (orphan.filePath) {
          try {
            const deleted = await deletePhysicalFile(orphan.filePath);
            if (deleted) {
              stats.filesDeleted++;
              if (verbose) {
                console.log(`  ✅ Deleted file: ${orphan.filePath}`);
              }
            }
          } catch (error) {
            const errorMsg = `Failed to delete file ${orphan.filePath}: ${error}`;
            stats.errors.push(errorMsg);
            console.log(`  ❌ ${errorMsg}`);
          }
        }
      }
      
      console.log(`Deleted ${stats.filesDeleted} orphaned files from disk`);
    }

    // Step 5: Delete orphaned records from database
    if (deleteOrphanedRecords && !dryRun) {
      console.log("\n🗑️  Deleting orphaned records from database...");
      
      for (const orphan of orphanedRecords) {
        if (orphan.fileId) {
          try {
            await deleteFileRecord(orphan.fileId);
            stats.recordsDeleted++;
            if (verbose) {
              console.log(`  ✅ Deleted record: ${orphan.fileId}`);
            }
          } catch (error) {
            const errorMsg = `Failed to delete record ${orphan.fileId}: ${error}`;
            stats.errors.push(errorMsg);
            console.log(`  ❌ ${errorMsg}`);
          }
        }
      }
      
      console.log(`Deleted ${stats.recordsDeleted} orphaned records from database`);
    }

    // Step 6: Verify associated entities
    console.log("\n🔗 Verifying associated entities...");
    let brokenAssociations = 0;
    
    for (const record of allFileRecords) {
      if (record.associatedEntity && record.associatedEntityId) {
        let entityExists = false;
        
        try {
          if (record.associatedEntity === 'image') {
            const image = await db.query.images.findFirst({
              where: eq(images.id, record.associatedEntityId),
            });
            entityExists = !!image;
          } else if (record.associatedEntity === 'document') {
            const document = await db.query.documents.findFirst({
              where: eq(documents.id, record.associatedEntityId),
            });
            entityExists = !!document;
          }
          
          if (!entityExists) {
            brokenAssociations++;
            if (verbose) {
              console.log(`  ⚠️  Broken association: File ${record.id} -> ${record.associatedEntity} ${record.associatedEntityId}`);
            }
            
            // Optionally mark as orphaned
            if (updateOrphanedStatus && !dryRun) {
              await db.update(files)
                .set({ isOrphaned: true, updatedAt: new Date() })
                .where(eq(files.id, record.id));
            }
          }
        } catch (error) {
          const errorMsg = `Error checking association for file ${record.id}: ${error}`;
          stats.errors.push(errorMsg);
          console.log(`  ❌ ${errorMsg}`);
        }
      }
    }
    
    console.log(`Found ${brokenAssociations} broken entity associations`);

    // Final summary
    console.log("\n📊 Cleanup Summary:");
    console.log(`Total files analyzed: ${stats.totalFiles}`);
    console.log(`Orphaned files found: ${stats.orphanedFiles}`);
    console.log(`Orphaned records found: ${stats.orphanedRecords}`);
    console.log(`Broken associations: ${brokenAssociations}`);
    
    if (!dryRun) {
      console.log(`Files deleted: ${stats.filesDeleted}`);
      console.log(`Records deleted: ${stats.recordsDeleted}`);
      console.log(`Records updated: ${stats.recordsUpdated}`);
    }
    
    if (stats.errors.length > 0) {
      console.log(`Errors encountered: ${stats.errors.length}`);
      if (verbose) {
        console.log("\n🚨 Errors:");
        stats.errors.forEach(error => console.log(`  - ${error}`));
      }
    }

    console.log(dryRun ? "\n🔍 Dry run completed - no changes were made" : "\n🎉 Cleanup completed!");

  } catch (error) {
    console.error("💥 Fatal error during cleanup:", error);
    process.exit(1);
  }

  return stats;
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  const options: CleanupOptions = {
    dryRun: args.includes('--dry-run'),
    deleteOrphanedFiles: args.includes('--delete-files'),
    deleteOrphanedRecords: args.includes('--delete-records'),
    updateOrphanedStatus: !args.includes('--no-update-status'),
    verbose: !args.includes('--quiet')
  };

  if (args.includes('--help')) {
    console.log(`
File Cleanup Tool

Usage: bun scripts/cleanup-files.ts [options]

Options:
  --dry-run              Run without making any changes (default: false)
  --delete-files         Delete orphaned files from disk (default: false)
  --delete-records       Delete orphaned records from database (default: false)
  --no-update-status     Don't update orphaned status in database (default: false)
  --quiet                Reduce output verbosity (default: false)
  --help                 Show this help message

Examples:
  bun scripts/cleanup-files.ts --dry-run
  bun scripts/cleanup-files.ts --delete-files --delete-records
  bun scripts/cleanup-files.ts --dry-run --quiet
    `);
    process.exit(0);
  }

  await performFileCleanup(options);
}

// Run the cleanup
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
