/**
 * search — hybrid semantic search over the portfolio.
 *
 * Approach:
 *  1. Deterministic weighted term matching (fast, always available).
 *  2. Optional LLM "query expansion" (adds related keywords) when an AI key
 *     is present — this is what makes search feel semantic ("UI with charts"
 *     surfaces the dashboard projects) without brittle embedding pipelines.
 */
import { projects, blogPosts } from './portfolio.ts';
import { completeJson, isAiAvailable } from './aiClient.ts';

export type SearchResultType = 'project' | 'post';

export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  subtitle: string;
  href: string;
  imageUrl?: string;
  tags: string[];
  score: number;
  confidence: number;
  reasons: string[];
}

interface WeightedTerms {
  title: string[];
  tags: string[];
  body: string[];
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'of', 'to', 'in', 'on', 'at',
  'by', 'from', 'is', 'are', 'was', 'be', 'it', 'this', 'that', 'these', 'those',
  'show', 'me', 'about', 'using', 'use', 'used', 'how', 'what', 'which', 'your',
  'you', 'i', 'we', 'they', 'my', 'has', 'have', 'had', 'can', 'could', 'would',
  'do', 'does', 'did', 'want', 'need', 'like', 'build', 'builds', 'built', 'app',
  'application', 'project', 'projects', 'please', 'tell', 'find', 'search', 'any',
]);

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOP_WORDS.has(t));
}

const projectDocs: { id: number; terms: WeightedTerms }[] = projects.map((p) => ({
  id: p.id,
  terms: {
    title: tokenize(p.title),
    tags: p.tags.map((t) => t.toLowerCase()),
    body: tokenize(p.description),
  },
}));

const postDocs: { id: number; terms: WeightedTerms }[] = blogPosts.map((p) => ({
  id: p.id,
  terms: {
    title: tokenize(p.title),
    tags: p.tags.map((t) => t.toLowerCase()),
    body: tokenize(p.excerpt),
  },
}));

function termHits(terms: WeightedTerms, queryTerms: string[]): { score: number; hits: string[] } {
  let score = 0;
  const hits = new Set<string>();

  for (const qt of queryTerms) {
    const foundInTitle = terms.title.includes(qt);
    const foundInTags = terms.tags.some((t) => t === qt || t.startsWith(qt) || qt.startsWith(t));
    const foundInBody = terms.body.includes(qt) || terms.body.some((t) => t.startsWith(qt) || qt.startsWith(t));

    if (foundInTitle) {
      score += 4;
      hits.add(qt);
    } else if (foundInTags) {
      score += 3;
      hits.add(qt);
    } else if (foundInBody) {
      score += 1.5;
      hits.add(qt);
    }
  }

  return { score, hits: [...hits] };
}

/**
 * Expand a query with related keywords using the LLM. Returns [] when the
 * AI is unavailable or the call fails (caller proceeds with keyword search).
 */
async function expandQuery(query: string): Promise<string[]> {
  if (!isAiAvailable()) return [];
  const parsed = await completeJson<{ keywords?: string[] }>(
    'You expand user search queries for a developer portfolio. Reply with ONLY JSON: {"keywords": ["..."]}. Keywords are short, relevant terms (skills, technologies, concepts). Maximum 8.',
    `Query: "${query}"`,
    { maxTokens: 200 }
  );
  if (!parsed || !Array.isArray(parsed.keywords)) return [];
  return parsed.keywords
    .filter((k) => typeof k === 'string' && k.trim())
    .slice(0, 8)
    .map((k) => k.toLowerCase());
}

export interface SearchOptions {
  expandWithAi?: boolean;
  limit?: number;
}

/**
 * Search projects + blog posts. Returns results ranked by relevance, each
 * with a 0..1 confidence and human-readable match reasons.
 */
export async function searchPortfolio(
  rawQuery: string,
  opts: SearchOptions = {}
): Promise<SearchResult[]> {
  const query = (rawQuery || '').trim();
  if (!query) return [];

  let terms = tokenize(query);
  if (opts.expandWithAi && terms.length > 0) {
    const extra = await expandQuery(query);
    terms = [...new Set([...terms, ...extra])];
  }
  if (terms.length === 0) return [];

  const scored: SearchResult[] = [];

  for (const doc of projectDocs) {
    const project = projects.find((p) => p.id === doc.id);
    if (!project) continue;
    const { score, hits } = termHits(doc.terms, terms);
    if (score <= 0) continue;
    scored.push({
      type: 'project',
      id: project.id,
      title: project.title,
      subtitle: project.description,
      href: '/projects',
      imageUrl: project.imageUrl,
      tags: project.tags,
      score,
      confidence: 0,
      reasons: hits,
    });
  }

  for (const doc of postDocs) {
    const post = blogPosts.find((p) => p.id === doc.id);
    if (!post) continue;
    const { score, hits } = termHits(doc.terms, terms);
    if (score <= 0) continue;
    scored.push({
      type: 'post',
      id: post.id,
      title: post.title,
      subtitle: post.excerpt,
      href: `/blog/${post.slug}`,
      imageUrl: post.imageUrl,
      tags: post.tags,
      score,
      confidence: 0,
      reasons: hits,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const max = scored[0]?.score || 1;

  return scored.slice(0, opts.limit ?? 8).map((r) => ({
    ...r,
    // Map raw score into a meaningful 0..1 confidence band.
    confidence: Math.min(0.97, 0.5 + (r.score / max) * 0.45),
    reasons: r.reasons.slice(0, 4),
  }));
}

/** Lightweight keyword-only variant for instant/offline ranking. */
export function searchPortfolioLocal(rawQuery: string, limit = 8): SearchResult[] {
  const query = (rawQuery || '').trim();
  if (!query) return [];
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored: SearchResult[] = [];

  for (const doc of projectDocs) {
    const project = projects.find((p) => p.id === doc.id);
    if (!project) continue;
    const { score, hits } = termHits(doc.terms, terms);
    if (score <= 0) continue;
    scored.push({
      type: 'project',
      id: project.id,
      title: project.title,
      subtitle: project.description,
      href: '/projects',
      imageUrl: project.imageUrl,
      tags: project.tags,
      score,
      confidence: 0,
      reasons: hits,
    });
  }

  for (const doc of postDocs) {
    const post = blogPosts.find((p) => p.id === doc.id);
    if (!post) continue;
    const { score, hits } = termHits(doc.terms, terms);
    if (score <= 0) continue;
    scored.push({
      type: 'post',
      id: post.id,
      title: post.title,
      subtitle: post.excerpt,
      href: `/blog/${post.slug}`,
      imageUrl: post.imageUrl,
      tags: post.tags,
      score,
      confidence: 0,
      reasons: hits,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const max = scored[0]?.score || 1;
  return scored.slice(0, limit).map((r) => ({
    ...r,
    confidence: Math.min(0.97, 0.5 + (r.score / max) * 0.45),
    reasons: r.reasons.slice(0, 4),
  }));
}
