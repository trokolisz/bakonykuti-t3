#!/usr/bin/env bun
/**
 * Native Database Backup & Restore Utility
 * Pure Node.js/Bun implementation without external dependencies
 */

import mysql from 'mysql2/promise';
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
  const config = getDbConfig();

  console.log('🗄️  Native Database Backup & Restore Utility\n');
  console.log('Usage: bun run scripts/database-backup-native.ts <command> [options]\n');
  console.log('Commands:');
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(10)} ${desc}`);
  });
  console.log('\nExamples:');
  console.log('  bun run scripts/database-backup-native.ts backup');
  console.log('  bun run scripts/database-backup-native.ts restore latest');
  console.log('  bun run scripts/database-backup-native.ts list');

  console.log('\n📋 Current Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Password: ${config.password ? '***set***' : '***NOT SET***'}`);
  console.log(`  Database: ${config.database}`);

  console.log('\n🔧 Environment Variables:');
  console.log(`  MARIADB_HOST=${process.env.MARIADB_HOST ?? 'not set (using default: localhost)'}`);
  console.log(`  MARIADB_PORT=${process.env.MARIADB_PORT ?? 'not set (using default: 3306)'}`);
  console.log(`  MARIADB_USER=${process.env.MARIADB_USER ?? 'not set (using default: root)'}`);
  console.log(`  MARIADB_PASSWORD=${process.env.MARIADB_PASSWORD ? '***set***' : '***NOT SET*** (required!)'}`);
  console.log(`  MARIADB_DATABASE=${process.env.MARIADB_DATABASE ?? 'not set (using default: bakonykuti-mariadb)'}`);

  if (!config.password) {
    console.log('\n⚠️  WARNING: MARIADB_PASSWORD is not set!');
    console.log('   Set it in your .env file or as an environment variable.');
  }
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
    // Connect to database
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');
    
    // Get all tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [config.database]);
    
    console.log(`📋 Found ${(tables as any[]).length} tables to backup`);
    
    // Generate SQL backup
    let sqlContent = '';
    
    // Add header
    sqlContent += `-- Database Backup: ${config.database}\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- Host: ${config.host}:${config.port}\n\n`;
    
    // Add database creation (use environment variable for target database name)
    const targetDatabase = process.env.TARGET_DATABASE || config.database;
    sqlContent += `DROP DATABASE IF EXISTS \`${targetDatabase}\`;\n`;
    sqlContent += `CREATE DATABASE \`${targetDatabase}\`;\n`;
    sqlContent += `USE \`${targetDatabase}\`;\n\n`;
    
    // Backup each table
    for (const table of tables as any[]) {
      const tableName = table.TABLE_NAME;
      console.log(`  📄 Backing up table: ${tableName}`);
      
      // Get table structure
      const [createTable] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSql = (createTable as any[])[0]['Create Table'];
      
      sqlContent += `-- Table: ${tableName}\n`;
      sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      sqlContent += createTableSql + ';\n\n';
      
      // Get table data
      const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``);
      const rowsArray = rows as any[];
      
      if (rowsArray.length > 0) {
        // Get column names
        const [columns] = await connection.execute(`
          SELECT COLUMN_NAME 
          FROM information_schema.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [config.database, tableName]);
        
        const columnNames = (columns as any[]).map(col => col.COLUMN_NAME);
        const columnList = columnNames.map(name => `\`${name}\``).join(', ');
        
        sqlContent += `-- Data for table: ${tableName}\n`;
        sqlContent += `INSERT INTO \`${tableName}\` (${columnList}) VALUES\n`;
        
        // Add data rows
        const valueRows = rowsArray.map(row => {
          const values = columnNames.map(colName => {
            const value = row[colName];
            if (value === null) return 'NULL';
            if (typeof value === 'string') {
              // Properly escape strings for SQL
              return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}'`;
            }
            if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
            if (typeof value === 'boolean') return value ? '1' : '0';
            if (typeof value === 'number') return value.toString();
            return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}'`;
          });
          return `(${values.join(', ')})`;
        });
        
        sqlContent += valueRows.join(',\n') + ';\n\n';
        console.log(`    ✅ ${rowsArray.length} rows backed up`);
      } else {
        console.log(`    ℹ️  Table is empty`);
      }
    }
    
    // Write backup file
    await fs.writeFile(completeFile, sqlContent);
    console.log(`✅ Backup written to: ${completeFile}`);
    
    // Create restore script
    const restoreScript = path.join(backupDir, `${backupPrefix}-restore.ts`);
    await createRestoreScript(config, restoreScript, `${backupPrefix}-complete.sql`);
    console.log(`✅ Restore script created: ${restoreScript}`);
    
    // Create info file
    const infoFile = path.join(backupDir, `${backupPrefix}-info.json`);
    await createBackupInfo(config, infoFile, backupPrefix, (tables as any[]).length);
    console.log(`✅ Info file created: ${infoFile}`);
    
    await connection.end();
    
    // Get file size
    const stats = await fs.stat(completeFile);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('\n🎉 Backup completed successfully!\n');
    console.log('📋 Generated files:');
    console.log(`  - Database: ${backupPrefix}-complete.sql (${sizeKB} KB)`);
    console.log(`  - Restore Script: ${backupPrefix}-restore.ts`);
    console.log(`  - Info: ${backupPrefix}-info.json`);
    console.log('\n🚀 To restore on another server:');
    console.log(`  bun run database-backups/${backupPrefix}-restore.ts`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

async function restoreBackup() {
  const backupIdentifier = process.argv[3] || 'latest';

  // Handle help command
  if (backupIdentifier === 'help' || backupIdentifier === '--help' || backupIdentifier === '-h') {
    const config = getDbConfig();

    console.log('🔄 Database Restore Help\n');
    console.log('Usage: bun run scripts/database-backup-native.ts restore [backup-identifier]\n');
    console.log('Options:');
    console.log('  latest                    Restore the most recent backup');
    console.log('  backup-name              Restore specific backup by name');
    console.log('  help, --help, -h         Show this help message\n');
    console.log('Examples:');
    console.log('  bun run scripts/database-backup-native.ts restore latest');
    console.log('  bun run scripts/database-backup-native.ts restore bakonykuti-mariadb-backup-2025-10-01T15-52-15');

    console.log('\n📋 Current Configuration:');
    console.log(`  Host: ${config.host}`);
    console.log(`  Port: ${config.port}`);
    console.log(`  User: ${config.user}`);
    console.log(`  Password: ${config.password ? '***set***' : '***NOT SET***'}`);
    console.log(`  Database: ${config.database}`);

    console.log('\n🔧 Environment Variables:');
    console.log(`  MARIADB_HOST=${process.env.MARIADB_HOST || 'not set (using default: localhost)'}`);
    console.log(`  MARIADB_PORT=${process.env.MARIADB_PORT || 'not set (using default: 3306)'}`);
    console.log(`  MARIADB_USER=${process.env.MARIADB_USER || 'not set (using default: root)'}`);
    console.log(`  MARIADB_PASSWORD=${process.env.MARIADB_PASSWORD ? '***set***' : '***NOT SET*** (required!)'}`);
    console.log(`  MARIADB_DATABASE=${process.env.MARIADB_DATABASE || 'not set (using default: bakonykuti-mariadb)'}`);

    if (!config.password) {
      console.log('\n⚠️  WARNING: MARIADB_PASSWORD is not set!');
      console.log('   Set it in your .env file or as an environment variable.');
    }

    return;
  }

  console.log(`🔄 Restoring database backup: ${backupIdentifier}\n`);
  
  const config = getDbConfig();
  const backupDir = './database-backups';
  
  try {
    // Find backup file
    const backupFile = await findBackupFile(backupDir, backupIdentifier);
    console.log(`📁 Using backup file: ${backupFile}\n`);
    
    // Read SQL file
    const sqlContent = await fs.readFile(backupFile, 'utf-8');
    console.log('📄 SQL file loaded');
    
    // Connect to database (without specifying database initially)
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    console.log('✅ Connected to database server');
    
    // Split SQL into statements (better handling of multi-line statements)
    const statements = sqlContent
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.match(/^--.*/));
    
    console.log(`📊 Executing ${statements.length} SQL statements...`);
    
    // Execute statements
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement && statement.trim()) {
        try {
          await connection.execute(statement);
          if (i % 10 === 0) {
            console.log(`  Progress: ${i + 1}/${statements.length} statements`);
          }
        } catch (error: any) {
          console.warn(`  Warning on statement ${i + 1}: ${error?.message || error}`);
        }
      }
    }
    
    await connection.end();
    
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
        const size = (stats.size / 1024).toFixed(2);
        const date = stats.mtime.toISOString().slice(0, 19).replace('T', ' ');
        
        console.log(`${isLatest ? '→' : ' '} ${backup}`);
        console.log(`   Created: ${date}`);
        console.log(`   Size: ${size} KB`);
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
    console.log(`Tables: ${info.tableCount}`);
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
    host: process.env.MARIADB_HOST || '10.200.200.42',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'bakonykuti_DB1',
  };
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

