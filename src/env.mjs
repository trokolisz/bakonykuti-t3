
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    MARIADB_HOST: z.string().default("localhost"),
    MARIADB_PORT: z.coerce.number().default(3306),
    MARIADB_USER: z.string().default("root"),
    MARIADB_PASSWORD: z.string().min(1),
    MARIADB_DATABASE: z.string().default("bakonykuti-mariadb"),
  },
  runtimeEnv: {
    MARIADB_HOST: process.env.MARIADB_HOST,
    MARIADB_PORT: process.env.MARIADB_PORT,
    MARIADB_USER: process.env.MARIADB_USER,
    MARIADB_PASSWORD: process.env.MARIADB_PASSWORD,
    MARIADB_DATABASE: process.env.MARIADB_DATABASE,
  },
});