import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

async function createUser() {
  try {
    // Create a test user with known credentials
    const email = "admin@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    
    console.log("Inserting user directly with SQL...");
    
    // Insert the user directly with SQL
    await sql`
      INSERT INTO "bakonykuti-t3_user" (id, name, email, password, role)
      VALUES (${userId}, 'Admin User', ${email}, ${hashedPassword}, 'admin')
      ON CONFLICT (id) DO NOTHING;
    `;
    
    console.log(`Created user with email: ${email} and password: ${password}`);
    
    // Verify the user was created
    const result = await sql`SELECT * FROM "bakonykuti-t3_user" WHERE email = ${email}`;
    console.log("User in database:", result.rows);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

createUser();
