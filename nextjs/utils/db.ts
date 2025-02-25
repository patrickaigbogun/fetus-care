import { neonDbUrl } from "@/env.config";
import { neon } from "@neondatabase/serverless";

const config = neonDbUrl.apiKey
// Create an instance of Neon's TS/JS driver
const sql = neon(config);

export default sql