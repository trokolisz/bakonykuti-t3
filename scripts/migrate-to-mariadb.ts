import { db } from "../src/server/db";
import { 
  users, 
  accounts, 
  sessions, 
  verificationTokens,
  images,
  pages,
  news,
  events,
  documents
} from "../src/server/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating tables in MariaDB if they don't exist...");
  
  try {
    // Create images table with new visibility and local path columns
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_image\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`url\` VARCHAR(1024) NOT NULL,
        \`title\` VARCHAR(256) NOT NULL DEFAULT '',
        \`carousel\` BOOLEAN NOT NULL DEFAULT false,
        \`gallery\` BOOLEAN NOT NULL DEFAULT true,
        \`visible\` BOOLEAN NOT NULL DEFAULT true,
        \`local_path\` VARCHAR(1024) NULL,
        \`image_size\` INT NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Images table created successfully");

    // Create pages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_page\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(256) NOT NULL,
        \`content\` TEXT NOT NULL,
        \`slug\` VARCHAR(256) NOT NULL UNIQUE,
        \`last_modified\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Pages table created successfully");

    // Create news table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_news\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(256) NOT NULL,
        \`thumbnail\` VARCHAR(2056) NOT NULL,
        \`content\` TEXT,
        \`creator_name\` VARCHAR(256),
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("News table created successfully");

    // Create events table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_event\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(256) NOT NULL,
        \`thumbnail\` VARCHAR(2056) NOT NULL,
        \`content\` TEXT,
        \`date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`type\` VARCHAR(256) NOT NULL DEFAULT 'community',
        \`created_by\` VARCHAR(256),
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Events table created successfully");

    // Create documents table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_document\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(256) NOT NULL,
        \`category\` VARCHAR(256) NOT NULL,
        \`date\` TIMESTAMP NOT NULL,
        \`file_url\` VARCHAR(1024) NOT NULL,
        \`file_size\` VARCHAR(256) NOT NULL
      );
    `);
    console.log("Documents table created successfully");

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_user\` (
        \`id\` VARCHAR(255) PRIMARY KEY NOT NULL,
        \`name\` VARCHAR(255),
        \`email\` VARCHAR(255) NOT NULL,
        \`emailVerified\` TIMESTAMP NULL,
        \`image\` VARCHAR(255),
        \`password\` VARCHAR(255),
        \`role\` VARCHAR(255) NOT NULL DEFAULT 'user'
      );
    `);
    console.log("Users table created successfully");
    
    // Create accounts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_account\` (
        \`userId\` VARCHAR(255) NOT NULL,
        \`type\` VARCHAR(255) NOT NULL,
        \`provider\` VARCHAR(255) NOT NULL,
        \`providerAccountId\` VARCHAR(255) NOT NULL,
        \`refresh_token\` TEXT,
        \`access_token\` TEXT,
        \`expires_at\` INT,
        \`token_type\` VARCHAR(255),
        \`scope\` VARCHAR(255),
        \`id_token\` TEXT,
        \`session_state\` VARCHAR(255),
        PRIMARY KEY (\`provider\`, \`providerAccountId\`)
      );
    `);

    // Create index separately
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS \`account_userId_idx\` ON \`bakonykuti-t3_account\` (\`userId\`);
    `);
    console.log("Accounts table created successfully");
    
    // Create sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_session\` (
        \`sessionToken\` VARCHAR(255) PRIMARY KEY NOT NULL,
        \`userId\` VARCHAR(255) NOT NULL,
        \`expires\` TIMESTAMP NOT NULL
      );
    `);

    // Create index separately
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS \`session_userId_idx\` ON \`bakonykuti-t3_session\` (\`userId\`);
    `);
    console.log("Sessions table created successfully");
    
    // Create verification tokens table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`bakonykuti-t3_verificationToken\` (
        \`identifier\` VARCHAR(255) NOT NULL,
        \`token\` VARCHAR(255) NOT NULL,
        \`expires\` TIMESTAMP NOT NULL,
        PRIMARY KEY (\`identifier\`, \`token\`)
      );
    `);
    console.log("Verification tokens table created successfully");
    
    console.log("All tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
