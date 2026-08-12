/**
 * Nova AI — portfolio server.
 * Modular Express backend that powers every AI feature:
 *   - /api/agent         grounded agentic chatbot (tools + RAG)
 *   - /api/search        AI semantic search
 *   - /api/job-match     job description compatibility analyzer
 *   - /api/article/*     blog summary + grounded Q&A
 *   - /api/contact/assist AI contact co-writer + lead triage
 *   - /api/chat, /api/insights  legacy compatibility endpoints
 *   - /api/health        status probe
 */
import express from 'express';
import cors from 'cors';
import { config, hasAiKey, activeProvider, activeModel } from './lib/config.ts';
import { isAiAvailable, complete } from './lib/aiClient.ts';
import { rateLimit, clientIp, sanitizeText } from './lib/security.ts';

import agentRoutes from './routes/agent.ts';
import searchRoutes from './routes/search.ts';
import jobMatchRoutes from './routes/jobMatch.ts';
import articleRoutes from './routes/article.ts';
import contactRoutes from './routes/contact.ts';
import recommendRoutes from './routes/recommend.ts';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin (curl/tests) and configured origins.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: config.jsonLimit }));

// Lightweight rate limiting for the AI routes (per IP, sliding window).
app.use('/api', (req, res, next) => {
  const { ok, retryAfterMs } = rateLimit(clientIp(req));
  if (!ok) {
    res.set('Retry-After', String(Math.ceil(retryAfterMs / 1000)));
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  next();
});

// ── Health ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasKey: hasAiKey,
    aiAvailable: isAiAvailable(),
    provider: activeProvider,
    model: activeModel,
    features: ['agent', 'search', 'job-match', 'article-summary', 'article-qa', 'contact-assist', 'recommend'],
    time: new Date().toISOString(),
  });
});

// ── AI feature routes ────────────────────────────────────────────────
app.use('/api/agent', agentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/job-match', jobMatchRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/recommend', recommendRoutes);

// ── Legacy compatibility (kept so existing frontend clients keep working)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const reply = await complete(
      messages.map((m: any) => ({ role: m.role, content: String(m.content || '') })),
      { model: model || activeModel, maxTokens: 1000 }
    );
    if (reply === null) {
      return res.status(500).json({ error: 'AI is not configured (missing OPENROUTER_API_KEY) or the request failed.' });
    }
    return res.json({ content: reply, message: reply });
  } catch (error: any) {
    console.error('[chat] error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get chat response' });
  }
});

app.post('/api/insights', async (req, res) => {
  try {
    const { context, type } = req.body;
    const prompt = String(context || '').trim();
    if (!prompt) return res.status(400).json({ error: 'context is required' });

    const prompts: Record<string, string> = {
      portfolio: 'As a portfolio advisor, provide 2-3 actionable suggestions to improve this portfolio.',
      project: 'As a technical advisor, provide improvement suggestions for this project description.',
      code: 'As a code reviewer, provide constructive feedback on this code.',
      general: 'Provide helpful suggestions based on this context.',
    };
    const reply = await complete(
      [
        { role: 'system', content: prompts[type] || prompts.general },
        { role: 'user', content: sanitizeText(prompt, 4000) },
      ],
      { maxTokens: 500 }
    );
    if (reply === null) return res.status(500).json({ error: 'AI is not configured or the request failed.' });
    return res.json({ content: reply });
  } catch (error: any) {
    console.error('[insights] error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get insights' });
  }
});

// 404 + error handlers
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] unhandled error:', err?.message || err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Nova AI server running on http://localhost:${config.port}`);
  console.log(`Provider: ${activeProvider || 'NONE'} | key: ${hasAiKey ? 'loaded' : 'MISSING'}`);
  console.log(`Model: ${activeModel}`);
  console.log(`AI available: ${isAiAvailable()}`);
});
