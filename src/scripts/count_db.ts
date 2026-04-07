import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function count() {
  try {
    const counts = await Promise.all([
      sql`SELECT COUNT(*) FROM core.users`,
      sql`SELECT COUNT(*) FROM public.users`,
      sql`SELECT COUNT(*) FROM mission_statement.missions`,
      sql`SELECT COUNT(*) FROM brain_dump.sessions`,
      sql`SELECT COUNT(*) FROM missions`,
      sql`SELECT COUNT(*) FROM sessions`,
    ]);
    console.log("Users (core):", counts[0][0].count);
    console.log("Users (public):", counts[1][0].count);
    console.log("Missions (schema):", counts[2][0].count);
    console.log("Sessions (schema):", counts[3][0].count);
    console.log("Missions (public):", counts[4][0].count);
    console.log("Sessions (public):", counts[5][0].count);
  } catch (err) {
    console.error("Count failed", err);
  }
}

count();
