import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { authConfig } from "./auth.config";

// Override the authorize function with one that uses the database
const { providers, ...restConfig } = authConfig;
const credentialsProvider = providers[0];

// Create a new credentials provider with our database-dependent authorize function
const updatedCredentialsProvider = {
  ...credentialsProvider,
  async authorize(credentials: Record<string, unknown> | undefined) {
    try {
      const email = credentials?.email as string;
      const password = credentials?.password as string;

      if (!email || !password) {
        return null;
      }

      // Find the user in the database
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user || !user.password) {
        return null;
      }

      // Verify the password
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return null;
      }

      return {
        id: user.id,
        name: user.name || "User",
        email: user.email,
        role: user.role || "user",
      };
    } catch (error) {
      console.error("Error in authorize function:", error);
      return null;
    }
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...restConfig,
  adapter: DrizzleAdapter(db),
  providers: [updatedCredentialsProvider],
});
