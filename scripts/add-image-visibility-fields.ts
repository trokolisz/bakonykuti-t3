#!/usr/bin/env bun
import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function addImageVisibilityFields() {
  console.log("Adding visibility and localPath fields to images table...");

  try {
    // Check if visible column already exists
    const visibleColumnExists = await db.execute(sql`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image' 
        AND COLUMN_NAME = 'visible'
    `);

    if (visibleColumnExists.length === 0) {
      console.log("Adding 'visible' column...");
      await db.execute(sql`
        ALTER TABLE bakonykuti-t3_image 
        ADD COLUMN visible BOOLEAN NOT NULL DEFAULT TRUE
      `);
      console.log("✓ Added 'visible' column");
    } else {
      console.log("✓ 'visible' column already exists");
    }

    // Check if localPath column already exists
    const localPathColumnExists = await db.execute(sql`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image' 
        AND COLUMN_NAME = 'local_path'
    `);

    if (localPathColumnExists.length === 0) {
      console.log("Adding 'local_path' column...");
      await db.execute(sql`
        ALTER TABLE bakonykuti-t3_image 
        ADD COLUMN local_path VARCHAR(1024) NULL
      `);
      console.log("✓ Added 'local_path' column");
    } else {
      console.log("✓ 'local_path' column already exists");
    }

    // Update existing records to be visible by default (if they aren't already)
    console.log("Ensuring all existing images are marked as visible...");
    await db.execute(sql`
      UPDATE bakonykuti-t3_image 
      SET visible = TRUE 
      WHERE visible IS NULL OR visible = FALSE
    `);
    console.log("✓ Updated existing images to be visible");

    // Show current table structure
    console.log("\nCurrent images table structure:");
    const tableStructure = await db.execute(sql`
      DESCRIBE bakonykuti-t3_image
    `);
    console.table(tableStructure);

    console.log("\n✅ Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
addImageVisibilityFields().catch(console.error);
