import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env";

import * as schema from "./schema";

// Determine the database host based on environment
// In Docker, we use the service name as the host, otherwise use env variable
const dbHost = process.env.NODE_ENV === 'production' ? 'mariadb' : env.MARIADB_HOST;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: dbHost,
  port: env.MARIADB_PORT,
  user: env.MARIADB_USER,
  password: env.MARIADB_PASSWORD,
  database: env.MARIADB_DATABASE,
});

// Use this object to send drizzle queries to your DB
export const db = drizzle(pool, { schema, mode: 'default' });
