/**
 * db — Neon (PostgreSQL) persistence layer.
 *
 * The portfolio stores ALL runtime data in a Neon Postgres database so nothing
 * is lost on server restart:
 *   - sessions   : when a visitor opens / closes the app (session id, times, duration)
 *   - page_views : which pages were visited
 *   - project_views : which project the visitor opened
 *   - chat_messages : AI chat (per visitor / per person)
 *   - contacts   : every contact-form submission
 *   - finder     : every project-finder (AI recommender) query + results
 *   - users      : optional Firebase user linkage (email / provider)
 *
 * Uses node-postgres (`pg`) with a connection pool. On first boot the schema
 * is created idempotently. If DATABASE_URL is not configured the module simply
 * reports itself unavailable and every call is a safe no-op (the site still
 * works — it just doesn't persist analytics).
 */
import pg from 'pg';
import { config, hasDatabase } from './config.ts';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let ready: Promise<void> | null = null;

/** Whether a Neon connection is available. */
export function isDbAvailable(): boolean {
  return Boolean(pool);
}

/**
 * Lazily create the connection pool and initialise the schema.
 * Safe to call multiple times. Never throws to the caller.
 */
export function initDb(): Promise<void> {
  if (!hasDatabase) {
    pool = null;
    return Promise.resolve();
  }
  if (pool) return Promise.resolve();
  if (ready) return ready;

  ready = (async () => {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
        max: 8,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
      });
      await ensureSchema();
    } catch (err) {
      console.error('[db] connection failed — continuing without persistence:', (err as Error)?.message || err);
      pool = null;
    }
  })();
  return ready;
}

/** Create tables if they do not exist yet (idempotent). */
async function ensureSchema(): Promise<void> {
  if (!pool) return;
  const queries = `
    CREATE TABLE IF NOT EXISTS sessions (
      id            BIGSERIAL PRIMARY KEY,
      session_id    TEXT NOT NULL,
      visitor_id    TEXT,
      path          TEXT,
      opened_at     TIMESTAMPTZ DEFAULT now(),
      closed_at     TIMESTAMPTZ,
      duration_ms   BIGINT,
      referrer      TEXT,
      user_agent    TEXT,
      city          TEXT,
      region        TEXT,
      country       TEXT
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id         BIGSERIAL PRIMARY KEY,
      session_id TEXT,
      visitor_id TEXT,
      path       TEXT,
      viewed_at  TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS project_views (
      id            BIGSERIAL PRIMARY KEY,
      session_id    TEXT,
      visitor_id    TEXT,
      project_id    INTEGER,
      project_title TEXT,
      action        TEXT DEFAULT 'open',
      viewed_at     TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id         BIGSERIAL PRIMARY KEY,
      session_id TEXT,
      visitor_id TEXT,
      role       TEXT NOT NULL,
      content    TEXT,
      page       TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id            BIGSERIAL PRIMARY KEY,
      name          TEXT,
      email         TEXT,
      subject       TEXT,
      message       TEXT,
      intent        TEXT,
      priority      TEXT,
      is_spam       BOOLEAN DEFAULT false,
      ip            TEXT,
      user_agent    TEXT,
      source        TEXT,
      created_at    TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS finder (
      id         BIGSERIAL PRIMARY KEY,
      session_id TEXT,
      visitor_id TEXT,
      query      TEXT,
      results    JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS app_users (
      id         BIGSERIAL PRIMARY KEY,
      uid        TEXT UNIQUE,
      email      TEXT,
      name       TEXT,
      provider   TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_session  ON sessions(session_id);
    CREATE INDEX IF NOT EXISTS idx_page_session      ON page_views(session_id);
    CREATE INDEX IF NOT EXISTS idx_project_session   ON project_views(session_id);
    CREATE INDEX IF NOT EXISTS idx_chat_session      ON chat_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_contact_created   ON contacts(created_at);
    CREATE INDEX IF NOT EXISTS idx_finder_created    ON finder(created_at);
  `;
  await pool.query(queries);
}

function client(): pg.Pool {
  if (!pool) throw new Error('db not initialised');
  return pool;
}

/* ─────────────────────────── sessions ─────────────────────────── */

export async function sessionStart(input: {
  sessionId: string;
  visitorId?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
}): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO sessions (session_id, visitor_id, path, referrer, user_agent)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (session_id) DO NOTHING`,
      [input.sessionId, input.visitorId || null, input.path || '/', input.referrer || null, input.userAgent || null]
    );
  } catch (err) {
    console.error('[db] sessionStart:', (err as Error)?.message);
  }
}

export async function sessionClose(input: { sessionId: string; closedAt?: Date }): Promise<void> {
  if (!pool) return;
  try {
    const res = await client().query(
      `UPDATE sessions
         SET closed_at = $1,
             duration_ms = GREATEST(0, EXTRACT(EPOCH FROM ($1 - opened_at)) * 1000)::bigint
       WHERE session_id = $2 AND closed_at IS NULL`,
      [input.closedAt || new Date(), input.sessionId]
    );
    // If the row did not exist (e.g. session/site unavailable), create it.
    if ((res.rowCount ?? 0) === 0) {
      await client().query(
        `INSERT INTO sessions (session_id, opened_at, closed_at, duration_ms)
         VALUES ($1, $2, $2, 0)
         ON CONFLICT (session_id) DO NOTHING`,
        [input.sessionId, input.closedAt || new Date()]
      );
    }
  } catch (err) {
    console.error('[db] sessionClose:', (err as Error)?.message);
  }
}

export async function recordPageView(input: { sessionId: string; visitorId?: string; path: string }): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO page_views (session_id, visitor_id, path) VALUES ($1,$2,$3)`,
      [input.sessionId, input.visitorId || null, input.path]
    );
  } catch (err) {
    console.error('[db] recordPageView:', (err as Error)?.message);
  }
}

