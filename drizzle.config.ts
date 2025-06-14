import { type Config } from "drizzle-kit";

import { env } from "~/env"; // Make sure this correctly loads MARIADB_PASSWORD

// Always connect to localhost
const dbHost = 'localhost';

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql", // Corrected: Drizzle Kit expects "mysql" for MariaDB/MySQL
  dbCredentials: {
    host: dbHost,
    port: 3306,
    user: "root",
    password: env.MARIADB_PASSWORD,
    database: "bakonykuti-mariadb",
  },
  tablesFilter: ["bakonykuti-t3_*"], // Filters tables within the "bakonykuti-mariadb" database
} satisfies Config;
