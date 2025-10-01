#!/usr/bin/env bun
/**
 * Database Backup & Restore Utility
 * Simple command-line utility for database operations
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const COMMANDS = {
  backup: 'Create a complete database backup',
  restore: 'Restore database from backup',
  list: 'List available backups',
  info: 'Show backup information',
  help: 'Show this help message'
};

async function main() {
  const command = process.argv[2];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }

  switch (command) {
    case 'backup':
      await createBackup();
      break;
    case 'restore':
      await restoreBackup();
      break;
    case 'list':
      await listBackups();
      break;
    case 'info':
      await showBackupInfo();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

function showHelp() {
  console.log('🗄️  Database Backup & Restore Utility\n');
  console.log('Usage: bun run scripts/database-backup-utility.ts <command> [options]\n');
  console.log('Commands:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(10)} ${desc}`);
  });
  console.log('\nExamples:');
  console.log('  bun run scripts/database-backup-utility.ts backup');
  console.log('  bun run scripts/database-backup-utility.ts restore latest');
  console.log('  bun run scripts/database-backup-utility.ts restore bakonykuti-mariadb-backup-2025-01-15T10-30-00');
  console.log('  bun run scripts/database-backup-utility.ts list');
  console.log('  bun run scripts/database-backup-utility.ts info latest');
  console.log('\nEnvironment Variables:');
  console.log('  MARIADB_HOST, MARIADB_PORT, MARIADB_USER, MARIADB_PASSWORD, MARIADB_DATABASE');
}

async function createBackup() {
  console.log('🚀 Creating database backup...\n');

  const config = getDbConfig();
  const backupDir = './database-backups';
  
  // Create backup directory
  await fs.mkdir(backupDir, { recursive: true });
  
  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupPrefix = `${config.database}-backup-${timestamp}`;
  const completeFile = path.join(backupDir, `${backupPrefix}-complete.sql`);
  
  console.log(`📦 Backing up database: ${config.database}`);
  console.log(`📁 Output file: ${completeFile}\n`);
  
  try {
    // Create complete backup
    await mysqldump(config, completeFile, {
      includeSchema: true,
      includeData: true,
      addDropDatabase: true,
      addDropTable: true,
      routines: true,
      triggers: true
    });
    
    // Create restore script
    const restoreScript = path.join(backupDir, `${backupPrefix}-restore.sh`);
    await createQuickRestoreScript(config, restoreScript, `${backupPrefix}-complete.sql`);
    
    // Create info file
    const infoFile = path.join(backupDir, `${backupPrefix}-info.json`);
    await createBackupInfo(config, infoFile, backupPrefix);
    
    console.log('✅ Backup completed successfully!\n');
    console.log('📋 Generated files:');
    console.log(`  - Database: ${backupPrefix}-complete.sql`);
    console.log(`  - Restore Script: ${backupPrefix}-restore.sh`);
    console.log(`  - Info: ${backupPrefix}-info.json`);
    console.log('\n🚀 To restore on another server:');
    console.log(`  bash ${backupPrefix}-restore.sh`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

async function restoreBackup() {
  const backupIdentifier = process.argv[3] || 'latest';
  console.log(`🔄 Restoring database backup: ${backupIdentifier}\n`);
  
  const config = getDbConfig();
  const backupDir = './database-backups';
  
  try {
    // Find backup file
    const backupFile = await findBackupFile(backupDir, backupIdentifier);
    console.log(`📁 Using backup file: ${backupFile}\n`);
    
    // Confirm restore
    console.log('⚠️  This will replace all data in the database!');
    console.log(`Database: ${config.database} on ${config.host}:${config.port}`);
    
    // For safety, require explicit confirmation in production
    if (process.env.NODE_ENV === 'production') {
      console.log('\n❌ Restore cancelled: Use the generated restore script for production deployments');
      process.exit(1);
    }
    
    // Create database if it doesn't exist
    await createDatabaseIfNotExists(config);
    
    // Import backup
    console.log('📊 Importing database...');
    await mysqlImport(config, backupFile);
    
    console.log('✅ Database restored successfully!\n');
    console.log('🎉 Restore completed. Your application should now work with the restored data.');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

async function listBackups() {
  const backupDir = './database-backups';
  
  try {
    const files = await fs.readdir(backupDir);
    const backups = files
      .filter(f => f.endsWith('-complete.sql'))
      .map(f => f.replace('-complete.sql', ''))
      .sort()
      .reverse();
    
    if (backups.length === 0) {
      console.log('📭 No backups found in ./database-backups/');
      return;
    }
    
    console.log('📋 Available backups:\n');
    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];
      const isLatest = i === 0;
      const filePath = path.join(backupDir, `${backup}-complete.sql`);
      
      try {
        const stats = await fs.stat(filePath);
        const size = (stats.size / 1024 / 1024).toFixed(2);
        const date = stats.mtime.toISOString().slice(0, 19).replace('T', ' ');
        
        console.log(`${isLatest ? '→' : ' '} ${backup}`);
        console.log(`   Created: ${date}`);
        console.log(`   Size: ${size} MB`);
        if (isLatest) console.log('   (latest)');
        console.log('');
      } catch (error) {
        console.log(`${isLatest ? '→' : ' '} ${backup} (info unavailable)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to list backups:', error);
  }
}

async function showBackupInfo() {
  const backupIdentifier = process.argv[3] || 'latest';
  const backupDir = './database-backups';
  
  try {
    const backupPrefix = backupIdentifier === 'latest' 
      ? await getLatestBackupPrefix(backupDir)
      : backupIdentifier;
    
    const infoFile = path.join(backupDir, `${backupPrefix}-info.json`);
    const info = JSON.parse(await fs.readFile(infoFile, 'utf-8'));
    
    console.log('📋 Backup Information:\n');
    console.log(`Backup ID: ${backupPrefix}`);
    console.log(`Created: ${new Date(info.timestamp).toLocaleString()}`);
    console.log(`Database: ${info.database}`);
    console.log(`Host: ${info.host}:${info.port}`);
    console.log(`User: ${info.user}`);
    console.log('');
    console.log('Files:');
    Object.entries(info.files).forEach(([type, filename]) => {
      if (filename) {
        console.log(`  ${type}: ${filename}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to show backup info:', error);
  }
}

// Helper functions
function getDbConfig() {
  return {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
  };
}

async function mysqldump(config: any, outputFile: string, options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${config.host}`,
      `--port=${config.port}`,
      `--user=${config.user}`,
      `--password=${config.password}`,
      '--single-transaction',
      '--lock-tables=false',
      '--complete-insert',
      '--extended-insert'
    ];
    
    if (options.addDropDatabase) args.push('--add-drop-database');
    if (options.addDropTable) args.push('--add-drop-table');
    if (options.routines) args.push('--routines');
    if (options.triggers) args.push('--triggers');
    
    args.push(config.database);
    
    const mysqldump = spawn('mysqldump', args);
    const writeStream = require('fs').createWriteStream(outputFile);
    
    mysqldump.stdout.pipe(writeStream);
    mysqldump.stderr.on('data', (data) => {
      console.error('mysqldump stderr:', data.toString());
    });
    
    mysqldump.on('close', (code) => {
      writeStream.end();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysqldump exited with code ${code}`));
      }
    });
  });
}

async function mysqlImport(config: any, inputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${config.host}`,
      `--port=${config.port}`,
      `--user=${config.user}`,
      `--password=${config.password}`,
      config.database
    ];
    
    const mysql = spawn('mysql', args);
    const readStream = require('fs').createReadStream(inputFile);
    
    readStream.pipe(mysql.stdin);
    mysql.stderr.on('data', (data) => {
      const errorMsg = data.toString();
      if (!errorMsg.includes('Warning')) {
        console.error('mysql stderr:', errorMsg);
      }
    });
    
    mysql.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysql import exited with code ${code}`));
      }
    });
  });
}

async function findBackupFile(backupDir: string, identifier: string): Promise<string> {
  if (identifier === 'latest') {
    const prefix = await getLatestBackupPrefix(backupDir);
    return path.join(backupDir, `${prefix}-complete.sql`);
  }
  
  const backupFile = path.join(backupDir, identifier.endsWith('.sql') ? identifier : `${identifier}-complete.sql`);
  
  try {
    await fs.access(backupFile);
    return backupFile;
  } catch {
    throw new Error(`Backup file not found: ${backupFile}`);
  }
}

async function getLatestBackupPrefix(backupDir: string): Promise<string> {
  const files = await fs.readdir(backupDir);
  const backups = files
    .filter(f => f.endsWith('-complete.sql'))
    .map(f => f.replace('-complete.sql', ''))
    .sort()
    .reverse();
  
  if (backups.length === 0) {
    throw new Error('No backups found');
  }
  
  return backups[0];
}

async function createDatabaseIfNotExists(config: any): Promise<void> {
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });
  
  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
  await connection.end();
}

async function createQuickRestoreScript(config: any, outputFile: string, sqlFile: string): Promise<void> {
  const scriptContent = `#!/bin/bash
# Quick Database Restore Script
set -e

echo "🚀 Restoring database backup..."

# Load environment if available
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

MARIADB_HOST=\${MARIADB_HOST:-${config.host}}
MARIADB_PORT=\${MARIADB_PORT:-${config.port}}
MARIADB_USER=\${MARIADB_USER:-${config.user}}
MARIADB_DATABASE=\${MARIADB_DATABASE:-${config.database}}

if [ -z "\$MARIADB_PASSWORD" ]; then
    echo -n "Enter MariaDB password: "
    read -s MARIADB_PASSWORD
    echo
fi

echo "Creating database if needed..."
mysql -h"\$MARIADB_HOST" -P"\$MARIADB_PORT" -u"\$MARIADB_USER" -p"\$MARIADB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \\\`\$MARIADB_DATABASE\\\`;"

echo "Restoring database..."
mysql -h"\$MARIADB_HOST" -P"\$MARIADB_PORT" -u"\$MARIADB_USER" -p"\$MARIADB_PASSWORD" "\$MARIADB_DATABASE" < "${sqlFile}"

echo "✅ Database restored successfully!"
`;
  
  await fs.writeFile(outputFile, scriptContent);
  try {
    await fs.chmod(outputFile, 0o755);
  } catch (error) {
    // Ignore chmod errors on Windows
  }
}

async function createBackupInfo(config: any, outputFile: string, backupPrefix: string): Promise<void> {
  const info = {
    timestamp: new Date().toISOString(),
    database: config.database,
    host: config.host,
    port: config.port,
    user: config.user,
    files: {
      complete: `${backupPrefix}-complete.sql`,
      restoreScript: `${backupPrefix}-restore.sh`,
      info: `${backupPrefix}-info.json`,
    }
  };
  
  await fs.writeFile(outputFile, JSON.stringify(info, null, 2));
}

// Run the utility
main().catch(console.error);
