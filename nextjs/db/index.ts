import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { supabase } from "@/env.config";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(supabase.connection_url, { prepare: false,  });

export const supabaseDB = drizzle(client);
