import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env";

import * as schema from "./schema";

// Determine the database host based on environment
// In Docker, we use the service name as the host
const dbHost = process.env.NODE_ENV === 'production' ? 'mariadb' : 'localhost';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: dbHost,
  port: 3306,
  user: "root",
  password: env.MARIADB_PASSWORD,
  database: "bakonykuti-mariadb",
});

// Use this object to send drizzle queries to your DB
export const db = drizzle(pool, { schema, mode: 'default' });
