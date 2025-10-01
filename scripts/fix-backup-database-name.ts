#!/usr/bin/env bun
/**
 * Fix Backup Database Name
 * Updates database name in backup files to match target environment
 */

import { promises as fs } from 'fs';
import path from 'path';

async function fixBackupDatabaseName() {
  const backupFile = process.argv[2];
  const newDatabaseName = process.argv[3];
  
  if (!backupFile || !newDatabaseName) {
    console.log('🔧 Fix Backup Database Name\n');
    console.log('Usage: bun run scripts/fix-backup-database-name.ts <backup-file> <new-database-name>\n');
    console.log('Examples:');
    console.log('  bun run scripts/fix-backup-database-name.ts database-backups/backup.sql bakonykuti_DB1');
    console.log('  bun run scripts/fix-backup-database-name.ts latest bakonykuti_DB1');
    return;
  }
  
  try {
    let actualBackupFile = backupFile;
    
    // Handle "latest" keyword
    if (backupFile === 'latest') {
      const backupDir = './database-backups';
      const files = await fs.readdir(backupDir);
      const backups = files
        .filter(f => f.endsWith('-complete.sql'))
        .sort()
        .reverse();
      
      if (backups.length === 0) {
        throw new Error('No backup files found');
      }
      
      actualBackupFile = path.join(backupDir, backups[0]);
      console.log(`📁 Using latest backup: ${backups[0]}`);
    }
    
    console.log(`🔧 Fixing database name in: ${actualBackupFile}`);
    console.log(`🎯 New database name: ${newDatabaseName}\n`);
    
    // Read the backup file
    const sqlContent = await fs.readFile(actualBackupFile, 'utf-8');
    console.log('📄 Backup file loaded');
    
    // Replace database names
    let fixedContent = sqlContent;
    
    // Replace DROP DATABASE statements
    fixedContent = fixedContent.replace(
      /DROP DATABASE IF EXISTS `[^`]+`;/g,
      `DROP DATABASE IF EXISTS \`${newDatabaseName}\`;`
    );
    
    // Replace CREATE DATABASE statements
    fixedContent = fixedContent.replace(
      /CREATE DATABASE `[^`]+`;/g,
      `CREATE DATABASE \`${newDatabaseName}\`;`
    );
    
    // Replace USE statements
    fixedContent = fixedContent.replace(
      /USE `[^`]+`;/g,
      `USE \`${newDatabaseName}\`;`
    );
    
    // Create new filename
    const originalName = path.basename(actualBackupFile);
    const fixedName = originalName.replace('.sql', `-fixed-${newDatabaseName}.sql`);
    const fixedPath = path.join(path.dirname(actualBackupFile), fixedName);
    
    // Write fixed backup
    await fs.writeFile(fixedPath, fixedContent);
    
    console.log('✅ Database name fixed successfully!');
    console.log(`📁 Fixed backup saved as: ${fixedName}`);
    console.log('\n🚀 To restore with the fixed backup:');
    console.log(`  bun run scripts/database-backup-native.ts restore ${fixedName.replace('-complete.sql', '')}`);
    
  } catch (error) {
    console.error('❌ Failed to fix backup:', error);
    process.exit(1);
  }
}

fixBackupDatabaseName();
