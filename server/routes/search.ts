/**
 * /api/search — AI-powered portfolio search.
 * Returns ranked projects + blog posts with confidence and match reasons.
 */
import { Router } from 'express';
import { searchPortfolio, searchPortfolioLocal } from '../lib/search.ts';
import { isAiAvailable } from '../lib/aiClient.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const query = sanitizeText(req.body?.query, 200);
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const aiEnabled = isAiAvailable();
    const results = await searchPortfolio(query, { expandWithAi: aiEnabled, limit: 8 });

    return res.json({
      query,
      aiEnhanced: aiEnabled,
      results,
      count: results.length,
    });
  } catch (err) {
    console.error('[search] failed:', err);
    // Graceful fallback: local keyword search never depends on the LLM.
    const query = sanitizeText(req.body?.query, 200);
    return res.json({
      query,
      aiEnhanced: false,
      results: searchPortfolioLocal(query, 8),
      count: 0,
      degraded: true,
    });
  }
});

export default router;
