/**
 * /api/article/* — AI reading companion for blog posts.
 *  - POST /api/article/summarize : one-click summary + key takeaways
 *  - POST /api/article/ask       : grounded Q&A against the article (RAG)
 */
import { Router } from 'express';
import { complete, completeJson, isAiAvailable } from '../lib/aiClient.ts';
import { ARTICLE_SUMMARY_SYSTEM, ARTICLE_QA_SYSTEM } from '../lib/prompts.ts';
import { getPostBySlug, chunkText, stripHtml } from '../lib/portfolio.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

router.post('/summarize', async (req, res) => {
  try {
    const slug = sanitizeText(req.body?.slug, 120);
    const post = getPostBySlug(slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const aiEnabled = isAiAvailable();
    let summary: string | null = null;
    let takeaways: string[] = [];
    let readMinutes = Math.max(1, Math.round(stripHtml(post.content).split(' ').length / 200));

    if (aiEnabled) {
      const parsed = await completeJson<{
        summary?: string;
        keyTakeaways?: string[];
        estimatedReadMinutes?: number;
      }>(
        ARTICLE_SUMMARY_SYSTEM,
        `ARTICLE TITLE: ${post.title}\n\nARTICLE CONTENT:\n${stripHtml(post.content).slice(0, 6000)}`,
        { temperature: 0.2, maxTokens: 600 }
      );
      if (parsed?.summary) {
        summary = parsed.summary;
        takeaways = Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [];
        if (typeof parsed.estimatedReadMinutes === 'number') readMinutes = Math.max(1, parsed.estimatedReadMinutes);
      }
    }

    if (!summary) {
      // Deterministic fallback so the feature still works without an AI key.
      summary = post.excerpt;
      takeaways = post.tags;
    }

    return res.json({
      slug,
      title: post.title,
      summary,
      keyTakeaways: takeaways,
      estimatedReadMinutes: readMinutes,
      aiEnabled,
      confidence: aiEnabled ? 0.9 : 0.6,
    });
  } catch (err) {
    console.error('[article/summarize] failed:', err);
    return res.status(500).json({ error: 'Failed to summarize article' });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const slug = sanitizeText(req.body?.slug, 120);
    const question = sanitizeText(req.body?.question, 500);
    const post = getPostBySlug(slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!question) return res.status(400).json({ error: 'question is required' });

    if (!isAiAvailable()) {
      return res.json({ answer: null, available: false, confidence: 0 });
    }

    const chunks = chunkText(post.content, 1800, 220);
    // Use the most relevant chunk(s): naive keyword scoring keeps this fast.
    const q = question.toLowerCase();
    const ranked = chunks
      .map((chunk, idx) => ({ chunk, idx, hits: (chunk.match(new RegExp('\\b' + q.replace(/[^a-z0-9 ]/gi, ' ').trim().split(/\s+/).join('\\b.*\\b'), 'i')) || []).length }))
      .sort((a, b) => b.hits - a.hits);
    const topChunks = ranked.slice(0, Math.min(2, ranked.length)).map((r) => r.chunk);

    const answer = await complete(
      [
        { role: 'system', content: ARTICLE_QA_SYSTEM },
        {
          role: 'user',
          content: `ARTICLE TITLE: ${post.title}\n\nARTICLE EXCERPT:\n${post.excerpt}\n\nRELEVANT EXCERPTS:\n${topChunks.join('\n---\n')}\n\nQUESTION: ${question}`,
        },
      ],
      { temperature: 0.2, maxTokens: 350 }
    );

    if (!answer) {
      return res.status(500).json({ error: 'Failed to generate answer' });
    }

    return res.json({
      answer,
      available: true,
      confidence: 0.85,
      groundedIn: topChunks.length,
      articleTitle: post.title,
    });
  } catch (err) {
    console.error('[article/ask] failed:', err);
    return res.status(500).json({ error: 'Failed to answer question' });
  }
});

export default router;
