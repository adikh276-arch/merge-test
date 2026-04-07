import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const schemas = await sql`SELECT schema_name FROM information_schema.schemata`;
    console.log("Current schemas:", schemas.map(s => s.schema_name).join(", "));
    
    const tables = await sql`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('public', 'core', 'mission_statement', 'brain_dump')`;
    console.log("Current tables:", tables.map(t => `${t.table_schema}.${t.table_name}`).join(", "));
  } catch (err) {
    console.error("Check failed:", err);
  }
}

check();
