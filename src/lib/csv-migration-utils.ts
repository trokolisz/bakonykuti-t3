import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';

// Types for CSV migration
export interface CsvMigrationConfig {
  exportDir: string;
  tables: string[];
}

export interface TableData {
  tableName: string;
  data: Record<string, any>[];
  columns: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MigrationStats {
  tableName: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: string[];
}

// Default configuration
export const DEFAULT_CSV_CONFIG: CsvMigrationConfig = {
  exportDir: path.join(process.cwd(), 'migration-data'),
  tables: [
    'user',
    'account', 
    'session',
    'verificationToken',
    'image',
    'page',
    'news',
    'event',
    'document'
  ]
};

/**
 * Ensures the export directory exists
 */
export async function ensureExportDir(exportDir: string): Promise<void> {
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
    console.log(`Created export directory: ${exportDir}`);
  }
}

/**
 * Converts database values to CSV-safe strings
 */
export function convertValueForCsv(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    // Check if it's a date string
    const date = new Date(value);
    if (date.getTime() === date.getTime()) { // Valid date check
      return date.toISOString();
    }
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Converts CSV string values back to appropriate database types
 */
export function convertValueFromCsv(value: string, columnType?: string): any {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  
  // Handle boolean values
  if (value === '1' || value === 'true') {
    return true;
  }
  if (value === '0' || value === 'false') {
    return false;
  }
  
  // Handle dates (ISO string format)
  if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return new Date(value);
  }
  
  // Handle JSON objects
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value);
    } catch {
      // If JSON parsing fails, return as string
      return value;
    }
  }
  
  // Handle numbers
  if (!isNaN(Number(value)) && value !== '') {
    return Number(value);
  }
  
  return value;
}

/**
 * Exports table data to CSV file
 */
export async function exportTableToCsv(
  tableName: string, 
  data: Record<string, any>[], 
  exportDir: string
): Promise<void> {
  if (data.length === 0) {
    console.log(`No data to export for table: ${tableName}`);
    return;
  }

  const csvFilePath = path.join(exportDir, `${tableName}.csv`);
  const columns = Object.keys(data[0]);
  
  // Convert data for CSV export
  const csvData = data.map(row => {
    const convertedRow: Record<string, string> = {};
    for (const column of columns) {
      convertedRow[column] = convertValueForCsv(row[column]);
    }
    return convertedRow;
  });

  // Create CSV writer
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: columns.map(col => ({ id: col, title: col }))
  });

  await csvWriter.writeRecords(csvData);
  console.log(`Exported ${data.length} rows from ${tableName} to ${csvFilePath}`);
}

/**
 * Imports table data from CSV file
 */
export async function importTableFromCsv(
  tableName: string, 
  exportDir: string
): Promise<Record<string, any>[]> {
  const csvFilePath = path.join(exportDir, `${tableName}.csv`);
  
  if (!fs.existsSync(csvFilePath)) {
    console.log(`CSV file not found for table: ${tableName} at ${csvFilePath}`);
    return [];
  }

  return new Promise((resolve, reject) => {
    const results: Record<string, any>[] = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Convert CSV values back to appropriate types
        const convertedRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          convertedRow[key] = convertValueFromCsv(value as string);
        }
        results.push(convertedRow);
      })
      .on('end', () => {
        console.log(`Imported ${results.length} rows from ${csvFilePath}`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file ${csvFilePath}:`, error);
        reject(error);
      });
  });
}

/**
 * Validates CSV data before import
 */
export function validateCsvData(
  tableName: string,
  data: Record<string, any>[]
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (data.length === 0) {
    result.warnings.push(`Table ${tableName} has no data to import`);
    return result;
  }

  // Check for required columns based on table
  const requiredColumns = getRequiredColumns(tableName);
  const actualColumns = Object.keys(data[0]);

  for (const requiredCol of requiredColumns) {
    if (!actualColumns.includes(requiredCol)) {
      result.errors.push(`Missing required column '${requiredCol}' in table ${tableName}`);
      result.isValid = false;
    }
  }

  // Validate data types and constraints
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowErrors = validateRowData(tableName, row, i + 1);
    result.errors.push(...rowErrors);
    if (rowErrors.length > 0) {
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Gets required columns for each table
 */
function getRequiredColumns(tableName: string): string[] {
  const columnMap: Record<string, string[]> = {
    user: ['id', 'email'],
    account: ['userId', 'type', 'provider', 'providerAccountId'],
    session: ['sessionToken', 'userId', 'expires'],
    verificationToken: ['identifier', 'token', 'expires'],
    image: ['url'],
    page: ['title', 'content', 'slug'],
    news: ['title', 'content'],
    event: ['title', 'date'],
    document: ['title', 'category', 'date', 'fileUrl', 'fileSize']
  };

  return columnMap[tableName] || [];
}

/**
 * Validates individual row data
 */
function validateRowData(tableName: string, row: Record<string, any>, rowNumber: number): string[] {
  const errors: string[] = [];

  // Table-specific validations
  switch (tableName) {
    case 'user':
      if (!row.email || typeof row.email !== 'string') {
        errors.push(`Row ${rowNumber}: Invalid email in user table`);
      }
      break;

    case 'image':
      if (!row.url || typeof row.url !== 'string') {
        errors.push(`Row ${rowNumber}: Invalid URL in image table`);
      }
      break;

    case 'page':
      if (!row.slug || typeof row.slug !== 'string') {
        errors.push(`Row ${rowNumber}: Invalid slug in page table`);
      }
      break;

    case 'event':
      if (!row.date || isNaN(Date.parse(row.date))) {
        errors.push(`Row ${rowNumber}: Invalid date in event table`);
      }
      break;
  }

  return errors;
}

/**
 * Sanitizes SQL values for safe insertion
 */
export function sanitizeSqlValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'string') {
    // Escape single quotes and backslashes
    return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (value instanceof Date) {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }

  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }

  return String(value);
}

/**
 * Creates a summary of migration statistics
 */
export function createMigrationSummary(stats: MigrationStats[]): string {
  const totalTables = stats.length;
  const totalRows = stats.reduce((sum, stat) => sum + stat.totalRows, 0);
  const successfulRows = stats.reduce((sum, stat) => sum + stat.successfulRows, 0);
  const failedRows = stats.reduce((sum, stat) => sum + stat.failedRows, 0);

  let summary = `\n=== Migration Summary ===\n`;
  summary += `Tables processed: ${totalTables}\n`;
  summary += `Total rows: ${totalRows}\n`;
  summary += `Successful rows: ${successfulRows}\n`;
  summary += `Failed rows: ${failedRows}\n`;
  summary += `Success rate: ${totalRows > 0 ? ((successfulRows / totalRows) * 100).toFixed(2) : 0}%\n\n`;

  if (stats.some(stat => stat.errors.length > 0)) {
    summary += `=== Errors by Table ===\n`;
    for (const stat of stats) {
      if (stat.errors.length > 0) {
        summary += `${stat.tableName}:\n`;
        for (const error of stat.errors) {
          summary += `  - ${error}\n`;
        }
      }
    }
  }

  return summary;
}

/**
 * Logs migration progress with timestamps
 */
export function logMigrationStep(step: string, tableName?: string): void {
  const timestamp = new Date().toISOString();
  const message = tableName ? `[${timestamp}] ${step} - ${tableName}` : `[${timestamp}] ${step}`;
  console.log(message);
}
