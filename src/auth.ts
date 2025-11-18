import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

// Check if we're in build/prerender mode or if database is not available
const isBuildTime = process.env.NODE_ENV === 'production' && (
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-production-server'
);
const isDatabaseAvailable = process.env.MARIADB_HOST && process.env.MARIADB_DATABASE;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // Skip the adapter during build time or when database is not available
  adapter: (isBuildTime || !isDatabaseAvailable) ? undefined : DrizzleAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Skip database operations if database is not available
          if (!isDatabaseAvailable) {
            console.log("❌ Database not available, skipping authentication");
            return null;
          }

          console.log("🔐 Authorize function called with credentials:", {
            email: credentials?.email,
            hasPassword: !!credentials?.password,
            passwordLength: (credentials?.password as string)?.length || 0,
          });

          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            console.log("❌ Missing email or password");
            return null;
          }

          console.log("🔍 Looking for user with email:", email);

          // Find the user in the database
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          if (!user.password) {
            console.log("❌ User has no password");
            return null;
          }

          console.log("✅ User found:", {
            id: user.id,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password,
          });

          // Verify the password
          console.log("🔑 Verifying password...");
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("🔑 Password match result:", passwordsMatch);

          if (!passwordsMatch) {
            console.log("❌ Password does not match");
            return null;
          }

          const userResult = {
            id: user.id,
            name: user.name || "User",
            email: user.email,
            role: user.role || "user",
          };

          console.log("✅ Authentication successful, returning user:", userResult);
          return userResult;
        } catch (error) {
          console.error("💥 Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        if (isLoggedIn && auth?.user?.role === "admin") {
          return true;
        }
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
