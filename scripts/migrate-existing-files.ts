import { db } from "../src/server/db";
import { files, images, documents } from "../src/server/db/schema";
import { getMimeTypeFromExtension, fileExistsAsync } from "../src/lib/file-management-server";
import path from 'path';

async function migrateExistingFiles() {
  console.log("Starting migration of existing files to file management system...");
  
  let migratedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  try {
    // Migrate images
    console.log("\n📸 Migrating images...");
    const allImages = await db.query.images.findMany();
    console.log(`Found ${allImages.length} images to migrate`);

    for (const image of allImages) {
      try {
        // Skip if already has a file record
        const existingFileRecord = await db.query.files.findFirst({
          where: (files, { and, eq }) => and(
            eq(files.associatedEntity, 'image'),
            eq(files.associatedEntityId, image.id)
          ),
        });

        if (existingFileRecord) {
          console.log(`  ⏭️  Image ${image.id} already has file record, skipping`);
          continue;
        }

        // Determine file path
        let filePath = '';
        if (image.localPath) {
          // Use localPath if available
          filePath = image.localPath.startsWith('public/') 
            ? image.localPath 
            : `public${image.localPath}`;
        } else if (image.url) {
          // Construct from URL
          filePath = image.url.startsWith('/') 
            ? `public${image.url}` 
            : `public/${image.url}`;
        } else {
          errors.push(`Image ${image.id}: No valid path found`);
          errorCount++;
          continue;
        }

        // Check if physical file exists
        const physicalExists = await fileExistsAsync(filePath);
        
        // Extract filename from path
        const filename = path.basename(filePath);
        const originalName = image.title || filename;

        // Determine upload type based on image properties
        let uploadType = 'gallery'; // default
        if (!image.gallery) {
          // Could be news or events, but we can't determine without more context
          // We'll default to gallery and mark as orphaned if needed
          uploadType = 'gallery';
        }

        // Create file record
        await db.insert(files).values({
          originalName,
          filename,
          filePath,
          publicUrl: image.url || '',
          mimeType: getMimeTypeFromExtension(filename),
          fileSize: image.image_size || 0,
          uploadType,
          uploadedBy: undefined, // We don't have this info for existing files
          associatedEntity: 'image',
          associatedEntityId: image.id,
          isOrphaned: !physicalExists,
          lastAccessedAt: undefined,
          createdAt: image.createdAt || new Date(),
          updatedAt: image.updatedAt || new Date(),
        });

        migratedCount++;
        console.log(`  ✅ Migrated image ${image.id}: ${originalName} ${!physicalExists ? '(orphaned)' : ''}`);

      } catch (error) {
        const errorMsg = `Image ${image.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        errorCount++;
        console.log(`  ❌ Error migrating image ${image.id}: ${error}`);
      }
    }

    // Migrate documents
    console.log("\n📄 Migrating documents...");
    const allDocuments = await db.query.documents.findMany();
    console.log(`Found ${allDocuments.length} documents to migrate`);

    for (const document of allDocuments) {
      try {
        // Skip if already has a file record
        const existingFileRecord = await db.query.files.findFirst({
          where: (files, { and, eq }) => and(
            eq(files.associatedEntity, 'document'),
            eq(files.associatedEntityId, document.id)
          ),
        });

        if (existingFileRecord) {
          console.log(`  ⏭️  Document ${document.id} already has file record, skipping`);
          continue;
        }

        // Determine file path from fileUrl
        const filePath = document.fileUrl.startsWith('/') 
          ? `public${document.fileUrl}` 
          : `public/${document.fileUrl}`;

        // Check if physical file exists
        const physicalExists = await fileExistsAsync(filePath);
        
        // Extract filename from path
        const filename = path.basename(filePath);
        const originalName = document.title || filename;

        // Parse file size (it's stored as string like "1.2 MB")
        let fileSize = 0;
        if (document.fileSize) {
          const sizeMatch = document.fileSize.match(/^([\d.]+)\s*(KB|MB|GB|Bytes?)$/i);
          if (sizeMatch) {
            const value = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toUpperCase();
            switch (unit) {
              case 'BYTES':
              case 'BYTE':
                fileSize = value;
                break;
              case 'KB':
                fileSize = value * 1024;
                break;
              case 'MB':
                fileSize = value * 1024 * 1024;
                break;
              case 'GB':
                fileSize = value * 1024 * 1024 * 1024;
                break;
            }
          }
        }

        // Create file record
        await db.insert(files).values({
          originalName,
          filename,
          filePath,
          publicUrl: document.fileUrl,
          mimeType: getMimeTypeFromExtension(filename),
          fileSize: Math.round(fileSize),
          uploadType: 'documents',
          uploadedBy: undefined, // We don't have this info for existing files
          associatedEntity: 'document',
          associatedEntityId: document.id,
          isOrphaned: !physicalExists,
          lastAccessedAt: undefined,
          createdAt: document.date || new Date(),
          updatedAt: document.date || new Date(),
        });

        migratedCount++;
        console.log(`  ✅ Migrated document ${document.id}: ${originalName} ${!physicalExists ? '(orphaned)' : ''}`);

      } catch (error) {
        const errorMsg = `Document ${document.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        errorCount++;
        console.log(`  ❌ Error migrating document ${document.id}: ${error}`);
      }
    }

    // Summary
    console.log("\n📊 Migration Summary:");
    console.log(`✅ Successfully migrated: ${migratedCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    
    if (errors.length > 0) {
      console.log("\n🚨 Errors encountered:");
      errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log("\n🎉 Migration completed!");

  } catch (error) {
    console.error("💥 Fatal error during migration:", error);
    process.exit(1);
  }
}

// Run the migration
migrateExistingFiles().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
