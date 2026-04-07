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
    console.log("Creating tables in public schema as well...");
    
    console.log("Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        email TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log("Creating missions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS missions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        statement TEXT,
        values TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log("Creating sessions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        thoughts JSONB,
        reflection TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;


    console.log("Public tables initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize public tables:", err);
  }
};

setup();
