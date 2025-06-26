import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import mysql from "mysql2/promise";
import { env } from "../src/env";
import * as schema from "../src/server/db/schema";
import * as fs from "fs";
import * as path from "path";

// Create a temporary connection to Postgres
const pgDb = drizzle(sql, { schema });

// Create a connection to MariaDB
const mariaDbPool = mysql.createPool({
  host: env.MARIADB_HOST,
  port: env.MARIADB_PORT,
  user: env.MARIADB_USER,
  password: env.MARIADB_PASSWORD,
  database: env.MARIADB_DATABASE,
});

// We'll use mariaDbPool directly for queries instead of drizzle
// const mariaDb = drizzle(mariaDbPool, { schema, mode: 'default' });

async function exportTable(tableName: string) {
  console.log(`Exporting data from ${tableName}...`);

  // Query all data from the table - Using string concatenation for table name
  // This is safe because tableName comes from a fixed list in the code
  const fullTableName = `"bakonykuti-t3_${tableName}"`;
  const result = await sql.query(`SELECT * FROM ${fullTableName}`);
  const data = result.rows;

  // Save to a JSON file
  const exportDir = path.join(process.cwd(), "export");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const filePath = path.join(exportDir, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`Exported ${data.length} rows from ${tableName} to ${filePath}`);

  return data;
}

async function importTable(tableName: string, data: any[]) {
  console.log(`Importing data to ${tableName}...`);

  if (data.length === 0) {
    console.log(`No data to import for ${tableName}`);
    return;
  }

  // Prepare the column names
  const columns = Object.keys(data[0]);
  const columnsList = columns.map(col => `\`${col}\``).join(", ");

  // Prepare the values
  for (const row of data) {
    const values = columns.map(col => {
      const value = row[col];
      if (value === null) return "NULL";
      if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
      if (typeof value === "boolean") return value ? "1" : "0";
      // Handle date objects or date strings
      if (value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value)))) {
        const date = value instanceof Date ? value : new Date(value);
        return `'${date.toISOString().slice(0, 19).replace('T', ' ')}'`;
      }
      return value;
    }).join(", ");

    // Insert the row with IGNORE to skip duplicates
    await mariaDbPool.execute(`
      INSERT IGNORE INTO \`bakonykuti-t3_${tableName}\` (${columnsList})
      VALUES (${values})
    `);
  }

  console.log(`Imported ${data.length} rows to ${tableName}`);
}

async function migrateData() {
  try {
    console.log("Starting data migration from PostgreSQL to MariaDB...");

    // Tables to migrate
    const tables = [
      "user",
      "account",
      "session",
      "verificationToken",
      "image",
      "page",
      "news",
      "event",
      "document"
    ];

    // Export and import each table
    for (const table of tables) {
      const data = await exportTable(table);
      await importTable(table, data);
    }

    console.log("Data migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during data migration:", error);
    process.exit(1);
  } finally {
    // Close connections
    await mariaDbPool.end();
  }
}

migrateData().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

