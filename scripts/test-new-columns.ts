import { db } from "../src/server/db";
import { images } from "../src/server/db/schema";

async function testNewColumns() {
  try {
    console.log("Testing if new columns exist in images table...");
    
    // Try to query with the new columns
    const testQuery = await db.select({
      id: images.id,
      title: images.title,
      url: images.url,
      gallery: images.gallery,
      visible: images.visible,
      localPath: images.localPath,
    }).from(images).limit(1);
    
    console.log("✅ New columns exist! Sample data:");
    console.log(testQuery);
    
    console.log("\n🎉 Database schema is ready for Phase 2!");
    
  } catch (error) {
    console.error("❌ Error accessing new columns:", error);
    console.log("\n⚠️  The database might need to be updated with the new columns");
  }
}

testNewColumns().catch(console.error);
