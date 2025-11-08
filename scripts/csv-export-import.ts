#!/usr/bin/env bun
/**
 * CSV Export/Import System
 * Export and import database tables to/from CSV format
 */

import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { loadDatabaseConfig, type DatabaseConfig } from './database-config';

export interface CSVExportOptions {
  environment?: string;
  outputDir: string;
  tables?: string[];
  excludeTables?: string[];
  includeHeaders?: boolean;
  delimiter?: string;
  quote?: string;
  escape?: string;
}

export interface CSVImportOptions {
  environment?: string;
  inputDir: string;
  tables?: string[];
  createTables?: boolean;
  truncateFirst?: boolean;
  includeHeaders?: boolean;
  delimiter?: string;
  quote?: string;
  batchSize?: number;
}

export interface CSVResult {
  success: boolean;
  tablesProcessed: string[];
  rowsProcessed: number;
  filesCreated?: string[];
  error?: string;
  warnings: string[];
}

/**
 * Export database tables to CSV files
 */
export async function exportToCSV(options: CSVExportOptions): Promise<CSVResult> {
  console.log('🚀 Starting CSV export...');
  
  const result: CSVResult = {
    success: false,
    tablesProcessed: [],
    rowsProcessed: 0,
    filesCreated: [],
    warnings: [],
  };
  
  try {
    // Load configuration
    const config = await loadDatabaseConfig(options.environment);
    console.log(`📋 Exporting from database: ${config.database} (${config.environment})`);
    
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
    
    // Get tables to export
    const tables = await getTablesForProcessing(connection, options.tables, options.excludeTables);
    console.log(`📋 Found ${tables.length} tables to export`);
    
    // Export each table
    for (const table of tables) {
      console.log(`  📄 Exporting table: ${table}`);
      
      const csvFile = path.join(options.outputDir, `${table}.csv`);
      const rowCount = await exportTableToCSV(connection, table, csvFile, options);
      
      result.tablesProcessed.push(table);
      result.rowsProcessed += rowCount;
      result.filesCreated!.push(csvFile);
      
      console.log(`    ✅ ${rowCount} rows exported to ${path.basename(csvFile)}`);
    }
    
    await connection.end();
    
    // Create export metadata
    const metadataFile = path.join(options.outputDir, 'export-metadata.json');
    const metadata = {
      timestamp: new Date().toISOString(),
      database: config.database,
      environment: config.environment,
      tablesExported: result.tablesProcessed,
      totalRows: result.rowsProcessed,
      options: {
        delimiter: options.delimiter || ',',
        quote: options.quote || '"',
        includeHeaders: options.includeHeaders !== false,
      },
    };
    
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
    result.filesCreated!.push(metadataFile);
    
    result.success = true;
    console.log('🎉 CSV export completed successfully!');
    
    return result;
    
  } catch (error) {
    console.error('❌ CSV export failed:', error);
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

/**
 * Import CSV files to database tables
 */
export async function importFromCSV(options: CSVImportOptions): Promise<CSVResult> {
  console.log('🚀 Starting CSV import...');
  
  const result: CSVResult = {
    success: false,
    tablesProcessed: [],
    rowsProcessed: 0,
    warnings: [],
  };
  
  try {
    // Load configuration
    const config = await loadDatabaseConfig(options.environment);
    console.log(`📋 Importing to database: ${config.database} (${config.environment})`);
    
    // Create connection
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    
    console.log('✅ Connected to database');
    
    // Get CSV files to import
    const csvFiles = await getCSVFilesForImport(options.inputDir, options.tables);
    console.log(`📋 Found ${csvFiles.length} CSV files to import`);
    
    // Import each file
    for (const csvFile of csvFiles) {
      const tableName = path.basename(csvFile, '.csv');
      console.log(`  📄 Importing table: ${tableName}`);
      
      // Truncate table if requested
      if (options.truncateFirst) {
        try {
          await connection.execute(`TRUNCATE TABLE \`${tableName}\``);
          console.log(`    🗑️  Truncated table: ${tableName}`);
        } catch (error) {
          result.warnings.push(`Could not truncate table ${tableName}: ${error}`);
        }
      }
      
      const rowCount = await importCSVToTable(connection, tableName, csvFile, options);
      
      result.tablesProcessed.push(tableName);
      result.rowsProcessed += rowCount;
      
      console.log(`    ✅ ${rowCount} rows imported from ${path.basename(csvFile)}`);
    }
    
    await connection.end();
    
    result.success = true;
    console.log('🎉 CSV import completed successfully!');
    
    return result;
    
  } catch (error) {
    console.error('❌ CSV import failed:', error);
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

/**
 * Get tables for processing based on options
 */
async function getTablesForProcessing(
  connection: mysql.Connection,
  includeTables?: string[],
  excludeTables?: string[]
): Promise<string[]> {
  const [rows] = await connection.execute('SHOW TABLES') as [any[], any];
  let tables = rows.map(row => Object.values(row)[0] as string);
  
  // Apply include filter
  if (includeTables && includeTables.length > 0) {
    tables = tables.filter(table => includeTables.includes(table));
  }
  
  // Apply exclude filter
  if (excludeTables && excludeTables.length > 0) {
    tables = tables.filter(table => !excludeTables.includes(table));
  }
  
  return tables;
}

/**
 * Export a single table to CSV
 */
async function exportTableToCSV(
  connection: mysql.Connection,
  tableName: string,
  csvFile: string,
  options: CSVExportOptions
): Promise<number> {
  const delimiter = options.delimiter || ',';
  const quote = options.quote || '"';
  const includeHeaders = options.includeHeaders !== false;
  
  // Get table data
  const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``) as [any[], any];
  
  if (rows.length === 0) {
    await fs.writeFile(csvFile, '');
    return 0;
  }
  
  const columns = Object.keys(rows[0]);
  let csvContent = '';
  
  // Add headers if requested
  if (includeHeaders) {
    csvContent += columns.map(col => `${quote}${col}${quote}`).join(delimiter) + '\n';
  }
  
  // Add data rows
  for (const row of rows) {
    const values = columns.map(col => {
      const value = row[col];
      if (value === null) return '';
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes
        const escaped = value.replace(new RegExp(quote, 'g'), quote + quote);
        return `${quote}${escaped}${quote}`;
      }
      if (value instanceof Date) {
        return `${quote}${value.toISOString()}${quote}`;
      }
      return String(value);
    });
    
    csvContent += values.join(delimiter) + '\n';
  }
  
  await fs.writeFile(csvFile, csvContent);
  return rows.length;
}

/**
 * Get CSV files for import
 */
async function getCSVFilesForImport(inputDir: string, tables?: string[]): Promise<string[]> {
  const files = await fs.readdir(inputDir);
  let csvFiles = files
    .filter(file => file.endsWith('.csv') && file !== 'export-metadata.json')
    .map(file => path.join(inputDir, file));
  
  // Filter by table names if specified
  if (tables && tables.length > 0) {
    csvFiles = csvFiles.filter(file => {
      const tableName = path.basename(file, '.csv');
      return tables.includes(tableName);
    });
  }
  
  return csvFiles;
}

/**
 * Import CSV file to table
 */
async function importCSVToTable(
  connection: mysql.Connection,
  tableName: string,
  csvFile: string,
  options: CSVImportOptions
): Promise<number> {
  const delimiter = options.delimiter || ',';
  const quote = options.quote || '"';
  const includeHeaders = options.includeHeaders !== false;
  const batchSize = options.batchSize || 1000;
  
  // Read CSV content
  const csvContent = await fs.readFile(csvFile, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  if (lines.length === 0) {
    return 0;
  }
  
  // Parse CSV
  const rows = lines.map(line => parseCSVLine(line, delimiter, quote));
  
  let dataRows = rows;
  let columns: string[] = [];
  
  if (includeHeaders && rows.length > 0) {
    columns = rows[0];
    dataRows = rows.slice(1);
  } else {
    // Get column names from table structure
    const [tableInfo] = await connection.execute(`DESCRIBE \`${tableName}\``) as [any[], any];
    columns = tableInfo.map((col: any) => col.Field);
  }
  
  if (dataRows.length === 0) {
    return 0;
  }
  
  // Insert data in batches
  let totalInserted = 0;
  const columnsList = columns.map(col => `\`${col}\``).join(', ');
  
  for (let i = 0; i < dataRows.length; i += batchSize) {
    const batch = dataRows.slice(i, i + batchSize);
    
    const values = batch.map(row => {
      const rowValues = row.map(value => {
        if (value === '' || value === null) return 'NULL';
        if (value === 'true') return '1';
        if (value === 'false') return '0';
        // Check if it's a number
        if (!isNaN(Number(value)) && value !== '') return value;
        // Treat as string
        return `'${String(value).replace(/'/g, "''")}'`;
      }).join(', ');
      return `(${rowValues})`;
    });
    
    const sql = `INSERT INTO \`${tableName}\` (${columnsList}) VALUES ${values.join(', ')}`;
    
    try {
      await connection.execute(sql);
      totalInserted += batch.length;
    } catch (error) {
      console.warn(`  ⚠️  Failed to insert batch starting at row ${i + 1}: ${error}`);
    }
  }
  
  return totalInserted;
}

/**
 * Parse a CSV line respecting quotes and delimiters
 */
function parseCSVLine(line: string, delimiter: string, quote: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === quote) {
      if (inQuotes && line[i + 1] === quote) {
        // Escaped quote
        current += quote;
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  result.push(current);
  return result;
}

// CLI interface
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('CSV Export/Import System');
    console.log('');
    console.log('Usage:');
    console.log('  bun scripts/csv-export-import.ts export [options]');
    console.log('  bun scripts/csv-export-import.ts import <directory> [options]');
    console.log('');
    console.log('Export Options:');
    console.log('  --env <environment>     Environment (development, staging, production)');
    console.log('  --output <directory>    Output directory (default: ./csv-exports)');
    console.log('  --tables <tables>       Include only specific tables (comma-separated)');
    console.log('  --exclude <tables>      Exclude specific tables (comma-separated)');
    console.log('  --no-headers            Don\'t include column headers');
    console.log('  --delimiter <char>      CSV delimiter (default: ,)');
    console.log('  --quote <char>          Quote character (default: ")');
    console.log('');
    console.log('Import Options:');
    console.log('  --env <environment>     Environment (development, staging, production)');
    console.log('  --tables <tables>       Import only specific tables (comma-separated)');
    console.log('  --create-tables         Create tables if they don\'t exist');
    console.log('  --truncate              Truncate tables before import');
    console.log('  --no-headers            CSV files don\'t have headers');
    console.log('  --delimiter <char>      CSV delimiter (default: ,)');
    console.log('  --quote <char>          Quote character (default: ")');
    console.log('  --batch-size <size>     Batch size for inserts (default: 1000)');
    console.log('');
    console.log('Examples:');
    console.log('  bun scripts/csv-export-import.ts export');
    console.log('  bun scripts/csv-export-import.ts export --env production --output ./prod-csv');
    console.log('  bun scripts/csv-export-import.ts export --tables "users,orders" --exclude "logs"');
    console.log('  bun scripts/csv-export-import.ts import ./csv-exports');
    console.log('  bun scripts/csv-export-import.ts import ./data --truncate --env staging');
    process.exit(0);
  }

  const command = args[0];

  if (command === 'export') {
    // Parse export options
    const options: CSVExportOptions = {
      outputDir: './csv-exports',
      includeHeaders: true,
      delimiter: ',',
      quote: '"',
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
        case '--tables':
          options.tables = args[++i]?.split(',').map(t => t.trim());
          break;
        case '--exclude':
          options.excludeTables = args[++i]?.split(',').map(t => t.trim());
          break;
        case '--no-headers':
          options.includeHeaders = false;
          break;
        case '--delimiter':
          options.delimiter = args[++i];
          break;
        case '--quote':
          options.quote = args[++i];
          break;
        default:
          if (arg.startsWith('--')) {
            console.error(`❌ Unknown export option: ${arg}`);
            process.exit(1);
          }
      }
    }

    // Run export
    const result = await exportToCSV(options);

    if (!result.success) {
      console.error('❌ Export failed:', result.error);
      process.exit(1);
    }

    console.log('\n📋 Export Summary:');
    console.log(`  Tables processed: ${result.tablesProcessed.length}`);
    console.log(`  Rows exported: ${result.rowsProcessed}`);
    console.log(`  Files created: ${result.filesCreated?.length || 0}`);

  } else if (command === 'import') {
    if (args.length < 2) {
      console.error('❌ Import directory is required');
      process.exit(1);
    }

    const inputDir = args[1];

    // Parse import options
    const options: CSVImportOptions = {
      inputDir,
      createTables: false,
      truncateFirst: false,
      includeHeaders: true,
      delimiter: ',',
      quote: '"',
      batchSize: 1000,
    };

    for (let i = 2; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '--env':
          options.environment = args[++i];
          break;
        case '--tables':
          options.tables = args[++i]?.split(',').map(t => t.trim());
          break;
        case '--create-tables':
          options.createTables = true;
          break;
        case '--truncate':
          options.truncateFirst = true;
          break;
        case '--no-headers':
          options.includeHeaders = false;
          break;
        case '--delimiter':
          options.delimiter = args[++i];
          break;
        case '--quote':
          options.quote = args[++i];
          break;
        case '--batch-size':
          options.batchSize = parseInt(args[++i]);
          break;
        default:
          if (arg.startsWith('--')) {
            console.error(`❌ Unknown import option: ${arg}`);
            process.exit(1);
          }
      }
    }

    // Run import
    const result = await importFromCSV(options);

    if (!result.success) {
      console.error('❌ Import failed:', result.error);
      process.exit(1);
    }

    console.log('\n📋 Import Summary:');
    console.log(`  Tables processed: ${result.tablesProcessed.length}`);
    console.log(`  Rows imported: ${result.rowsProcessed}`);
    console.log(`  Warnings: ${result.warnings.length}`);

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }

  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.error('Use "export" or "import"');
    process.exit(1);
  }
}
