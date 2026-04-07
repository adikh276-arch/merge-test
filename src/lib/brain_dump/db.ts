import { neon, neonConfig } from '@neondatabase/serverless';

// This allows the driver to work in the browser via HTTP/WebSockets
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || "";


// 'neon' returns a function that can be used as a tagged template or has a .query method
export const sql = neon(connectionString);

/**
 * Executes a SQL query with parameters.
 */
export const dbQuery = async (text: string, params?: any[]) => {
    return await (sql as any).query(text, params || []);
};
