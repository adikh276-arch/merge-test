import { executeQuery } from "@/lib/db";

/**
 * Executes a parameterized query against specific schema in Neon.
 */
export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  return executeQuery<T>("mission_statement", queryString, params);
}

