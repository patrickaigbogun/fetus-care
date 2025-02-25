import { type Config } from "drizzle-kit";
import { supabase, neonDbUrl } from "./env.config";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  out: "./db/generated",
  dbCredentials: {
    url: neonDbUrl.apiKey,
  },
} satisfies Config;
