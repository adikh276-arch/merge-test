import { executeQuery } from "@/lib/db";

/**
 * Executes a SQL query with parameters against the brain_dump schema.
 */
export const dbQuery = async (text: string, params?: any[]) => {
  const rows = await executeQuery<any>("brain_dump", text, params || []);
  return { rows };
};

