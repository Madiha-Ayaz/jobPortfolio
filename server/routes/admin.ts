/**
 * /api/admin/* — read-only views of data stored in Neon.
 * Intended for the owner's dashboard (e.g. /dashboard).
 * Endpoints return JSON summaries + recent rows:
 *   GET /api/admin/summary      counts per table
 *   GET /api/admin/contacts     recent contact submissions
 *   GET /api/admin/chats        recent AI chat messages
 *   GET /api/admin/sessions     recent visitor sessions (open/close/duration)
 *   GET /api/admin/projects     recent opened projects
 *   GET /api/admin/finder       recent project-finder queries
 */
import { Router } from 'express';
import {
  querySummary,
  listContacts,
  listChatMessages,
  listSessions,
  listProjectViews,
  listFinder,
  isDbAvailable,
} from '../lib/db.ts';

const router = Router();

function limitOf(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 500) : 100;
}

router.get('/summary', async (_req, res) => {
  res.json(await querySummary());
});

router.get('/contacts', async (req, res) => {
  res.json({ available: isDbAvailable(), contacts: await listContacts(limitOf(req.query.limit)) });
});

router.get('/chats', async (req, res) => {
  res.json({ available: isDbAvailable(), messages: await listChatMessages(limitOf(req.query.limit)) });
});

router.get('/sessions', async (req, res) => {
  res.json({ available: isDbAvailable(), sessions: await listSessions(limitOf(req.query.limit)) });
});

router.get('/projects', async (req, res) => {
  res.json({ available: isDbAvailable(), projectViews: await listProjectViews(limitOf(req.query.limit)) });
});

router.get('/finder', async (req, res) => {
  res.json({ available: isDbAvailable(), finder: await listFinder(limitOf(req.query.limit)) });
});

export default router;
