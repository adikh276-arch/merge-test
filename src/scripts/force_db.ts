import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function force() {
  try {
    console.log("Forcing creation in mission_statement...");
    await sql`CREATE SCHEMA IF NOT EXISTS mission_statement`;
    await sql`
      CREATE TABLE mission_statement.missions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id BIGINT,
        statement TEXT,
        values TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("missions created in schema.");

    console.log("Forcing creation in brain_dump...");
    await sql`CREATE SCHEMA IF NOT EXISTS brain_dump`;
    await sql`
      CREATE TABLE brain_dump.sessions (
        id TEXT PRIMARY KEY,
        user_id BIGINT,
        thoughts JSONB,
        reflection TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("sessions created in schema.");
  } catch (err) {
    console.error("Force failed:", err);
  }
}

force();