async function createRestoreScript(config: any, outputFile: string, sqlFile: string): Promise<void> {
  const scriptContent = `#!/usr/bin/env bun
/**
 * Database Restore Script
 * Generated on ${new Date().toISOString()}
 */

import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';

async function restore() {
  console.log('🚀 Restoring database backup...');
  
  const config = {
    host: process.env.MARIADB_HOST || '${config.host}',
    port: parseInt(process.env.MARIADB_PORT || '${config.port}'),
    user: process.env.MARIADB_USER || '${config.user}',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || '${config.database}',
  };
  
  if (!config.password) {
    console.error('❌ MARIADB_PASSWORD environment variable is required');
    process.exit(1);
  }
  
  try {
    const sqlContent = await fs.readFile('${sqlFile}', 'utf-8');
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(\`📊 Executing \${statements.length} SQL statements...\`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    await connection.end();
    console.log('✅ Database restored successfully!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

restore();
`;
  
  await fs.writeFile(outputFile, scriptContent);
}

async function createBackupInfo(config: any, outputFile: string, backupPrefix: string, tableCount: number): Promise<void> {
  const info = {
    timestamp: new Date().toISOString(),
    database: config.database,
    host: config.host,
    port: config.port,
    user: config.user,
    tableCount,
    files: {
      complete: `${backupPrefix}-complete.sql`,
      restoreScript: `${backupPrefix}-restore.ts`,
      info: `${backupPrefix}-info.json`,
    }
  };
  
  await fs.writeFile(outputFile, JSON.stringify(info, null, 2));
}

// Run the utility
main().catch(console.error);
