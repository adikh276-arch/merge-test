import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Executes a query with a specific schema search path.
 * This is how we isolate different sub-apps in the same DB.
 */
export async function executeQuery<T>(schema: "mission_statement" | "brain_dump" | "core", query: string, params: any[] = []): Promise<T[]> {
  // Set the search path first, then run the query.
  // Neon Serverless is stateless, so we have to combine it or use double-command.
  // Actually, we can just use schema-qualified table names.
  const schemaQualifiedQuery = query.replace(/FROM (\w+)/gi, `FROM ${schema}.$1`)
                                     .replace(/INSERT INTO (\w+)/gi, `INSERT INTO ${schema}.$1`)
                                     .replace(/UPDATE (\w+)/gi, `UPDATE ${schema}.$1`)
                                     .replace(/DELETE FROM (\w+)/gi, `DELETE FROM ${schema}.$1`);

  return sql(schemaQualifiedQuery, params) as unknown as T[];
}

export default sql;
