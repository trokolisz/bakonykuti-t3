#!/usr/bin/env bun

import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function testUserAuth() {
  try {
    console.log("Testing user authentication...");
    
    // Find the admin user
    const user = await db.query.users.findFirst({
      where: eq(users.email, "admin@example.com"),
    });

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("✅ User found:", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
    });

    // Test password verification
    if (user.password) {
      const testPassword = "admin123"; // Replace with the actual password you're trying
      const passwordsMatch = await bcrypt.compare(testPassword, user.password);
      console.log(`Password verification for "${testPassword}":`, passwordsMatch ? "✅ MATCH" : "❌ NO MATCH");
      
      // Test with a few common passwords
      const commonPasswords = ["admin", "password", "123456", "admin123"];
      for (const pwd of commonPasswords) {
        const match = await bcrypt.compare(pwd, user.password);
        if (match) {
          console.log(`✅ Password "${pwd}" matches!`);
        }
      }
    } else {
      console.log("❌ User has no password set");
    }

  } catch (error) {
    console.error("Error testing user auth:", error);
  }
}

testUserAuth();
