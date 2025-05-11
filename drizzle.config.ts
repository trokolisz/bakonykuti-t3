import { type Config } from "drizzle-kit";

import { env } from "~/env"; // Make sure this correctly loads MARIADB_PASSWORD

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql", // Corrected: Drizzle Kit expects "mysql" for MariaDB/MySQL
  dbCredentials: {
    host: "localhost", // This is correct if your app/drizzle-kit runs on the Docker host
    port: 3306, // This is correct based on your Docker port bindings
    user: "root", // Correct, as MYSQL_ROOT_PASSWORD implies the user is 'root'
    password: env.MARIADB_PASSWORD, // This needs to be 'bakonykuti_root_password'
    database: "bakonykuti-mariadb", // The SQL database name Drizzle will connect to/manage
  },
  tablesFilter: ["bakonykuti-t3_*"], // Filters tables within the "bakonykuti-mariadb" database
} satisfies Config;
