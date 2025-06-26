import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function checkImageTableStructure() {
  try {
    console.log("Checking images table structure...");
    
    // Check table structure
    const tableStructure = await db.execute(sql`
      DESCRIBE bakonykuti-t3_image
    `);
    
    console.log("\nCurrent images table structure:");
    console.table(tableStructure);
    
    // Check if visible and local_path columns exist
    const hasVisible = tableStructure.some((col: any) => col.Field === 'visible');
    const hasLocalPath = tableStructure.some((col: any) => col.Field === 'local_path');
    
    console.log(`\n✅ Has 'visible' column: ${hasVisible}`);
    console.log(`✅ Has 'local_path' column: ${hasLocalPath}`);
    
    if (hasVisible && hasLocalPath) {
      console.log("\n🎉 Database schema is already up to date!");
      
      // Show some sample data
      const sampleImages = await db.execute(sql`
        SELECT id, title, gallery, visible, local_path, created_at 
        FROM bakonykuti-t3_image 
        LIMIT 3
      `);
      
      console.log("\nSample image records:");
      console.table(sampleImages);
    } else {
      console.log("\n⚠️  Database schema needs to be updated");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking table structure:", error);
    process.exit(1);
  }
}

checkImageTableStructure().catch(console.error);
