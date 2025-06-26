import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function ensureImageColumns() {
  try {
    console.log("Ensuring images table has required columns...");
    
    // First, let's check what columns exist
    console.log("Checking current table structure...");
    const currentColumns = await db.execute(sql`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log("Current columns:");
    console.table(currentColumns);
    
    // Check if visible column exists
    const hasVisible = currentColumns.some((col: any) => col.COLUMN_NAME === 'visible');
    const hasLocalPath = currentColumns.some((col: any) => col.COLUMN_NAME === 'local_path');
    
    console.log(`\nColumn status:`);
    console.log(`- visible: ${hasVisible ? '✅ exists' : '❌ missing'}`);
    console.log(`- local_path: ${hasLocalPath ? '✅ exists' : '❌ missing'}`);
    
    // Add missing columns
    if (!hasVisible) {
      console.log("\nAdding 'visible' column...");
      await db.execute(sql`
        ALTER TABLE \`bakonykuti-t3_image\` 
        ADD COLUMN \`visible\` BOOLEAN NOT NULL DEFAULT TRUE
      `);
      console.log("✅ Added 'visible' column");
    }
    
    if (!hasLocalPath) {
      console.log("\nAdding 'local_path' column...");
      await db.execute(sql`
        ALTER TABLE \`bakonykuti-t3_image\` 
        ADD COLUMN \`local_path\` VARCHAR(1024) NULL
      `);
      console.log("✅ Added 'local_path' column");
    }
    
    if (hasVisible && hasLocalPath) {
      console.log("\n🎉 All required columns already exist!");
    } else {
      console.log("\n✅ Database schema updated successfully!");
    }
    
    // Update existing records to be visible
    console.log("\nEnsuring all existing images are visible...");
    const updateResult = await db.execute(sql`
      UPDATE \`bakonykuti-t3_image\` 
      SET \`visible\` = TRUE 
      WHERE \`visible\` IS NULL OR \`visible\` = FALSE
    `);
    console.log(`Updated ${updateResult.affectedRows} records to be visible`);
    
    // Show final table structure
    console.log("\nFinal table structure:");
    const finalColumns = await db.execute(sql`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image'
      ORDER BY ORDINAL_POSITION
    `);
    console.table(finalColumns);
    
    console.log("\n🎉 Phase 2 database schema update completed!");
    
  } catch (error) {
    console.error("❌ Error updating database schema:", error);
    process.exit(1);
  }
}

ensureImageColumns().catch(console.error);
