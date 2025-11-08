#!/usr/bin/env bun
/**
 * Enhanced Database Backup Script
 * Supports multiple environments, backup types, and robust error handling
 */

import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { loadDatabaseConfig, getBackupPrefix, type DatabaseConfig } from './database-config';

export interface BackupOptions {
  environment?: string;
  type: 'schema' | 'data' | 'complete';
  outputDir: string;
  compress?: boolean;
  includeDropStatements?: boolean;
  excludeTables?: string[];
  includeTables?: string[];
}

export interface BackupResult {
  success: boolean;
  files: string[];
  metadata: {
    timestamp: string;
    database: string;
    environment: string;
    type: string;
    tableCount: number;
    rowCount: number;
    fileSize: number;
  };
  error?: string;
}

/**
 * Create a database backup
 */
export async function createBackup(options: BackupOptions): Promise<BackupResult> {
  console.log(`🚀 Starting ${options.type} backup...`);
  
  try {
    // Load configuration
    const config = await loadDatabaseConfig(options.environment);
    console.log(`📋 Using database: ${config.database} (${config.environment})`);
    
    // Ensure output directory exists
    await fs.mkdir(options.outputDir, { recursive: true });
    
    // Create connection
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    
    console.log('✅ Connected to database');
    
    // Get tables to backup
    const tables = await getTablesForBackup(connection, options);
    console.log(`📋 Found ${tables.length} tables to backup`);
    
    // Generate backup content
    const timestamp = new Date().toISOString();
    const backupPrefix = getBackupPrefix(config, timestamp.replace(/[:.]/g, '-').slice(0, -5));
    
    let backupContent = '';
    let totalRows = 0;
    
    // Add header
    backupContent += `-- Enhanced Database Backup\n`;
    backupContent += `-- Database: ${config.database}\n`;
    backupContent += `-- Environment: ${config.environment}\n`;
    backupContent += `-- Type: ${options.type}\n`;
    backupContent += `-- Generated: ${timestamp}\n`;
    backupContent += `-- Host: ${config.host}:${config.port}\n\n`;
    
    // Add database creation statements
    if (options.type === 'schema' || options.type === 'complete') {
      if (options.includeDropStatements !== false) {
        backupContent += `DROP DATABASE IF EXISTS \`${config.database}\`;\n`;
      }
      backupContent += `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;\n`;
      backupContent += `USE \`${config.database}\`;\n\n`;
    }
    
    // Process each table
    for (const table of tables) {
      console.log(`  📄 Processing table: ${table}`);
      
      if (options.type === 'schema' || options.type === 'complete') {
        // Add table schema
        const schema = await getTableSchema(connection, table, options.includeDropStatements !== false);
        backupContent += schema + '\n\n';
      }
      
      if (options.type === 'data' || options.type === 'complete') {
        // Add table data
        const { data, rowCount } = await getTableData(connection, table);
        if (data) {
          backupContent += data + '\n\n';
        }
        totalRows += rowCount;
        console.log(`    ✅ ${rowCount} rows backed up`);
      } else {
        console.log(`    ✅ Schema backed up`);
      }
    }
    
    await connection.end();
    
    // Write backup file
    const backupFile = path.join(options.outputDir, `${backupPrefix}-${options.type}.sql`);
    await fs.writeFile(backupFile, backupContent);
    
    const stats = await fs.stat(backupFile);
    const fileSizeKB = Math.round(stats.size / 1024 * 100) / 100;
    
    console.log(`✅ Backup written to: ${backupFile} (${fileSizeKB} KB)`);
    
    // Create metadata file
    const metadata = {
      timestamp,
      database: config.database,
      environment: config.environment,
      type: options.type,
      tableCount: tables.length,
      rowCount: totalRows,
      fileSize: stats.size,
    };
    
    const metadataFile = path.join(options.outputDir, `${backupPrefix}-${options.type}-info.json`);
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
    
    const files = [backupFile, metadataFile];
    
    // Compress if requested
    if (options.compress) {
      const compressedFile = await compressBackup(backupFile);
      files.push(compressedFile);
      console.log(`📦 Compressed backup: ${compressedFile}`);
    }
    
    console.log('🎉 Backup completed successfully!');
    
    return {
      success: true,
      files,
      metadata,
    };
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    return {
      success: false,
      files: [],
      metadata: {
        timestamp: new Date().toISOString(),
        database: '',
        environment: options.environment || 'unknown',
        type: options.type,
        tableCount: 0,
        rowCount: 0,
        fileSize: 0,
      },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get list of tables to backup based on options
 */
async function getTablesForBackup(connection: mysql.Connection, options: BackupOptions): Promise<string[]> {
  const [rows] = await connection.execute('SHOW TABLES') as [any[], any];
  const allTables = rows.map(row => Object.values(row)[0] as string);
  
  let tables = allTables;
  
  // Apply include filter
  if (options.includeTables && options.includeTables.length > 0) {
    tables = tables.filter(table => options.includeTables!.includes(table));
  }
  
  // Apply exclude filter
  if (options.excludeTables && options.excludeTables.length > 0) {
    tables = tables.filter(table => !options.excludeTables!.includes(table));
  }
  
  return tables;
}

/**
 * Get table schema (CREATE TABLE statement)
 */
async function getTableSchema(connection: mysql.Connection, tableName: string, includeDropStatement: boolean): Promise<string> {
  let schema = '';
  
  if (includeDropStatement) {
    schema += `-- Table: ${tableName}\n`;
    schema += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
  }
  
  const [rows] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``) as [any[], any];
  const createStatement = rows[0]['Create Table'];
  
  schema += createStatement + ';';
  
  return schema;
}

/**
 * Get table data (INSERT statements)
 */
async function getTableData(connection: mysql.Connection, tableName: string): Promise<{ data: string | null; rowCount: number }> {
  const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``) as [any[], any];
  
  if (rows.length === 0) {
    return { data: null, rowCount: 0 };
  }
  
  const columns = Object.keys(rows[0]);
  const columnsList = columns.map(col => `\`${col}\``).join(', ');
  
  let data = `-- Data for table: ${tableName}\n`;
  data += `INSERT INTO \`${tableName}\` (${columnsList}) VALUES\n`;
  
  const values = rows.map(row => {
    const rowValues = columns.map(col => {
      const value = row[col];
      if (value === null) return 'NULL';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
      if (typeof value === 'boolean') return value ? '1' : '0';
      if (value instanceof Date) {
        return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
      }
      return value;
    }).join(', ');
    return `(${rowValues})`;
  });
  
  data += values.join(',\n') + ';';
  
  return { data, rowCount: rows.length };
}

/**
 * Compress backup file using gzip
 */
async function compressBackup(backupFile: string): Promise<string> {
  const { spawn } = await import('child_process');
  const compressedFile = `${backupFile}.gz`;

  return new Promise((resolve, reject) => {
    const gzip = spawn('gzip', ['-c', backupFile]);
    const writeStream = require('fs').createWriteStream(compressedFile);

    gzip.stdout.pipe(writeStream);

    gzip.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('close', () => resolve(compressedFile));
  });
}

// CLI interface
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Enhanced Database Backup Script');
    console.log('');
    console.log('Usage:');
    console.log('  bun scripts/enhanced-backup.ts <type> [options]');
    console.log('');
    console.log('Backup Types:');
    console.log('  schema     Export database structure only');
    console.log('  data       Export data only');
    console.log('  complete   Export both structure and data');
    console.log('');
    console.log('Options:');
    console.log('  --env <environment>     Environment (development, staging, production)');
    console.log('  --output <directory>    Output directory (default: ./database-backups)');
    console.log('  --compress              Compress backup with gzip');
    console.log('  --no-drop               Don\'t include DROP statements');
    console.log('  --include <tables>      Include only specific tables (comma-separated)');
    console.log('  --exclude <tables>      Exclude specific tables (comma-separated)');
    console.log('');
    console.log('Examples:');
    console.log('  bun scripts/enhanced-backup.ts complete');
    console.log('  bun scripts/enhanced-backup.ts schema --env production');
    console.log('  bun scripts/enhanced-backup.ts data --compress --output ./prod-backups');
    console.log('  bun scripts/enhanced-backup.ts complete --exclude "__drizzle_migrations"');
    process.exit(0);
  }

  const type = args[0] as 'schema' | 'data' | 'complete';
  if (!['schema', 'data', 'complete'].includes(type)) {
    console.error('❌ Invalid backup type. Use: schema, data, or complete');
    process.exit(1);
  }

  // Parse options
  const options: BackupOptions = {
    type,
    outputDir: './database-backups',
    compress: false,
    includeDropStatements: true,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--env':
        options.environment = args[++i];
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--compress':
        options.compress = true;
        break;
      case '--no-drop':
        options.includeDropStatements = false;
        break;
      case '--include':
        options.includeTables = args[++i]?.split(',').map(t => t.trim());
        break;
      case '--exclude':
        options.excludeTables = args[++i]?.split(',').map(t => t.trim());
        break;
      default:
        if (arg.startsWith('--')) {
          console.error(`❌ Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }

  // Run backup
  const result = await createBackup(options);

  if (!result.success) {
    console.error('❌ Backup failed:', result.error);
    process.exit(1);
  }

  console.log('\n📋 Backup Summary:');
  console.log(`  Environment: ${result.metadata.environment}`);
  console.log(`  Database: ${result.metadata.database}`);
  console.log(`  Type: ${result.metadata.type}`);
  console.log(`  Tables: ${result.metadata.tableCount}`);
  console.log(`  Rows: ${result.metadata.rowCount}`);
  console.log(`  Size: ${Math.round(result.metadata.fileSize / 1024 * 100) / 100} KB`);
  console.log(`  Files: ${result.files.length}`);

  console.log('\n📁 Generated Files:');
  result.files.forEach(file => {
    console.log(`  - ${path.basename(file)}`);
  });
}
