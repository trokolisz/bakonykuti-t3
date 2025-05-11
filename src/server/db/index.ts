import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env";

import * as schema from "./schema";

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: env.MARIADB_PASSWORD,
  database: "bakonykuti-mariadb",
});

// Use this object to send drizzle queries to your DB
export const db = drizzle(pool, { schema, mode: 'default' });
