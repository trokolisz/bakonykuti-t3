import { db } from "../src/server/db";
import { 
  users, 
  accounts, 
  sessions, 
  verificationTokens 
} from "../src/server/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating NextAuth.js tables if they don't exist...");
  
  // Create users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "bakonykuti-t3_user" (
      "id" VARCHAR(255) PRIMARY KEY NOT NULL,
      "name" VARCHAR(255),
      "email" VARCHAR(255) NOT NULL,
      "emailVerified" TIMESTAMP,
      "image" VARCHAR(255),
      "password" VARCHAR(255),
      "role" VARCHAR(255) DEFAULT 'user' NOT NULL
    );
  `);
  
  // Create accounts table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "bakonykuti-t3_account" (
      "userId" VARCHAR(255) NOT NULL,
      "type" VARCHAR(255) NOT NULL,
      "provider" VARCHAR(255) NOT NULL,
      "providerAccountId" VARCHAR(255) NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" VARCHAR(255),
      "scope" VARCHAR(255),
      "id_token" TEXT,
      "session_state" VARCHAR(255),
      PRIMARY KEY ("provider", "providerAccountId")
    );
    CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "bakonykuti-t3_account" ("userId");
  `);
  
  // Create sessions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "bakonykuti-t3_session" (
      "sessionToken" VARCHAR(255) PRIMARY KEY NOT NULL,
      "userId" VARCHAR(255) NOT NULL,
      "expires" TIMESTAMP NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "bakonykuti-t3_session" ("userId");
  `);
  
  // Create verification tokens table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "bakonykuti-t3_verificationToken" (
      "identifier" VARCHAR(255) NOT NULL,
      "token" VARCHAR(255) NOT NULL,
      "expires" TIMESTAMP NOT NULL,
      PRIMARY KEY ("identifier", "token")
    );
  `);
  
  console.log("NextAuth.js tables created successfully!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Error creating tables:", error);
  process.exit(1);
});
