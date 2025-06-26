import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql", // Corrected: Drizzle Kit expects "mysql" for MariaDB/MySQL
  dbCredentials: {
    host: env.MARIADB_HOST ?? "localhost",
    port: env.MARIADB_PORT ?? 3306,
    user: env.MARIADB_USER ?? "root",
    password: env.MARIADB_PASSWORD ?? "",
    database: env.MARIADB_DATABASE ?? "bakonykuti-mariadb",
  },
  tablesFilter: ["bakonykuti-t3_*"], // Filters tables within the database
} satisfies Config;
