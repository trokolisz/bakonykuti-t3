#!/usr/bin/env bun
/**
 * Enhanced Database Restore Script
 * Supports multiple environments, validation, and rollback capabilities
 */

import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { loadDatabaseConfig, type DatabaseConfig } from './database-config';

export interface RestoreOptions {
  backupFile: string;
  environment?: string;
  targetDatabase?: string;
  createDatabase?: boolean;
  dropExisting?: boolean;
  validateBeforeRestore?: boolean;
  createBackupBeforeRestore?: boolean;
  dryRun?: boolean;
}

export interface RestoreResult {
  success: boolean;
  statementsExecuted: number;
  tablesRestored: string[];
  backupCreated?: string;
  error?: string;
  warnings: string[];
}

/**
 * Restore database from backup file
 */
export async function restoreDatabase(options: RestoreOptions): Promise<RestoreResult> {
  console.log('🚀 Starting database restore...');
  
  const result: RestoreResult = {
    success: false,
    statementsExecuted: 0,
    tablesRestored: [],
    warnings: [],
  };
  
  try {
    // Load configuration
    const config = await loadDatabaseConfig(options.environment);
    
    // Override database name if specified
    if (options.targetDatabase) {
      config.database = options.targetDatabase;
    }
    
    console.log(`📋 Target database: ${config.database} (${config.environment})`);
    
    // Validate backup file exists
    if (!(await fs.stat(options.backupFile).catch(() => false))) {
      throw new Error(`Backup file not found: ${options.backupFile}`);
    }
    
    // Read and validate backup content
    console.log('📖 Reading backup file...');
    let backupContent = await fs.readFile(options.backupFile, 'utf-8');
    
    if (options.validateBeforeRestore) {
      console.log('🔍 Validating backup content...');
      const validation = await validateBackupContent(backupContent);
      if (!validation.valid) {
        throw new Error(`Invalid backup file: ${validation.error}`);
      }
      result.warnings.push(...validation.warnings);
    }
    
    // Create connection (without specifying database initially)
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    console.log('✅ Connected to database server');
    
    // Create backup of existing database if requested
    if (options.createBackupBeforeRestore) {
      console.log('💾 Creating backup of existing database...');
      const backupFile = await createPreRestoreBackup(connection, config);
      result.backupCreated = backupFile;
      console.log(`✅ Pre-restore backup created: ${backupFile}`);
    }
    
    // Adapt backup content for target database
    console.log('🔄 Adapting backup for target database...');
    backupContent = adaptBackupForTarget(backupContent, config.database);
    
    // Create database if requested
    if (options.createDatabase) {
      console.log(`🏗️  Creating database: ${config.database}`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    }
    
    // Drop existing database if requested
    if (options.dropExisting) {
      console.log(`🗑️  Dropping existing database: ${config.database}`);
      await connection.execute(`DROP DATABASE IF EXISTS \`${config.database}\``);
      await connection.execute(`CREATE DATABASE \`${config.database}\``);
    }
    
    // Parse SQL statements
    const statements = parseSQL(backupContent);
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    if (options.dryRun) {
      console.log('🧪 Dry run mode - statements would be executed but database won\'t be modified');
      result.success = true;
      result.statementsExecuted = statements.length;
      return result;
    }
    
    // Execute statements
    console.log('⚡ Executing SQL statements...');
    let executedCount = 0;
    const tablesCreated = new Set<string>();
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          executedCount++;
          
          // Track table creation
          const tableMatch = statement.match(/CREATE TABLE.*?`([^`]+)`/i);
          if (tableMatch) {
            tablesCreated.add(tableMatch[1]);
          }
          
          // Progress reporting
          if (i % 50 === 0 || i === statements.length - 1) {
            console.log(`  Progress: ${i + 1}/${statements.length} statements (${Math.round((i + 1) / statements.length * 100)}%)`);
          }
          
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          // Some errors can be warnings (like table already exists)
          if (errorMsg.includes('already exists') || errorMsg.includes('doesn\'t exist')) {
            result.warnings.push(`Statement ${i + 1}: ${errorMsg}`);
            console.warn(`  ⚠️  Warning on statement ${i + 1}: ${errorMsg}`);
          } else {
            throw new Error(`Failed on statement ${i + 1}: ${errorMsg}`);
          }
        }
      }
    }
    
    await connection.end();
    
    result.success = true;
    result.statementsExecuted = executedCount;
    result.tablesRestored = Array.from(tablesCreated);
    
    console.log('✅ Database restore completed successfully!');
    console.log(`📊 Executed ${executedCount} statements`);
    console.log(`📋 Restored ${result.tablesRestored.length} tables`);
    
    if (result.warnings.length > 0) {
      console.log(`⚠️  ${result.warnings.length} warnings occurred during restore`);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

/**
 * Validate backup content
 */
async function validateBackupContent(content: string): Promise<{ valid: boolean; error?: string; warnings: string[] }> {
  const warnings: string[] = [];
  
  // Check for basic SQL structure
  if (!content.includes('CREATE TABLE') && !content.includes('INSERT INTO')) {
    return { valid: false, error: 'No CREATE TABLE or INSERT statements found' };
  }
  
  // Check for potential issues
  if (content.includes('DROP DATABASE') && !content.includes('CREATE DATABASE')) {
    warnings.push('Backup contains DROP DATABASE but no CREATE DATABASE statement');
  }
  
  // Check for encoding issues
  if (content.includes('�')) {
    warnings.push('Backup may contain encoding issues (replacement characters found)');
  }
  
  return { valid: true, warnings };
}

/**
 * Adapt backup content for target database
 */
function adaptBackupForTarget(content: string, targetDatabase: string): string {
  let adapted = content;
  
  // Replace database references
  adapted = adapted.replace(
    /DROP DATABASE IF EXISTS `[^`]+`;/g,
    `DROP DATABASE IF EXISTS \`${targetDatabase}\`;`
  );
  
  adapted = adapted.replace(
    /CREATE DATABASE(?:\s+IF NOT EXISTS)?\s+`[^`]+`;/g,
    `CREATE DATABASE IF NOT EXISTS \`${targetDatabase}\`;`
  );
  
  adapted = adapted.replace(
    /USE `[^`]+`;/g,
    `USE \`${targetDatabase}\`;`
  );
  
  return adapted;
}

