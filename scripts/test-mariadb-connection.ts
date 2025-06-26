import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";

async function testConnection() {
  try {
    console.log("Testing connection to MariaDB...");
    
    // Try to query the database
    const result = await db.query.users.findMany({
      limit: 10,
    });
    
    console.log("Connection successful!");
    console.log(`Found ${result.length} users in the database.`);
    
    if (result.length > 0) {
      console.log("Sample user data (without password):");
      const sampleUser = { ...result[0] };
      delete sampleUser.password;
      console.log(sampleUser);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error connecting to MariaDB:", error);
    process.exit(1);
  }
}

testConnection().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
