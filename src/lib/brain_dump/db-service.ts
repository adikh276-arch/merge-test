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
        const sessions = await dbQuery(
            'SELECT * FROM sessions WHERE user_id = $1 ORDER BY date DESC',
            [id]
        );

        const sessionsWithThoughts = [];

        for (const session of (sessions as any[])) {
            const thoughts = await dbQuery(
                'SELECT local_id as id, text, bucket FROM thoughts WHERE session_id = $1 AND user_id = $2',
                [session.id, id]
            );
            sessionsWithThoughts.push({
                ...session,
                thoughts: thoughts
            });
        }

        return sessionsWithThoughts;
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
        // 1. Insert session
        await dbQuery(
            'INSERT INTO sessions (id, user_id, date, reflection) VALUES ($1, $2, $3, $4)',
            [session.id, id, session.date, session.reflection]
        );

        // 2. Insert thoughts
        for (const thought of session.thoughts) {
            await dbQuery(
                'INSERT INTO thoughts (local_id, session_id, user_id, text, bucket) VALUES ($1, $2, $3, $4, $5)',
                [thought.id, session.id, id, thought.text, thought.bucket]
            );
        }
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
