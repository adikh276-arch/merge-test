import { dbQuery } from './db';

/**
 * Ensures a user exists in the database.
 * The ID is the one returned from the Auth Handshake.
 */
export async function initializeUser(userId: string | number) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    try {
        await dbQuery(
            'INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING',
            [id]
        );
    } catch (err) {
        console.error('Failed to initialize user:', err);
        throw err;
    }
}

/**
 * Fetches all sessions for a specific user.
 */
export async function fetchUserSessions(userId: string | number) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    try {
        const result = await dbQuery(
            'SELECT * FROM sessions WHERE user_id = $1 ORDER BY created_at DESC',
            [id]
        );

        return result.rows || [];
    } catch (err) {
        console.error('Failed to fetch user sessions:', err);
        throw err;
    }

}

/**
 * Saves a complete session with thoughts to the database.
 * Note: @neondatabase/serverless 'neon' (HTTP) doesn't support multi-statement transactions in one call easily.
 * For true ACID in HTTP we'd need a different approach, but for this app sequential calls are usually fine.
 */
export async function saveSession(userId: string | number, session: any) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    try {
        // 1. Insert session (with stringified thoughts JSONB)
        await dbQuery(
            'INSERT INTO sessions (id, user_id, thoughts, reflection) VALUES ($1, $2, $3, $4)',
            [session.id, id, JSON.stringify(session.thoughts), session.reflection]
        );

    } catch (err) {
        console.error('Failed to save session:', err);
        throw err;
    }
}

/**
 * Deletes a session and its associated thoughts.
 */
export async function deleteSession(userId: string | number, sessionId: string) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    try {
        await dbQuery(
            'DELETE FROM sessions WHERE id = $1 AND user_id = $2',
            [sessionId, id]
        );
    } catch (err) {
        console.error('Failed to delete session:', err);
        throw err;
    }
}