/* ───────────────────────── project views ───────────────────────── */

export async function recordProjectView(input: {
  sessionId: string;
  visitorId?: string;
  projectId?: number;
  projectTitle: string;
  action?: string;
}): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO project_views (session_id, visitor_id, project_id, project_title, action)
       VALUES ($1,$2,$3,$4,$5)`,
      [input.sessionId, input.visitorId || null, input.projectId ?? null, input.projectTitle, input.action || 'open']
    );
  } catch (err) {
    console.error('[db] recordProjectView:', (err as Error)?.message);
  }
}

/* ───────────────────────── chat messages ───────────────────────── */

export async function saveChatMessage(input: {
  sessionId: string;
  visitorId?: string;
  role: string;
  content: string;
  page?: string;
}): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO chat_messages (session_id, visitor_id, role, content, page) VALUES ($1,$2,$3,$4,$5)`,
      [input.sessionId, input.visitorId || null, input.role, input.content, input.page || null]
    );
  } catch (err) {
    console.error('[db] saveChatMessage:', (err as Error)?.message);
  }
}

/* ─────────────────────────── contacts ──────────────────────────── */

export async function saveContact(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  intent?: string;
  priority?: string;
  isSpam?: boolean;
  ip?: string;
  userAgent?: string;
  source?: string;
}): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO contacts (name,email,subject,message,intent,priority,is_spam,ip,user_agent,source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        input.name,
        input.email,
        input.subject,
        input.message,
        input.intent || null,
        input.priority || null,
        Boolean(input.isSpam),
        input.ip || null,
        input.userAgent || null,
        input.source || 'contact',
      ]
    );
  } catch (err) {
    console.error('[db] saveContact:', (err as Error)?.message);
  }
}

/* ────────────────────────── project finder ─────────────────────── */

export async function saveFinder(input: {
  sessionId: string;
  visitorId?: string;
  query: string;
  results: unknown[];
}): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO finder (session_id, visitor_id, query, results) VALUES ($1,$2,$3,$4)`,
      [input.sessionId, input.visitorId || null, input.query, JSON.stringify(input.results)]
    );
  } catch (err) {
    console.error('[db] saveFinder:', (err as Error)?.message);
  }
}

/* ──────────────────────────── users ────────────────────────────── */

export async function saveUser(input: { uid: string; email?: string; name?: string; provider?: string }): Promise<void> {
  if (!pool) return;
  try {
    await client().query(
      `INSERT INTO app_users (uid,email,name,provider) VALUES ($1,$2,$3,$4)
       ON CONFLICT (uid) DO UPDATE SET email=EXCLUDED.email, name=EXCLUDED.name, provider=EXCLUDED.provider`,
      [input.uid, input.email || null, input.name || null, input.provider || null]
    );
  } catch (err) {
    console.error('[db] saveUser:', (err as Error)?.message);
  }
}

/* ─────────────────────── admin / read helpers ──────────────────── */

export async function querySummary(): Promise<Record<string, unknown>> {
  if (!pool) return { available: false };
  try {
    const [sessions, pageViews, projectViews, chats, contacts, finders, users] = await Promise.all([
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM sessions`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM page_views`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM project_views`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM chat_messages`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM contacts`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM finder`),
      client().query<{ c: string }>(`SELECT count(*)::text AS c FROM app_users`),
    ]);
    return {
      available: true,
      sessions: Number(sessions.rows[0].c),
      pageViews: Number(pageViews.rows[0].c),
      projectViews: Number(projectViews.rows[0].c),
      chats: Number(chats.rows[0].c),
      contacts: Number(contacts.rows[0].c),
      finders: Number(finders.rows[0].c),
      users: Number(users.rows[0].c),
    };
  } catch (err) {
    return { available: true, error: (err as Error)?.message };
  }
}

export async function listContacts(limit = 100): Promise<unknown[]> {
  if (!pool) return [];
  try {
    const res = await client().query(
      `SELECT id,name,email,subject,message,intent,priority,is_spam,created_at
         FROM contacts ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('[db] listContacts:', (err as Error)?.message);
    return [];
  }
}

export async function listChatMessages(limit = 200): Promise<unknown[]> {
  if (!pool) return [];
  try {
    const res = await client().query(
      `SELECT id,session_id,visitor_id,role,content,page,created_at
         FROM chat_messages ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('[db] listChatMessages:', (err as Error)?.message);
    return [];
  }
}

export async function listSessions(limit = 100): Promise<unknown[]> {
  if (!pool) return [];
  try {
    const res = await client().query(
      `SELECT id,session_id,path,opened_at,closed_at,duration_ms,country,region
         FROM sessions ORDER BY opened_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('[db] listSessions:', (err as Error)?.message);
    return [];
  }
}

export async function listProjectViews(limit = 100): Promise<unknown[]> {
  if (!pool) return [];
  try {
    const res = await client().query(
      `SELECT id,project_id,project_title,action,viewed_at
         FROM project_views ORDER BY viewed_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('[db] listProjectViews:', (err as Error)?.message);
    return [];
  }
}

export async function listFinder(limit = 100): Promise<unknown[]> {
  if (!pool) return [];
  try {
    const res = await client().query(
      `SELECT id,query,results,created_at FROM finder ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('[db] listFinder:', (err as Error)?.message);
    return [];
  }
}
