import { neon } from '@neondatabase/serverless';

const connectionString =
    import.meta.env.VITE_DATABASE_URL ||
    "postgresql://neondb_owner:npg_DBfz1cx8Erhe@ep-young-leaf-a7dpgvaj-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);

/**
 * Executes a parameterized query against Neon.
 * Uses the tagged-template form or no-param form correctly.
 */
export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
    try {
        // neon() tagged-template returns Record[] directly.
        // For parameterized queries, we build the call using sql.query which is
        // available in @neondatabase/serverless and returns { rows: [] }.
        let rows: any[];
        if (params.length > 0) {
            const res = await (sql as any).query(queryString, params);
            rows = Array.isArray(res) ? res : (res.rows ?? []);
        } else {
            // No params: use direct call (returns array)
            const res = await (sql as any).query(queryString);
            rows = Array.isArray(res) ? res : (res.rows ?? []);
        }
        return rows as T[];
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}
