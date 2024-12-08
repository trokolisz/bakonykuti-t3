
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
  },
});