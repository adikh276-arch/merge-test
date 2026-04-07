import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const setup = async () => {
  try {
    console.log("Creating schemas...");
    await sql("CREATE SCHEMA IF NOT EXISTS core");
    await sql("CREATE SCHEMA IF NOT EXISTS mission_statement");
    await sql("CREATE SCHEMA IF NOT EXISTS brain_dump");

    console.log("Creating core.users table...");
    await sql(`
      CREATE TABLE IF NOT EXISTS core.users (
        id BIGINT PRIMARY KEY,
        email TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log("Creating mission_statement.missions table...");
    await sql(`
      CREATE TABLE IF NOT EXISTS mission_statement.missions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id BIGINT REFERENCES core.users(id) ON DELETE CASCADE,
        statement TEXT,
        values JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log("Creating brain_dump.sessions table...");
    await sql(`
      CREATE TABLE IF NOT EXISTS brain_dump.sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id BIGINT REFERENCES core.users(id) ON DELETE CASCADE,
        thoughts JSONB,
        reflection TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
};

setup();
