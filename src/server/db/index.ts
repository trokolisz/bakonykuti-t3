import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env";

import * as schema from "./schema";

// Create a mock database for build time
// This returns empty results for all queries during build
const mockDb: any = {
  query: {
    users: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    pages: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    news: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    events: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    images: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    documents: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    accounts: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    sessions: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    verificationTokens: {
      findMany: async () => [],
      findFirst: async () => null,
    },
  },
  insert: () => ({
    values: () => Promise.resolve(),
  }),
  update: () => ({
    set: () => ({
      where: () => Promise.resolve(),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
};

// Check if we're in build/prerender mode
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

let db;

// If we're in build time, use the mock database
if (isBuildTime) {
  console.log('Using mock database for build time');
  db = mockDb;
} else {
  try {
    // Create MySQL connection pool using environment variables
    const pool = mysql.createPool({
      host: env.MARIADB_HOST,
      port: env.MARIADB_PORT,
      user: env.MARIADB_USER,
      password: env.MARIADB_PASSWORD,
      database: env.MARIADB_DATABASE,
      // Add connection timeout to fail fast if DB is not available
      connectTimeout: 5000,
    });

    // Use this object to send drizzle queries to your DB
    db = drizzle(pool, { schema, mode: 'default' });
  } catch (error) {
    console.error('Error connecting to database:', error);
    // Fallback to mock database if connection fails
    db = mockDb;
  }
}

export { db };
