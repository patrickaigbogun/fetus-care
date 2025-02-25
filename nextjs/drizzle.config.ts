import { type Config } from "drizzle-kit";
import { supabase, neonDbUrl } from "./env.config";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: supabase.connection_url,
  },
} satisfies Config;
