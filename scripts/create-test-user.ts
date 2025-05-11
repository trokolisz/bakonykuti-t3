import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function createTestUser() {
  try {
    // Create a test user with known credentials
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      process.exit(0);
    }
    
    // Create the user
    await db.insert(users).values({
      id: uuidv4(),
      name: "Test User",
      email,
      password: hashedPassword,
      role: "admin",
    });
    
    console.log(`Created test user with email: ${email} and password: ${password}`);
    
    // List all users
    const allUsers = await db.query.users.findMany();
    console.log(`Total users in database: ${allUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();
