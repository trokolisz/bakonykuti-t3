
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    MARIADB_PASSWORD: z.string().min(1),
  },
});