import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function createAdminUser() {
  // Check if admin user already exists
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.role, "admin"),
  });

  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin.email);
    process.exit(0);
  }

  // Get admin details from command line arguments
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: bun scripts/create-admin-user.ts <email> <password> [name]");
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  await db.insert(users).values({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin user created with email: ${email}`);
  process.exit(0);
}

createAdminUser().catch((error) => {
  console.error("Error creating admin user:", error);
  process.exit(1);
});
