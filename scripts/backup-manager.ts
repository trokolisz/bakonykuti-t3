#!/usr/bin/env bun
/**
 * Backup Management Utilities
 * List, validate, and manage database backups with metadata tracking
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface BackupInfo {
  name: string;
  type: 'complete' | 'schema' | 'data';
  timestamp: string;
  database: string;
  environment: string;
  size: number;
  sizeFormatted: string;
  files: {
    sql: string;
    metadata?: string;
    compressed?: string;
  };
  metadata?: any;
  valid: boolean;
  errors: string[];
}

export interface BackupManagerOptions {
  backupDir: string;
  environment?: string;
  includeCompressed?: boolean;
}

/**
 * List all available backups
 */
export async function listBackups(options: BackupManagerOptions): Promise<BackupInfo[]> {
  const backups: BackupInfo[] = [];
  
  try {
    const files = await fs.readdir(options.backupDir);
    
    // Group files by backup name
    const backupGroups = new Map<string, string[]>();
    
    for (const file of files) {
      if (file.endsWith('.sql') || file.endsWith('.json') || file.endsWith('.gz')) {
        // Extract backup name (remove type suffix and extension)
        const baseName = file
          .replace(/-(complete|schema|data)(-info)?\.sql(\.gz)?$/, '')
          .replace(/-info\.json$/, '');
        
        if (!backupGroups.has(baseName)) {
          backupGroups.set(baseName, []);
        }
        backupGroups.get(baseName)!.push(file);
      }
    }
    
    // Process each backup group
    for (const [baseName, files] of backupGroups) {
      const backup = await processBackupGroup(options.backupDir, baseName, files);
      if (backup) {
        // Filter by environment if specified
        if (!options.environment || backup.environment === options.environment) {
          backups.push(backup);
        }
      }
    }
    
    // Sort by timestamp (newest first)
    backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
  } catch (error) {
    console.error('Error listing backups:', error);
  }
  
  return backups;
}

/**
 * Get detailed information about a specific backup
 */
export async function getBackupInfo(backupDir: string, backupName: string): Promise<BackupInfo | null> {
  try {
    const files = await fs.readdir(backupDir);
    const backupFiles = files.filter(file => file.startsWith(backupName));
    
    if (backupFiles.length === 0) {
      return null;
    }
    
    return await processBackupGroup(backupDir, backupName, backupFiles);
  } catch (error) {
    console.error('Error getting backup info:', error);
    return null;
  }
}

/**
 * Validate a backup file
 */