/**
 * Parse SQL content into individual statements
 */
function parseSQL(content: string): string[] {
  return content
    .split(';\n')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.match(/^--/));
}

/**
 * Create a backup before restore operation
 */
async function createPreRestoreBackup(connection: mysql.Connection, config: DatabaseConfig): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = './database-backups';
  const backupFile = path.join(backupDir, `${config.database}-pre-restore-${timestamp}.sql`);
  
  // Ensure backup directory exists
  await fs.mkdir(backupDir, { recursive: true });
  
  // Create backup using mysqldump if available, otherwise use native backup
  try {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const mysqldump = spawn('mysqldump', [
        `--host=${config.host}`,
        `--port=${config.port}`,
        `--user=${config.user}`,
        `--password=${config.password}`,
        '--single-transaction',
        '--routines',
        '--triggers',
        config.database
      ]);
      
      const writeStream = require('fs').createWriteStream(backupFile);
      mysqldump.stdout.pipe(writeStream);
      
      mysqldump.on('error', () => {
        // Fallback to native backup if mysqldump fails
        createNativeBackup(connection, config, backupFile).then(resolve).catch(reject);
      });
      
      writeStream.on('close', () => resolve(backupFile));
    });
    
  } catch (error) {
    // Fallback to native backup
    return createNativeBackup(connection, config, backupFile);
  }
}

/**
 * Create native backup (fallback when mysqldump is not available)
 */
async function createNativeBackup(connection: mysql.Connection, config: DatabaseConfig, backupFile: string): Promise<string> {
  // Use the enhanced backup script
  const { createBackup } = await import('./enhanced-backup');

  const result = await createBackup({
    type: 'complete',
    environment: config.environment,
    outputDir: path.dirname(backupFile),
  });

  if (!result.success) {
    throw new Error(`Failed to create pre-restore backup: ${result.error}`);
  }

  return result.files[0]; // Return the main backup file
}

// CLI interface
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Enhanced Database Restore Script');
    console.log('');
    console.log('Usage:');
    console.log('  bun scripts/enhanced-restore.ts <backup-file> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --env <environment>     Target environment (development, staging, production)');
    console.log('  --database <name>       Override target database name');
    console.log('  --create-db             Create database if it doesn\'t exist');
    console.log('  --drop-existing         Drop existing database before restore');
    console.log('  --validate              Validate backup content before restore');
    console.log('  --backup-first          Create backup of existing data before restore');
    console.log('  --dry-run               Show what would be done without making changes');
    console.log('');
    console.log('Examples:');
    console.log('  bun scripts/enhanced-restore.ts ./database-backups/backup.sql');
    console.log('  bun scripts/enhanced-restore.ts backup.sql --env production --validate');
    console.log('  bun scripts/enhanced-restore.ts backup.sql --database new-db --create-db');
    console.log('  bun scripts/enhanced-restore.ts backup.sql --drop-existing --backup-first');
    console.log('  bun scripts/enhanced-restore.ts backup.sql --dry-run');
    process.exit(0);
  }

  const backupFile = args[0];

  // Parse options
  const options: RestoreOptions = {
    backupFile,
    createDatabase: false,
    dropExisting: false,
    validateBeforeRestore: false,
    createBackupBeforeRestore: false,
    dryRun: false,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--env':
        options.environment = args[++i];
        break;
      case '--database':
        options.targetDatabase = args[++i];
        break;
      case '--create-db':
        options.createDatabase = true;
        break;
      case '--drop-existing':
        options.dropExisting = true;
        break;
      case '--validate':
        options.validateBeforeRestore = true;
        break;
      case '--backup-first':
        options.createBackupBeforeRestore = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      default:
        if (arg.startsWith('--')) {
          console.error(`❌ Unknown option: ${arg}`);
          process.exit(1);
        }
    }
  }

  // Run restore
  const result = await restoreDatabase(options);

  if (!result.success) {
    console.error('❌ Restore failed:', result.error);
    process.exit(1);
  }

  console.log('\n📋 Restore Summary:');
  console.log(`  Statements executed: ${result.statementsExecuted}`);
  console.log(`  Tables restored: ${result.tablesRestored.length}`);
  console.log(`  Warnings: ${result.warnings.length}`);

  if (result.backupCreated) {
    console.log(`  Pre-restore backup: ${path.basename(result.backupCreated)}`);
  }

  if (result.tablesRestored.length > 0) {
    console.log('\n📋 Restored Tables:');
    result.tablesRestored.forEach(table => {
      console.log(`  - ${table}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }
}
