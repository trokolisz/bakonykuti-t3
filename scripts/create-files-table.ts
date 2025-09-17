import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function createFilesTable() {
  console.log("Creating files table for comprehensive file management...");
  
  try {
    // Create the files table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_file\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`original_name\` VARCHAR(512) NOT NULL,
        \`filename\` VARCHAR(512) NOT NULL,
        \`file_path\` VARCHAR(1024) NOT NULL,
        \`public_url\` VARCHAR(1024) NOT NULL,
        \`mime_type\` VARCHAR(128) NOT NULL,
        \`file_size\` INT NOT NULL,
        \`upload_type\` VARCHAR(64) NOT NULL,
        \`uploaded_by\` VARCHAR(255),
        \`associated_entity\` VARCHAR(64),
        \`associated_entity_id\` INT,
        \`is_orphaned\` BOOLEAN NOT NULL DEFAULT FALSE,
        \`last_accessed_at\` TIMESTAMP NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX \`file_path_idx\` (\`file_path\`),
        INDEX \`upload_type_idx\` (\`upload_type\`),
        INDEX \`uploaded_by_idx\` (\`uploaded_by\`),
        INDEX \`associated_entity_idx\` (\`associated_entity\`, \`associated_entity_id\`),
        INDEX \`orphaned_idx\` (\`is_orphaned\`)
      );
    `);
    
    console.log("✅ Files table created successfully");
    
    // Check if table was created
    const result = await db.execute(sql`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'bakonykuti-t3_file'
    `);
    
    console.log("✅ Table verification completed");
    console.log("🎉 Files table is ready for use!");
    
  } catch (error) {
    console.error("❌ Error creating files table:", error);
    process.exit(1);
  }
}

// Run the table creation
createFilesTable().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
