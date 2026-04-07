import { neon } from "@neondatabase/serverless";

const connectionString = 
  process.env.NEXT_PUBLIC_DATABASE_URL || 
  process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_fPtnqSQ24Xwo@ep-plain-thunder-a7xaulng-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);


/**
 * Executes a query with a specific schema search path.
 * This is how we isolate different sub-apps in the same DB.
 */
export async function executeQuery<T>(schema: "mission_statement" | "brain_dump" | "core", query: string, params: any[] = []): Promise<T[]> {
  // Set the search path first, then run the query.
  // Neon Serverless is stateless, so we have to combine it or use double-command.
  // Actually, we can just use schema-qualified table names.
  const schemaQualifiedQuery = query
    .replace(/\b(FROM|JOIN|INTO|UPDATE|DELETE FROM)\s+(users)\b/gi, `$1 core.$2`) // Users are always in core
    .replace(/\b(FROM|JOIN|INTO|UPDATE|DELETE FROM)\s+(?!core\.)(\w+)\b/gi, `$1 ${schema}.$2`);

  return (sql as any).query(schemaQualifiedQuery, params) as unknown as T[];



}

export default sql;
