import { db } from "../src/server/db";
import { sql } from "drizzle-orm";
import { images, users, news, events, documents, pages } from "../src/server/db/schema";

async function verifyDatabaseState() {
  console.log("🔍 Comprehensive Database State Verification");
  console.log("=" .repeat(50));

  try {
    // 1. Verify all tables exist
    console.log("\n1. Checking table existence...");
    const tables = await db.execute(sql`
      SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME LIKE 'bakonykuti-t3_%'
      ORDER BY TABLE_NAME
    `);
    
    console.log("📊 Database Tables:");
    console.table(tables);

    // 2. Verify images table schema in detail
    console.log("\n2. Verifying images table schema...");
    const imageColumns = await db.execute(sql`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_DEFAULT,
        COLUMN_TYPE,
        EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
        AND TABLE_NAME = 'bakonykuti-t3_image'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log("🖼️ Images Table Schema:");
    console.table(imageColumns);

    // 3. Check for required new columns
    const requiredColumns = ['visible', 'local_path'];

    // Extract only the data rows (filter out metadata)
    const dataRows = imageColumns.filter((col: any) => col.COLUMN_NAME && typeof col.COLUMN_NAME === 'string');
    const existingColumns = dataRows.map((col: any) => col.COLUMN_NAME);

    console.log("Extracted column names:", existingColumns);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`❌ Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    } else {
      console.log("✅ All required columns present");
    }

    // 4. Test Drizzle schema compatibility
    console.log("\n3. Testing Drizzle schema compatibility...");
    
    try {
      const testQuery = await db.select({
        id: images.id,
        title: images.title,
        url: images.url,
        gallery: images.gallery,
        visible: images.visible,
        localPath: images.localPath,
        createdAt: images.createdAt
      }).from(images).limit(1);
      
      console.log("✅ Drizzle schema is compatible");
      console.log("Sample image data:", testQuery[0] || "No images found");
    } catch (error) {
      console.log("❌ Drizzle schema compatibility issue:", error);
      return false;
    }

    // 5. Verify data integrity
    console.log("\n4. Checking data integrity...");
    
    const dataCounts = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_image`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_news`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_event`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_document`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_page`),
      db.execute(sql`SELECT COUNT(*) as count FROM bakonykuti-t3_user`),
    ]);

    console.log("📈 Data Counts:");
    console.log(`- Images: ${dataCounts[0][0].count}`);
    console.log(`- News: ${dataCounts[1][0].count}`);
    console.log(`- Events: ${dataCounts[2][0].count}`);
    console.log(`- Documents: ${dataCounts[3][0].count}`);
    console.log(`- Pages: ${dataCounts[4][0].count}`);
    console.log(`- Users: ${dataCounts[5][0].count}`);

    // 6. Check visible column defaults
    console.log("\n5. Checking visible column data...");
    const visibilityStats = await db.execute(sql`
      SELECT 
        visible,
        COUNT(*) as count
      FROM bakonykuti-t3_image 
      GROUP BY visible
    `);
    
    console.log("👁️ Image Visibility Stats:");
    console.table(visibilityStats);

    // 7. Sample data verification
    console.log("\n6. Sample data verification...");
    const sampleImages = await db.execute(sql`
      SELECT id, title, gallery, visible, local_path, created_at
      FROM bakonykuti-t3_image 
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log("🖼️ Sample Images:");
    console.table(sampleImages);

    console.log("\n✅ Database state verification completed successfully!");
    return true;

  } catch (error) {
    console.error("❌ Database verification failed:", error);
    return false;
  }
}

// Run verification
verifyDatabaseState()
  .then(success => {
    if (success) {
      console.log("\n🎉 Database is ready for Phase 3!");
      process.exit(0);
    } else {
      console.log("\n⚠️ Database issues detected. Please resolve before proceeding.");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Verification script failed:", error);
    process.exit(1);
  });
