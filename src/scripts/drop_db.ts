import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function drop() {
  try {
    console.log("Dropping tables...");
    await sql`DROP TABLE IF EXISTS mission_statement.missions`;
    await sql`DROP TABLE IF EXISTS brain_dump.sessions`;
    await sql`DROP TABLE IF EXISTS missions`;
    await sql`DROP TABLE IF EXISTS sessions CASCADE`;
    console.log("Tables dropped.");
  } catch (err) {
    console.error("Drop failed:", err);
  }
}

drop();
