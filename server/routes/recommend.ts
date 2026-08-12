/**
 * /api/recommend — "what should I look at?" project recommender.
 * Ranks every portfolio project against a visitor's interest using the LLM,
 * falling back to deterministic keyword scoring when the AI is unavailable.
 */
import { Router } from 'express';
import { completeJson, isAiAvailable } from '../lib/aiClient.ts';
import { RECOMMEND_SYSTEM } from '../lib/prompts.ts';
import { projects, projectText } from '../lib/portfolio.ts';
import { sanitizeText } from '../lib/security.ts';

const router = Router();

interface Match {
  id: number;
  score: number;
  reason: string;
}

function publicProject(p: (typeof projects)[number]) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags,
    imageUrl: p.imageUrl,
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
  };
}

function keywordMatches(query: string): Match[] {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  const aiIntent =
    /\b(ai|artificial intelligence|agent|machine learning|genai|generative|llm|chatbot|hackathon)\b/.test(q);

  const scored = projects
    .map((p) => {
      const text = projectText(p);
      let score = 0;

      for (const term of terms) {
        if (text.includes(term)) score += 2;
      }
      for (const tag of p.tags) {
        if (q.includes(tag.toLowerCase())) score += 3;
      }
      if (aiIntent && /\b(ai|agent|llm|hackathon|bank|intelligence)\b/.test(text)) score += 3;
      if (q === 'all' || q === 'everything' || q === '') score += 1;

      return { id: p.id, score: Math.min(100, Math.round(score * 10)), reason: '' };
    })
    .sort((a, b) => b.score - a.score);

  return scored.map((m) => {
    const p = projects.find((x) => x.id === m.id)!;
    const reason =
      m.score > 0
        ? `Relevant to "${query.trim()}" — ${p.tags.join(', ')}.`
        : `Every project in the collection — ${p.tags.join(', ')}.`;
    return { ...m, reason };
  });
}

router.post('/', async (req, res) => {
  try {
    const query = sanitizeText(req.body?.query, 500);
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const aiEnabled = isAiAvailable();
    let matches: Match[] | null = null;

    if (aiEnabled) {
      const parsed = await completeJson<{ matches?: { id?: number; reason?: string; score?: number }[] }>(
        RECOMMEND_SYSTEM,
        `PROJECTS:\n${projects
          .map((p) => `- id:${p.id} | ${p.title} | ${p.description} | tags: ${p.tags.join(', ')}`)
          .join('\n')}\n\nVISITOR INTEREST:\n${query}`,
        { temperature: 0.2, maxTokens: 900 }
      );

      if (Array.isArray(parsed?.matches)) {
        const ordered = parsed.matches
          .filter((m) => projects.some((p) => p.id === m.id))
          .map((m) => ({
            id: Number(m.id),
            score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
            reason: String(m.reason || 'Looks like a good match.'),
          }));

        const seen = new Set<number>();
        for (const id of projects.map((p) => p.id)) seen.add(id);
        for (const m of ordered) seen.delete(m.id);
        const rest = Array.from(seen).map((id) => ({
          id,
          score: 0,
          reason: 'Every project in the collection.',
        }));
        matches = [...ordered, ...rest];
      }
    }

    const ranked = matches ?? keywordMatches(query);

    return res.json({
      query,
      aiEnabled,
      matches: ranked.map((m) => publicProject(projects.find((p) => p.id === m.id)!)).map((p, i) => ({
        ...p,
        score: ranked[i].score,
        reason: ranked[i].reason,
      })),
    });
  } catch (err) {
    console.error('[recommend] failed:', err);
    const query = sanitizeText(req.body?.query, 500);
    return res.json({
      query,
      aiEnabled: false,
      matches: keywordMatches(query).map((m) => ({
        ...publicProject(projects.find((p) => p.id === m.id)!),
        score: m.score,
        reason: m.reason,
      })),
      degraded: true,
    });
  }
});

export default router;