export async function validateBackup(backupDir: string, backupName: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const backup = await getBackupInfo(backupDir, backupName);
    
    if (!backup) {
      errors.push('Backup not found');
      return { valid: false, errors, warnings };
    }
    
    // Check if SQL file exists and is readable
    const sqlFile = path.join(backupDir, backup.files.sql);
    try {
      const content = await fs.readFile(sqlFile, 'utf-8');
      
      // Basic content validation
      if (content.length === 0) {
        errors.push('SQL file is empty');
      } else {
        // Check for basic SQL structure
        if (!content.includes('CREATE TABLE') && !content.includes('INSERT INTO')) {
          warnings.push('No CREATE TABLE or INSERT statements found');
        }
        
        // Check for potential encoding issues
        if (content.includes('�')) {
          warnings.push('Potential encoding issues detected');
        }
        
        // Check for incomplete statements
        const statements = content.split(';').filter(s => s.trim());
        const incompleteStatements = statements.filter(s => 
          s.includes('CREATE TABLE') && !s.includes(')')
        );
        
        if (incompleteStatements.length > 0) {
          errors.push(`${incompleteStatements.length} incomplete CREATE TABLE statements found`);
        }
      }
      
    } catch (error) {
      errors.push(`Cannot read SQL file: ${error}`);
    }
    
    // Validate metadata if exists
    if (backup.files.metadata) {
      const metadataFile = path.join(backupDir, backup.files.metadata);
      try {
        const metadataContent = await fs.readFile(metadataFile, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        
        // Check required metadata fields
        const requiredFields = ['timestamp', 'database', 'environment'];
        for (const field of requiredFields) {
          if (!metadata[field]) {
            warnings.push(`Missing metadata field: ${field}`);
          }
        }
        
      } catch (error) {
        warnings.push(`Cannot read or parse metadata file: ${error}`);
      }
    }
    
    // Check compressed file if exists
    if (backup.files.compressed) {
      const compressedFile = path.join(backupDir, backup.files.compressed);
      try {
        const stats = await fs.stat(compressedFile);
        if (stats.size === 0) {
          errors.push('Compressed file is empty');
        }
      } catch (error) {
        warnings.push(`Cannot access compressed file: ${error}`);
      }
    }
    
  } catch (error) {
    errors.push(`Validation error: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Clean up old backups
 */
export async function cleanupBackups(options: BackupManagerOptions & {
  keepCount?: number;
  keepDays?: number;
  dryRun?: boolean;
}): Promise<{ deleted: string[]; kept: string[]; errors: string[] }> {
  const result = {
    deleted: [] as string[],
    kept: [] as string[],
    errors: [] as string[]
  };
  
  try {
    const backups = await listBackups(options);
    
    let toDelete: BackupInfo[] = [];
    
    // Apply retention policies
    if (options.keepCount && options.keepCount > 0) {
      // Keep only the newest N backups
      toDelete = backups.slice(options.keepCount);
    }
    
    if (options.keepDays && options.keepDays > 0) {
      // Keep only backups newer than N days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - options.keepDays);
      
      const oldBackups = backups.filter(backup => 
        new Date(backup.timestamp) < cutoffDate
      );
      
      // Merge with count-based deletion (take union)
      const toDeleteNames = new Set([...toDelete.map(b => b.name), ...oldBackups.map(b => b.name)]);
      toDelete = backups.filter(b => toDeleteNames.has(b.name));
    }
    
    // Delete backups
    for (const backup of toDelete) {
      try {
        const filesToDelete = [
          backup.files.sql,
          backup.files.metadata,
          backup.files.compressed
        ].filter(Boolean);
        
        if (options.dryRun) {
          result.deleted.push(`[DRY RUN] ${backup.name}`);
        } else {
          for (const file of filesToDelete) {
            const filePath = path.join(options.backupDir, file!);
            try {
              await fs.unlink(filePath);
            } catch (error) {
              // File might not exist, which is okay
            }
          }
          result.deleted.push(backup.name);
        }
        
      } catch (error) {
        result.errors.push(`Failed to delete ${backup.name}: ${error}`);
      }
    }
    
    // Track kept backups
    const keptBackups = backups.filter(b => !toDelete.some(d => d.name === b.name));
    result.kept = keptBackups.map(b => b.name);
    
  } catch (error) {
    result.errors.push(`Cleanup error: ${error}`);
  }
  
  return result;
}

/**
 * Process a group of backup files
 */
async function processBackupGroup(backupDir: string, baseName: string, files: string[]): Promise<BackupInfo | null> {
  try {
    // Find the main SQL file
    const sqlFile = files.find(f => f.endsWith('.sql') && !f.endsWith('.gz'));
    if (!sqlFile) {
      return null;
    }
    
    // Determine backup type
    let type: 'complete' | 'schema' | 'data' = 'complete';
    if (sqlFile.includes('-schema.sql')) {
      type = 'schema';
    } else if (sqlFile.includes('-data.sql')) {
      type = 'data';
    }
    
    // Get file stats
    const sqlPath = path.join(backupDir, sqlFile);
    const stats = await fs.stat(sqlPath);
    
    // Find associated files
    const metadataFile = files.find(f => f.endsWith('-info.json'));
    const compressedFile = files.find(f => f.endsWith('.gz'));
    
    // Load metadata if available
    let metadata: any = {};
    if (metadataFile) {
      try {
        const metadataPath = path.join(backupDir, metadataFile);
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        // Metadata file might be corrupted
      }
    }
    
    // Extract information from filename or metadata
    const timestamp = metadata.timestamp || extractTimestampFromFilename(baseName);
    const database = metadata.database || extractDatabaseFromFilename(baseName);
    const environment = metadata.environment || extractEnvironmentFromFilename(baseName);
    
    // Validate backup
    const validation = await validateBackup(backupDir, baseName);
    
    return {
      name: baseName,
      type,
      timestamp,
      database,
      environment,
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      files: {
        sql: sqlFile,
        metadata: metadataFile,
        compressed: compressedFile,
      },
      metadata,
      valid: validation.valid,
      errors: validation.errors,
    };
    
  } catch (error) {
    return null;
  }
}

/**
 * Extract timestamp from filename
 */
function extractTimestampFromFilename(filename: string): string {
  const match = filename.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
  if (match) {
    return match[1].replace(/-/g, ':').replace('T', 'T').slice(0, -3) + ':' + match[1].slice(-2) + 'Z';
  }
  return new Date().toISOString();
}

/**
 * Extract database name from filename
 */
function extractDatabaseFromFilename(filename: string): string {
  const parts = filename.split('-');
  return parts[0] || 'unknown';
}

/**
 * Extract environment from filename
 */
function extractEnvironmentFromFilename(filename: string): string {
  const parts = filename.split('-');
  if (parts.length > 1) {
    return parts[1] || 'unknown';
  }
  return 'unknown';
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}

// CLI interface
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Backup Management Utilities');
    console.log('');
    console.log('Usage:');
    console.log('  bun scripts/backup-manager.ts list [options]');
    console.log('  bun scripts/backup-manager.ts info <backup-name> [options]');
    console.log('  bun scripts/backup-manager.ts validate <backup-name> [options]');
    console.log('  bun scripts/backup-manager.ts cleanup [options]');
    console.log('');
    console.log('Options:');
    console.log('  --dir <directory>       Backup directory (default: ./database-backups)');
    console.log('  --env <environment>     Filter by environment');
    console.log('  --keep-count <number>   Keep only N newest backups (cleanup)');
    console.log('  --keep-days <number>    Keep only backups newer than N days (cleanup)');
    console.log('  --dry-run               Show what would be deleted without deleting (cleanup)');
    console.log('');
    console.log('Examples:');
    console.log('  bun scripts/backup-manager.ts list');
    console.log('  bun scripts/backup-manager.ts list --env production');
    console.log('  bun scripts/backup-manager.ts info backup-name');
    console.log('  bun scripts/backup-manager.ts validate backup-name');
    console.log('  bun scripts/backup-manager.ts cleanup --keep-count 5');
    console.log('  bun scripts/backup-manager.ts cleanup --keep-days 30 --dry-run');
    process.exit(0);
  }

  const command = args[0];
  const backupDir = args.find((arg, i) => args[i - 1] === '--dir') || './database-backups';
  const environment = args.find((arg, i) => args[i - 1] === '--env');

  const options: BackupManagerOptions = {
    backupDir,
    environment,
  };

  switch (command) {
    case 'list':
      const backups = await listBackups(options);

      if (backups.length === 0) {
        console.log('📭 No backups found');
        break;
      }

      console.log(`📋 Found ${backups.length} backup(s):\n`);

      // Group by environment
      const byEnvironment = backups.reduce((acc, backup) => {
        if (!acc[backup.environment]) {
          acc[backup.environment] = [];
        }
        acc[backup.environment].push(backup);
        return acc;
      }, {} as Record<string, BackupInfo[]>);

      for (const [env, envBackups] of Object.entries(byEnvironment)) {
        console.log(`🌍 ${env.toUpperCase()} Environment:`);

        for (const backup of envBackups) {
          const status = backup.valid ? '✅' : '❌';
          const typeIcon = backup.type === 'complete' ? '📦' : backup.type === 'schema' ? '🏗️' : '📊';

          console.log(`  ${status} ${typeIcon} ${backup.name}`);
          console.log(`      Database: ${backup.database}`);
          console.log(`      Type: ${backup.type}`);
          console.log(`      Size: ${backup.sizeFormatted}`);
          console.log(`      Created: ${new Date(backup.timestamp).toLocaleString()}`);

          if (!backup.valid && backup.errors.length > 0) {
            console.log(`      ⚠️  Errors: ${backup.errors.join(', ')}`);
          }

          console.log('');
        }
      }
      break;

    case 'info':
      if (args.length < 2) {
        console.error('❌ Backup name is required');
        process.exit(1);
      }

      const backupName = args[1];
      const backupInfo = await getBackupInfo(backupDir, backupName);

      if (!backupInfo) {
        console.error(`❌ Backup not found: ${backupName}`);
        process.exit(1);
      }

      console.log(`📋 Backup Information: ${backupInfo.name}\n`);
      console.log(`Database: ${backupInfo.database}`);
      console.log(`Environment: ${backupInfo.environment}`);
      console.log(`Type: ${backupInfo.type}`);
      console.log(`Size: ${backupInfo.sizeFormatted} (${backupInfo.size} bytes)`);
      console.log(`Created: ${new Date(backupInfo.timestamp).toLocaleString()}`);
      console.log(`Valid: ${backupInfo.valid ? '✅ Yes' : '❌ No'}`);

      console.log('\n📁 Files:');
      console.log(`  SQL: ${backupInfo.files.sql}`);
      if (backupInfo.files.metadata) {
        console.log(`  Metadata: ${backupInfo.files.metadata}`);
      }
      if (backupInfo.files.compressed) {
        console.log(`  Compressed: ${backupInfo.files.compressed}`);
      }

      if (backupInfo.metadata && Object.keys(backupInfo.metadata).length > 0) {
        console.log('\n📊 Metadata:');
        if (backupInfo.metadata.tableCount) {
          console.log(`  Tables: ${backupInfo.metadata.tableCount}`);
        }
        if (backupInfo.metadata.rowCount) {
          console.log(`  Rows: ${backupInfo.metadata.rowCount}`);
        }
      }

      if (backupInfo.errors.length > 0) {
        console.log('\n❌ Errors:');
        backupInfo.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }
      break;

    case 'validate':
      if (args.length < 2) {
        console.error('❌ Backup name is required');
        process.exit(1);
      }

      const validateName = args[1];
      const validation = await validateBackup(backupDir, validateName);

      console.log(`🔍 Validation Results for: ${validateName}\n`);
      console.log(`Status: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);

      if (validation.errors.length > 0) {
        console.log('\n❌ Errors:');
        validation.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }

      if (validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        validation.warnings.forEach(warning => {
          console.log(`  - ${warning}`);
        });
      }

      if (!validation.valid) {
        process.exit(1);
      }
      break;

    case 'cleanup':
      const keepCount = args.find((arg, i) => args[i - 1] === '--keep-count');
      const keepDays = args.find((arg, i) => args[i - 1] === '--keep-days');
      const dryRun = args.includes('--dry-run');

      if (!keepCount && !keepDays) {
        console.error('❌ Either --keep-count or --keep-days must be specified');
        process.exit(1);
      }

      const cleanupOptions = {
        ...options,
        keepCount: keepCount ? parseInt(keepCount) : undefined,
        keepDays: keepDays ? parseInt(keepDays) : undefined,
        dryRun,
      };

      console.log('🧹 Starting backup cleanup...');
      if (dryRun) {
        console.log('🧪 DRY RUN MODE - No files will be deleted\n');
      }

      const cleanupResult = await cleanupBackups(cleanupOptions);

      console.log(`📊 Cleanup Results:`);
      console.log(`  Deleted: ${cleanupResult.deleted.length}`);
      console.log(`  Kept: ${cleanupResult.kept.length}`);
      console.log(`  Errors: ${cleanupResult.errors.length}`);

      if (cleanupResult.deleted.length > 0) {
        console.log('\n🗑️  Deleted backups:');
        cleanupResult.deleted.forEach(name => {
          console.log(`  - ${name}`);
        });
      }

      if (cleanupResult.errors.length > 0) {
        console.log('\n❌ Errors:');
        cleanupResult.errors.forEach(error => {
          console.log(`  - ${error}`);
        });
      }
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.error('Use: list, info, validate, or cleanup');
      process.exit(1);
  }
}
