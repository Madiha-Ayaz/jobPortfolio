/**
 * /api/analytics/* — persistence for visitor analytics.
 * All writes are fire-and-forget (best-effort) so tracking never blocks the UI.
 * Endpoints:
 *   POST /api/analytics/session/start
 *   POST /api/analytics/session/close
 *   POST /api/analytics/page-view
 *   POST /api/analytics/project-view
 *   POST /api/analytics/chat
 *   POST /api/analytics/contact
 *   POST /api/analytics/finder
 *   POST /api/analytics/user
 */
import { Router } from 'express';
import {
  sessionStart,
  sessionClose,
  recordPageView,
  recordProjectView,
  saveChatMessage,
  saveContact,
  saveFinder,
  saveUser,
} from '../lib/db.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

function str(v: unknown, max = 500): string {
  if (typeof v !== 'string') return '';
  return v.slice(0, max);
}

// POST /api/analytics/session/start
router.post('/session/start', (req, res) => {
  const body = req.body || {};
  const sessionId = str(body.sessionId, 200);
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
  sessionStart({
    sessionId,
    visitorId: str(body.visitorId, 200) || undefined,
    path: str(body.path, 300),
    referrer: str(body.referrer, 500),
    userAgent: req.get('user-agent') || undefined,
  });
  return res.json({ ok: true });
});

// POST /api/analytics/session/close
router.post('/session/close', (req, res) => {
  const sessionId = str((req.body || {}).sessionId, 200);
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
  sessionClose({ sessionId });
  return res.json({ ok: true });
});

// POST /api/analytics/page-view
router.post('/page-view', (req, res) => {
  const body = req.body || {};
  const sessionId = str(body.sessionId, 200);
  const path = str(body.path, 300);
  if (!sessionId || !path) return res.status(400).json({ error: 'sessionId and path are required' });
  recordPageView({ sessionId, visitorId: str(body.visitorId, 200) || undefined, path });
  return res.json({ ok: true });
});

// POST /api/analytics/project-view
router.post('/project-view', (req, res) => {
  const body = req.body || {};
  const sessionId = str(body.sessionId, 200);
  const projectTitle = str(body.projectTitle, 300);
  if (!sessionId || !projectTitle) return res.status(400).json({ error: 'sessionId and projectTitle are required' });
  recordProjectView({
    sessionId,
    visitorId: str(body.visitorId, 200) || undefined,
    projectId: typeof body.projectId === 'number' ? body.projectId : undefined,
    projectTitle,
    action: str(body.action, 50) || 'open',
  });
  return res.json({ ok: true });
});

// POST /api/analytics/chat — persist one AI chat message
router.post('/chat', (req, res) => {
  const body = req.body || {};
  const sessionId = str(body.sessionId, 200);
  const role = str(body.role, 40);
  const content = sanitizeText(body.content, 20_000);
  if (!role || !content) return res.status(400).json({ error: 'role and content are required' });
  saveChatMessage({
    sessionId: sessionId || 'unknown',
    visitorId: str(body.visitorId, 200) || undefined,
    role,
    content,
    page: str(body.page, 300),
  });
  return res.json({ ok: true });
});

// POST /api/analytics/contact — persist a contact submission
router.post('/contact', (req, res) => {
  const body = req.body || {};
  const name = sanitizeText(body.name, 200);
  const email = sanitizeText(body.email, 300);
  const subject = sanitizeText(body.subject, 300);
  const message = sanitizeText(body.message, 20_000);
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message are required' });
  saveContact({
    name,
    email,
    subject,
    message,
    intent: str(body.intent, 60),
    priority: str(body.priority, 30),
    isSpam: Boolean(body.isSpam),
    ip: req.ip,
    userAgent: req.get('user-agent') || undefined,
    source: str(body.source, 100) || 'contact',
  });
  return res.json({ ok: true });
});

// POST /api/analytics/finder — persist a project-finder query
router.post('/finder', (req, res) => {
  const body = req.body || {};
  const query = sanitizeText(body.query, 1000);
  if (!query) return res.status(400).json({ error: 'query is required' });
  saveFinder({
    sessionId: str(body.sessionId, 200) || 'unknown',
    visitorId: str(body.visitorId, 200) || undefined,
    query,
    results: Array.isArray(body.results) ? body.results : [],
  });
  return res.json({ ok: true });
});

// POST /api/analytics/user — upsert a Firebase user into Neon
router.post('/user', (req, res) => {
  const body = req.body || {};
  const uid = str(body.uid, 200);
  if (!uid) return res.status(400).json({ error: 'uid is required' });
  saveUser({ uid, email: str(body.email, 300), name: str(body.name, 200), provider: str(body.provider, 60) });
  return res.json({ ok: true });
});

export default router;
