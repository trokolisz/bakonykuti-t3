#!/usr/bin/env bun
/**
 * Complete Database Import/Restore Script
 * Restores a MariaDB database from backup files
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

interface ImportOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  backupDir: string;
  backupPrefix?: string;
  dropExisting: boolean;
  createDatabase: boolean;
}

async function importDatabase() {
  console.log('🚀 Starting database import/restore...\n');

  // Get configuration from environment or prompts
  const options: ImportOptions = {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
    backupDir: process.argv[2] || './database-backups',
    backupPrefix: process.argv[3],
    dropExisting: process.argv.includes('--drop-existing'),
    createDatabase: process.argv.includes('--create-database') || true,
  };

  // Prompt for password if not provided
  if (!options.password) {
    console.log('⚠️  Database password not found in environment variables.');
    console.log('Please set MARIADB_PASSWORD in your .env file or environment.');
    process.exit(1);
  }

  console.log('📋 Import Configuration:');
  console.log(`Host: ${options.host}:${options.port}`);
  console.log(`Database: ${options.database}`);
  console.log(`User: ${options.user}`);
  console.log(`Backup Directory: ${options.backupDir}`);
  console.log(`Drop Existing: ${options.dropExisting}`);
  console.log(`Create Database: ${options.createDatabase}\n`);

  try {
    // Find backup files
    console.log('🔍 Finding backup files...');
    const backupFiles = await findBackupFiles(options);
    console.log(`✅ Found backup files with prefix: ${backupFiles.prefix}`);

    // Test database connection
    console.log('🔌 Testing database connection...');
    await testConnection(options);
    console.log('✅ Database connection successful');

    // Create database if needed
    if (options.createDatabase) {
      console.log('📦 Creating database if it doesn\'t exist...');
      await createDatabase(options);
      console.log('✅ Database ready');
    }

    // Drop existing data if requested
    if (options.dropExisting) {
      console.log('🗑️  Dropping existing database...');
      await dropDatabase(options);
      await createDatabase(options);
      console.log('✅ Existing database dropped and recreated');
    }

    // Import schema first
    if (backupFiles.schema) {
      console.log('📦 Importing database schema...');
      await importSqlFile(options, backupFiles.schema);
      console.log('✅ Schema imported successfully');
    }

    // Import data
    if (backupFiles.data) {
      console.log('📊 Importing database data...');
      await importSqlFile(options, backupFiles.data);
      console.log('✅ Data imported successfully');
    } else if (backupFiles.complete) {
      console.log('🔄 Importing complete database...');
      await importSqlFile(options, backupFiles.complete);
      console.log('✅ Complete database imported successfully');
    }

    // Verify import
    console.log('🔍 Verifying import...');
    await verifyImport(options);
    console.log('✅ Import verification completed');

    console.log('\n🎉 Database import completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update your .env file with the correct database credentials');
    console.log('2. Start your application');
    console.log('3. Verify that all data is accessible and correct');
    console.log('4. Test file uploads and other functionality');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

async function findBackupFiles(options: ImportOptions): Promise<{
  prefix: string;
  schema?: string;
  data?: string;
  complete?: string;
  info?: string;
}> {
  const files = await fs.readdir(options.backupDir);
  
  // If prefix is provided, use it
  if (options.backupPrefix) {
    const prefix = options.backupPrefix;
    return {
      prefix,
      schema: files.find(f => f === `${prefix}-schema.sql`) ? path.join(options.backupDir, `${prefix}-schema.sql`) : undefined,
      data: files.find(f => f === `${prefix}-data.sql`) ? path.join(options.backupDir, `${prefix}-data.sql`) : undefined,
      complete: files.find(f => f === `${prefix}-complete.sql`) ? path.join(options.backupDir, `${prefix}-complete.sql`) : undefined,
      info: files.find(f => f === `${prefix}-info.json`) ? path.join(options.backupDir, `${prefix}-info.json`) : undefined,
    };
  }

  // Find the most recent backup
  const backupFiles = files.filter(f => f.includes('-complete.sql') || f.includes('-schema.sql'));
  if (backupFiles.length === 0) {
    throw new Error('No backup files found in the specified directory');
  }

  // Extract prefix from the most recent file
  const sortedFiles = backupFiles.sort().reverse();
  const latestFile = sortedFiles[0];
  const prefix = latestFile.replace(/-(?:complete|schema|data)\.sql$/, '');

  return {
    prefix,
    schema: files.find(f => f === `${prefix}-schema.sql`) ? path.join(options.backupDir, `${prefix}-schema.sql`) : undefined,
    data: files.find(f => f === `${prefix}-data.sql`) ? path.join(options.backupDir, `${prefix}-data.sql`) : undefined,
    complete: files.find(f => f === `${prefix}-complete.sql`) ? path.join(options.backupDir, `${prefix}-complete.sql`) : undefined,
    info: files.find(f => f === `${prefix}-info.json`) ? path.join(options.backupDir, `${prefix}-info.json`) : undefined,
  };
}

async function testConnection(options: ImportOptions): Promise<void> {
  const connection = await mysql.createConnection({
    host: options.host,
    port: options.port,
    user: options.user,
    password: options.password,
  });

  await connection.execute('SELECT 1');
  await connection.end();
}

async function createDatabase(options: ImportOptions): Promise<void> {
  const connection = await mysql.createConnection({
    host: options.host,
    port: options.port,
    user: options.user,
    password: options.password,
  });

  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${options.database}\``);
  await connection.end();
}

async function dropDatabase(options: ImportOptions): Promise<void> {
  const connection = await mysql.createConnection({
    host: options.host,
    port: options.port,
    user: options.user,
    password: options.password,
  });

  await connection.execute(`DROP DATABASE IF EXISTS \`${options.database}\``);
  await connection.end();
}

async function importSqlFile(options: ImportOptions, sqlFile: string): Promise<void> {
  // First, adapt the SQL file to use the target database name
  console.log('🔄 Adapting backup for target database...');
  const fs = require('fs').promises;
  const sqlContent = await fs.readFile(sqlFile, 'utf-8');

  let adaptedContent = sqlContent;

  // Replace any database name with the target database name
  adaptedContent = adaptedContent.replace(
    /DROP DATABASE IF EXISTS `[^`]+`;/g,
    `DROP DATABASE IF EXISTS \`${options.database}\`;`
  );

  adaptedContent = adaptedContent.replace(
    /CREATE DATABASE `[^`]+`;/g,
    `CREATE DATABASE \`${options.database}\`;`
  );

  adaptedContent = adaptedContent.replace(
    /USE `[^`]+`;/g,
    `USE \`${options.database}\`;`
  );

  console.log(`✅ Adapted backup to use database: ${options.database}`);

  // Write adapted content to a temporary file
  const tempFile = sqlFile + '.adapted';
  await fs.writeFile(tempFile, adaptedContent);

  return new Promise((resolve, reject) => {
    const args = [
      `--host=${options.host}`,
      `--port=${options.port}`,
      `--user=${options.user}`,
      `--password=${options.password}`,
      options.database
    ];

    const mysql = spawn('mysql', args);
    const readStream = require('fs').createReadStream(tempFile);

    readStream.pipe(mysql.stdin);

    mysql.stderr.on('data', (data) => {
      const errorMsg = data.toString();
      // Ignore common warnings
      if (!errorMsg.includes('Warning') && !errorMsg.includes('Note')) {
        console.error('mysql stderr:', errorMsg);
      }
    });

    mysql.on('close', async (code) => {
      // Clean up temporary file
      try {
        await fs.unlink(tempFile);
      } catch (error) {
        // Ignore cleanup errors
      }

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysql import exited with code ${code}`));
      }
    });
  });
}

async function verifyImport(options: ImportOptions): Promise<void> {
  const connection = await mysql.createConnection({
    host: options.host,
    port: options.port,
    user: options.user,
    password: options.password,
    database: options.database,
  });

  // Check tables exist
  const [tables] = await connection.execute(`
    SELECT TABLE_NAME, TABLE_ROWS 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = ?
    ORDER BY TABLE_NAME
  `, [options.database]);

  console.log('\n📊 Imported Tables:');
  console.table(tables);

  // Check if key tables exist
  const expectedTables = [
    'bakonykuti-t3_user',
    'bakonykuti-t3_image', 
    'bakonykuti-t3_news',
    'bakonykuti-t3_event',
    'bakonykuti-t3_document',
    'bakonykuti-t3_page',
    'bakonykuti-t3_file'
  ];

  const tableNames = (tables as any[]).map(t => t.TABLE_NAME);
  const missingTables = expectedTables.filter(t => !tableNames.includes(t));

  if (missingTables.length > 0) {
    console.warn('⚠️  Missing expected tables:', missingTables);
  } else {
    console.log('✅ All expected tables are present');
  }

  await connection.end();
}

// Show usage if no arguments provided
if (process.argv.length < 3) {
  console.log('📋 Database Import Usage:');
  console.log('');
  console.log('Basic usage:');
  console.log('  bun run scripts/import-database.ts <backup-directory> [backup-prefix]');
  console.log('');
  console.log('Options:');
  console.log('  --drop-existing    Drop existing database before import');
  console.log('  --create-database  Create database if it doesn\'t exist (default)');
  console.log('');
  console.log('Examples:');
  console.log('  bun run scripts/import-database.ts ./database-backups');
  console.log('  bun run scripts/import-database.ts ./backups bakonykuti-mariadb-backup-2025-01-15T10-30-00');
  console.log('  bun run scripts/import-database.ts ./backups --drop-existing');
  console.log('');
  console.log('Environment Variables:');
  console.log('  MARIADB_HOST      Database host (default: localhost)');
  console.log('  MARIADB_PORT      Database port (default: 3306)');
  console.log('  MARIADB_USER      Database user (default: root)');
  console.log('  MARIADB_PASSWORD  Database password (required)');
  console.log('  MARIADB_DATABASE  Database name (default: bakonykuti-mariadb)');
  process.exit(0);
}

// Run the import
importDatabase();
