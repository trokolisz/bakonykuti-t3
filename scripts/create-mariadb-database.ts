import mysql from "mysql2/promise";
import { env } from "../src/env";

async function createDatabase() {
  console.log("Connecting to MariaDB to create database...");
  
  // Create a connection to MariaDB without specifying a database
  const connection = await mysql.createConnection({
    host: env.MARIADB_HOST,
    port: env.MARIADB_PORT,
    user: env.MARIADB_USER,
    password: env.MARIADB_PASSWORD,
  }).catch(err => {
    console.error("Failed to connect to MariaDB:", err);
    process.exit(1);
  });
  
  try {
    console.log(`Creating database '${env.MARIADB_DATABASE}' if it doesn't exist...`);

    // Create the database if it doesn't exist
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS \`${env.MARIADB_DATABASE}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);

    console.log(`Database '${env.MARIADB_DATABASE}' created successfully!`);
    
    // Show all databases to verify
    const [rows] = await connection.execute("SHOW DATABASES");
    console.log("Available databases:");
    console.log(rows);
    
  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

createDatabase().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
