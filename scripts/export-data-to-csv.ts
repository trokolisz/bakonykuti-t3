import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";
import {
  DEFAULT_CSV_CONFIG,
  ensureExportDir,
  exportTableToCsv,
  logMigrationStep,
  createMigrationSummary,
  type MigrationStats
} from "../src/lib/csv-migration-utils";

// Create a connection to Postgres
const pgDb = drizzle(sql);

/**
 * Exports data from a specific table in Vercel Postgres
 */
async function exportTableData(tableName: string): Promise<Record<string, any>[]> {
  logMigrationStep("Starting export", tableName);
  
  try {
    // Query all data from the table - Using string concatenation for table name
    // This is safe because tableName comes from a fixed list in the code
    const fullTableName = `"bakonykuti-t3_${tableName}"`;
    const result = await sql.query(`SELECT * FROM ${fullTableName}`);
    const data = result.rows;

    logMigrationStep(`Found ${data.length} rows`, tableName);
    return data;
  } catch (error) {
    console.error(`Error exporting table ${tableName}:`, error);
    
    // Check if table doesn't exist
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.log(`Table ${tableName} does not exist in source database, skipping...`);
      return [];
    }
    
    throw error;
  }
}

/**
 * Main export function
 */
async function exportAllDataToCsv(): Promise<void> {
  const stats: MigrationStats[] = [];
  
  try {
    logMigrationStep("Starting CSV export process");
    
    // Ensure export directory exists
    await ensureExportDir(DEFAULT_CSV_CONFIG.exportDir);
    
    // Create metadata file with export information
    const metadata = {
      exportDate: new Date().toISOString(),
      sourceDatabase: "Vercel Postgres",
      targetFormat: "CSV",
      tables: DEFAULT_CSV_CONFIG.tables,
      version: "1.0"
    };
    
    const metadataPath = path.join(DEFAULT_CSV_CONFIG.exportDir, 'export-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    logMigrationStep("Created export metadata file");

    // Export each table
    for (const tableName of DEFAULT_CSV_CONFIG.tables) {
      const tableStats: MigrationStats = {
        tableName,
        totalRows: 0,
        successfulRows: 0,
        failedRows: 0,
        errors: []
      };

      try {
        // Export table data
        const data = await exportTableData(tableName);
        tableStats.totalRows = data.length;

        if (data.length > 0) {
          // Export to CSV
          await exportTableToCsv(tableName, data, DEFAULT_CSV_CONFIG.exportDir);
          tableStats.successfulRows = data.length;
          logMigrationStep(`Successfully exported`, tableName);
        } else {
          logMigrationStep(`No data found`, tableName);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        tableStats.errors.push(errorMessage);
        tableStats.failedRows = tableStats.totalRows;
        console.error(`Failed to export table ${tableName}:`, error);
      }

      stats.push(tableStats);
    }

    // Create summary report
    const summary = createMigrationSummary(stats);
    console.log(summary);
    
    // Save summary to file
    const summaryPath = path.join(DEFAULT_CSV_CONFIG.exportDir, 'export-summary.txt');
    fs.writeFileSync(summaryPath, summary);
    
    logMigrationStep("CSV export completed successfully!");
    
    // List exported files
    console.log("\n=== Exported Files ===");
    const files = fs.readdirSync(DEFAULT_CSV_CONFIG.exportDir);
    for (const file of files) {
      const filePath = path.join(DEFAULT_CSV_CONFIG.exportDir, file);
      const stats = fs.statSync(filePath);
      console.log(`${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
    
    console.log(`\nAll files exported to: ${DEFAULT_CSV_CONFIG.exportDir}`);
    console.log("\nNext steps:");
    console.log("1. Review the export-summary.txt file for any issues");
    console.log("2. Copy the migration-data folder to your target environment");
    console.log("3. Run the CSV import script: bun db:import-from-csv");

  } catch (error) {
    console.error("Critical error during CSV export:", error);
    process.exit(1);
  }
}

/**
 * Test connection to Vercel Postgres before starting export
 */
async function testConnection(): Promise<void> {
  try {
    logMigrationStep("Testing connection to Vercel Postgres");
    await sql.query('SELECT 1 as test');
    logMigrationStep("Connection successful");
  } catch (error) {
    console.error("Failed to connect to Vercel Postgres:", error);
    console.error("\nPlease ensure:");
    console.error("1. Your Vercel Postgres environment variables are set correctly");
    console.error("2. The database is accessible from your current environment");
    console.error("3. You have the necessary permissions to read from the database");
    process.exit(1);
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    await testConnection();
    await exportAllDataToCsv();
    process.exit(0);
  } catch (error) {
    console.error("Unhandled error during export:", error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nExport process interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\nExport process terminated');
  process.exit(1);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
