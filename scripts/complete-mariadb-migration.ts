import { execSync } from "child_process";

async function runMigration() {
  console.log("Starting complete MariaDB migration process...");
  
  try {
    // Step 1: Create the MariaDB database
    console.log("\n=== Step 1: Creating MariaDB database ===");
    execSync("bun scripts/create-mariadb-database.ts", { stdio: "inherit" });
    
    // Step 2: Create the tables
    console.log("\n=== Step 2: Creating MariaDB tables ===");
    execSync("bun scripts/create-mariadb-tables.ts", { stdio: "inherit" });
    
    // Step 3: Test the direct connection
    console.log("\n=== Step 3: Testing direct connection ===");
    execSync("bun scripts/test-direct-mariadb-connection.ts", { stdio: "inherit" });
    
    // Step 4: Migrate data from Postgres to MariaDB
    console.log("\n=== Step 4: Migrating data from Postgres to MariaDB ===");
    execSync("bun scripts/migrate-data-to-mariadb.ts", { stdio: "inherit" });
    
    // Step 5: Test the Drizzle ORM connection
    console.log("\n=== Step 5: Testing Drizzle ORM connection ===");
    execSync("bun scripts/test-mariadb-connection.ts", { stdio: "inherit" });
    
    console.log("\n=== Migration completed successfully! ===");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
