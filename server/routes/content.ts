/**
 * /api/content — CRUD for the persistent portfolio content store.
 *
 * Every mutation is validated server-side (never trust the client or an
 * AI-generated payload). The store is seeded from `src/lib/data.ts`.
 */
import { Router } from 'express';
import {
  getContent,
  createProject,
  updateProject,
  removeProject,
  createPost,
  updatePost,
  removePost,
  applyProfilePatch,
} from '../lib/store.ts';

const router = Router();

/** Read the full content state (used by the frontend to hydrate). */
router.get('/', (_req, res) => {
  res.json(getContent());
});

/* ── Projects ─────────────────────────────────────────────── */

router.post('/projects', (req, res) => {
  const result = createProject(req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.status(201).json({ ok: true, value: result.value });
});

router.patch('/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid project id.' });
  const result = updateProject(id, req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.json({ ok: true, value: result.value });
});

router.delete('/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid project id.' });
  const result = removeProject(id);
  if (!result.ok) return res.status(404).json({ error: result.error });
  res.json({ ok: true });
});

/* ── Blog posts ───────────────────────────────────────────── */

router.post('/blogs', (req, res) => {
  const result = createPost(req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.status(201).json({ ok: true, value: result.value });
});

router.patch('/blogs/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid post id.' });
  const result = updatePost(id, req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.json({ ok: true, value: result.value });
});

router.delete('/blogs/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid post id.' });
  const result = removePost(id);
  if (!result.ok) return res.status(404).json({ error: result.error });
  res.json({ ok: true });
});

/* ── Profile ──────────────────────────────────────────────── */

router.patch('/profile', (req, res) => {
  const result = applyProfilePatch(req.body);
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.json({ ok: true, value: result.value });
});

export default router;