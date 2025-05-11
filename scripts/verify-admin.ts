import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import bcrypt from "bcryptjs";

async function verifyAdmin() {
  console.log("Checking for admin users in the database...");
  
  const allUsers = await db.query.users.findMany();
  
  console.log(`Found ${allUsers.length} users in the database:`);
  
  for (const user of allUsers) {
    console.log(`- User ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Password: ${user.password ? "Set" : "Not set"}`);
    console.log(`  Password Length: ${user.password?.length || 0}`);
    console.log("---");
  }
  
  // Create a test admin user if none exists
  if (allUsers.length === 0 || !allUsers.some(user => user.role === "admin")) {
    console.log("No admin user found. Creating a test admin user...");
    
    const email = "admin@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userId = crypto.randomUUID();
    
    await db.insert(users).values({
      id: userId,
      name: "Admin User",
      email,
      password: hashedPassword,
      role: "admin",
    });
    
    console.log(`Created admin user with email: ${email} and password: ${password}`);
    console.log(`User ID: ${userId}`);
    
    // Verify the password hash works
    const testPasswordMatch = await bcrypt.compare(password, hashedPassword);
    console.log(`Test password match: ${testPasswordMatch ? "Success" : "Failed"}`);
  }
  
  process.exit(0);
}

verifyAdmin().catch((error) => {
  console.error("Error verifying admin user:", error);
  process.exit(1);
});
