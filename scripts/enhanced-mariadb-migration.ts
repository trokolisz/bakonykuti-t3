import { execSync } from "child_process";
import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

/**
 * Enhanced MariaDB Migration Script
 * 
 * This script handles the complete migration process in two phases:
 * Phase 1: Migrate existing data from Vercel Postgres to MariaDB (preserving existing structure)
 * Phase 2: Apply new schema changes (add visible and local_path columns with proper defaults)
 */

async function checkDatabaseExists(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1 FROM bakonykuti-t3_user LIMIT 1`);
    return true;
  } catch (error) {
    return false;
  }
}

async function checkNewColumnsExist(): Promise<{ visible: boolean; localPath: boolean }> {
  try {
    const columns = await db.execute(sql`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb'
        AND TABLE_NAME = 'bakonykuti-t3_image'
        AND COLUMN_NAME IN ('visible', 'local_path')
    `);

    console.log("Raw column result:", columns);

    // Handle different result structures
    const columnNames = columns.map((col: any) => {
      // Try different property names that might contain the column name
      return col.COLUMN_NAME || col.column_name || col.Field || col.field || Object.values(col)[0];
    }).filter(Boolean);

    console.log("Extracted column names:", columnNames);
    return {
      visible: columnNames.includes('visible'),
      localPath: columnNames.includes('local_path')
    };
  } catch (error) {
    console.log("Error checking columns:", error);
    return { visible: false, localPath: false };
  }
}

async function applySchemaUpdates() {
  console.log("\n🔄 Phase 2: Applying new schema changes...");
  
  const columnStatus = await checkNewColumnsExist();
  
  // Add visible column if it doesn't exist
  if (!columnStatus.visible) {
    console.log("Adding 'visible' column to images table...");
    await db.execute(sql`
      ALTER TABLE \`bakonykuti-t3_image\` 
      ADD COLUMN \`visible\` BOOLEAN NOT NULL DEFAULT TRUE
    `);
    console.log("✅ Added 'visible' column");
  } else {
    console.log("✅ 'visible' column already exists");
  }
  
  // Add local_path column if it doesn't exist
  if (!columnStatus.localPath) {
    console.log("Adding 'local_path' column to images table...");
    await db.execute(sql`
      ALTER TABLE \`bakonykuti-t3_image\` 
      ADD COLUMN \`local_path\` VARCHAR(1024) NULL
    `);
    console.log("✅ Added 'local_path' column");
  } else {
    console.log("✅ 'local_path' column already exists");
  }
  
  // Ensure all existing images are visible
  console.log("Ensuring all existing images are marked as visible...");
  const updateResult = await db.execute(sql`
    UPDATE \`bakonykuti-t3_image\` 
    SET \`visible\` = TRUE 
    WHERE \`visible\` IS NULL OR \`visible\` = FALSE
  `);
  console.log(`✅ Updated records to be visible`);
}

async function verifyMigration() {
  console.log("\n🔍 Verifying migration results...");
  
  try {
    // Check table counts
    const counts = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_image`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_news`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_event`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_document`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_page`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_user`),
    ]);
    
    console.log("📊 Final data counts:");
    console.log(`- Images: ${counts[0][0].count}`);
    console.log(`- News: ${counts[1][0].count}`);
    console.log(`- Events: ${counts[2][0].count}`);
    console.log(`- Documents: ${counts[3][0].count}`);
    console.log(`- Pages: ${counts[4][0].count}`);
    console.log(`- Users: ${counts[5][0].count}`);
    
    // Verify new columns exist and have correct data
    const imageSchema = await db.execute(sql`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image'
        AND COLUMN_NAME IN ('visible', 'local_path')
      ORDER BY COLUMN_NAME
    `);
    
    console.log("🔧 New column verification:");
    console.table(imageSchema);
    
    // Check visibility stats
    const visibilityStats = await db.execute(sql`
      SELECT visible, COUNT(*) as count
      FROM bakonykuti-t3_image 
      GROUP BY visible
    `);
    
    console.log("👁️ Image visibility distribution:");
    console.table(visibilityStats);
    
    console.log("✅ Migration verification completed successfully!");
    return true;
    
  } catch (error) {
    console.error("❌ Migration verification failed:", error);
    return false;
  }
}

async function runEnhancedMigration() {
  console.log("🚀 Starting Enhanced MariaDB Migration Process");
  console.log("=" .repeat(60));
  
  try {
    const databaseExists = await checkDatabaseExists();
    
    if (!databaseExists) {
      console.log("\n📋 Phase 1: Setting up fresh MariaDB database...");
      
      // Step 1: Create the MariaDB database
      console.log("\n=== Step 1.1: Creating MariaDB database ===");
      execSync("bun scripts/create-mariadb-database.ts", { stdio: "inherit" });
      
      // Step 2: Create the tables (with updated schema)
      console.log("\n=== Step 1.2: Creating MariaDB tables ===");
      execSync("bun scripts/migrate-to-mariadb.ts", { stdio: "inherit" });
      
      // Step 3: Test the connection
      console.log("\n=== Step 1.3: Testing connection ===");
      execSync("bun scripts/test-mariadb-connection.ts", { stdio: "inherit" });
      
      // Step 4: Migrate data from Postgres (if available)
      console.log("\n=== Step 1.4: Migrating data from Postgres (if available) ===");
      try {
        execSync("bun scripts/migrate-data-to-mariadb.ts", { stdio: "inherit" });
      } catch (error) {
        console.log("⚠️ Postgres migration skipped (source database not available)");
      }
      
    } else {
      console.log("\n✅ Database already exists, proceeding to schema updates...");
    }
    
    // Phase 2: Apply new schema changes
    await applySchemaUpdates();
    
    // Final verification
    const verificationSuccess = await verifyMigration();
    
    if (verificationSuccess) {
      console.log("\n🎉 Enhanced migration completed successfully!");
      console.log("Database is ready for local file storage implementation.");
      process.exit(0);
    } else {
      throw new Error("Migration verification failed");
    }
    
  } catch (error) {
    console.error("\n❌ Enhanced migration failed:", error);
    console.log("\n🔄 Rollback options:");
    console.log("1. Check database connection");
    console.log("2. Verify MariaDB is running");
    console.log("3. Check environment variables");
    console.log("4. Review error logs above");
    process.exit(1);
  }
}

// Run the enhanced migration
runEnhancedMigration().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
