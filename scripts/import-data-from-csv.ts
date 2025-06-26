import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";
import { env } from "../src/env";
import {
  DEFAULT_CSV_CONFIG,
  importTableFromCsv,
  validateCsvData,
  sanitizeSqlValue,
  logMigrationStep,
  createMigrationSummary,
  type MigrationStats
} from "../src/lib/csv-migration-utils";

// Create a connection to MariaDB
const mariaDbPool = mysql.createPool({
  host: env.MARIADB_HOST,
  port: env.MARIADB_PORT,
  user: env.MARIADB_USER,
  password: env.MARIADB_PASSWORD,
  database: env.MARIADB_DATABASE,
});

/**
 * Imports data from CSV to a specific MariaDB table
 */
async function importTableData(tableName: string): Promise<MigrationStats> {
  const stats: MigrationStats = {
    tableName,
    totalRows: 0,
    successfulRows: 0,
    failedRows: 0,
    errors: []
  };

  try {
    logMigrationStep("Starting import", tableName);
    
    // Import data from CSV
    const data = await importTableFromCsv(tableName, DEFAULT_CSV_CONFIG.exportDir);
    stats.totalRows = data.length;

    if (data.length === 0) {
      logMigrationStep("No data to import", tableName);
      return stats;
    }

    // Validate data before import
    const validation = validateCsvData(tableName, data);
    if (!validation.isValid) {
      stats.errors.push(...validation.errors);
      stats.failedRows = stats.totalRows;
      console.error(`Validation failed for table ${tableName}:`, validation.errors);
      return stats;
    }

    if (validation.warnings.length > 0) {
      console.warn(`Warnings for table ${tableName}:`, validation.warnings);
    }

    // Prepare column names
    const columns = Object.keys(data[0]);
    const columnsList = columns.map(col => `\`${col}\``).join(", ");

    // Import data row by row with error handling
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Prepare values for SQL insertion
        const values = columns.map(col => sanitizeSqlValue(row[col])).join(", ");

        // Insert the row with IGNORE to skip duplicates
        await mariaDbPool.execute(`
          INSERT IGNORE INTO \`bakonykuti-t3_${tableName}\` (${columnsList})
          VALUES (${values})
        `);

        stats.successfulRows++;
      } catch (error) {
        const errorMessage = `Row ${i + 1}: ${error instanceof Error ? error.message : String(error)}`;
        stats.errors.push(errorMessage);
        stats.failedRows++;
        console.error(`Error importing row ${i + 1} in table ${tableName}:`, error);
      }
    }

    logMigrationStep(`Import completed: ${stats.successfulRows}/${stats.totalRows} rows`, tableName);
    return stats;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    stats.errors.push(errorMessage);
    stats.failedRows = stats.totalRows;
    console.error(`Failed to import table ${tableName}:`, error);
    return stats;
  }
}

/**
 * Main import function
 */
async function importAllDataFromCsv(): Promise<void> {
  const stats: MigrationStats[] = [];
  
  try {
    logMigrationStep("Starting CSV import process");
    
    // Check if export directory exists
    if (!fs.existsSync(DEFAULT_CSV_CONFIG.exportDir)) {
      console.error(`Export directory not found: ${DEFAULT_CSV_CONFIG.exportDir}`);
      console.error("Please run the CSV export script first or ensure the migration-data folder exists");
      process.exit(1);
    }

    // Check for metadata file
    const metadataPath = path.join(DEFAULT_CSV_CONFIG.exportDir, 'export-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log(`\n=== Import Information ===`);
      console.log(`Source: ${metadata.sourceDatabase}`);
      console.log(`Export Date: ${metadata.exportDate}`);
      console.log(`Tables: ${metadata.tables.length}`);
      console.log(`Version: ${metadata.version}\n`);
    }

    // List available CSV files
    const csvFiles = fs.readdirSync(DEFAULT_CSV_CONFIG.exportDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => file.replace('.csv', ''));
    
    console.log(`Found CSV files for tables: ${csvFiles.join(', ')}`);

    // Import each table that has a CSV file
    for (const tableName of DEFAULT_CSV_CONFIG.tables) {
      if (csvFiles.includes(tableName)) {
        const tableStats = await importTableData(tableName);
        stats.push(tableStats);
      } else {
        console.log(`No CSV file found for table: ${tableName}, skipping...`);
        stats.push({
          tableName,
          totalRows: 0,
          successfulRows: 0,
          failedRows: 0,
          errors: [`No CSV file found for table ${tableName}`]
        });
      }
    }

    // Create summary report
    const summary = createMigrationSummary(stats);
    console.log(summary);
    
    // Save summary to file
    const summaryPath = path.join(DEFAULT_CSV_CONFIG.exportDir, 'import-summary.txt');
    fs.writeFileSync(summaryPath, summary);
    
    logMigrationStep("CSV import completed!");
    
    // Check for any critical failures
    const criticalFailures = stats.filter(stat => stat.failedRows > 0 && stat.successfulRows === 0);
    if (criticalFailures.length > 0) {
      console.warn("\n⚠️  Some tables failed to import completely:");
      for (const failure of criticalFailures) {
        console.warn(`  - ${failure.tableName}: ${failure.errors.join(', ')}`);
      }
    }

    console.log("\nNext steps:");
    console.log("1. Review the import-summary.txt file for any issues");
    console.log("2. Test your application with the imported data");
    console.log("3. Run database verification: bun db:verify-state");

  } catch (error) {
    console.error("Critical error during CSV import:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await mariaDbPool.end();
  }
}

/**
 * Test connection to MariaDB before starting import
 */
async function testConnection(): Promise<void> {
  try {
    logMigrationStep("Testing connection to MariaDB");
    await mariaDbPool.execute('SELECT 1 as test');
    logMigrationStep("Connection successful");
  } catch (error) {
    console.error("Failed to connect to MariaDB:", error);
    console.error("\nPlease ensure:");
    console.error("1. MariaDB is running on localhost:3306");
    console.error("2. The database 'bakonykuti-mariadb' exists");
    console.error("3. Your MARIADB_PASSWORD environment variable is set correctly");
    console.error("4. The required tables have been created (run: bun db:migrate-to-mariadb)");
    process.exit(1);
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    await testConnection();
    await importAllDataFromCsv();
    process.exit(0);
  } catch (error) {
    console.error("Unhandled error during import:", error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nImport process interrupted by user');
  mariaDbPool.end().then(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('\nImport process terminated');
  mariaDbPool.end().then(() => process.exit(1));
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
