import mysql from "mysql2/promise";
import { env } from "../src/env";

async function testConnection() {
  console.log("Testing direct connection to MariaDB...");
  
  // Create a connection to MariaDB
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: env.MARIADB_PASSWORD,
    database: "bakonykuti-mariadb",
  }).catch(err => {
    console.error("Failed to connect to MariaDB:", err);
    process.exit(1);
  });
  
  try {
    // Test the connection by querying the database
    const [rows] = await connection.execute("SHOW TABLES");
    
    console.log("Connection successful!");
    console.log("Tables in the database:");
    console.log(rows);
    
    // Try to query the users table if it exists
    try {
      const [users] = await connection.execute("SELECT * FROM `bakonykuti-t3_user` LIMIT 10");
      console.log(`Found ${Array.isArray(users) ? users.length : 0} users in the database.`);
      
      if (Array.isArray(users) && users.length > 0) {
        console.log("Sample user data (without password):");
        const sampleUser = { ...users[0] };
        delete sampleUser.password;
        console.log(sampleUser);
      }
    } catch (error) {
      console.log("Could not query users table:", error.message);
    }
  } catch (error) {
    console.error("Error querying the database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

testConnection().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
