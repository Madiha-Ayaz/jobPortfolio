/**
 * portfolio — the AI server's view of the portfolio content.
 * Imports the SAME data file as the frontend so there is a single source
 * of truth (src/lib/data.ts).
 */
import {
  profile,
  skills,
  certifications,
  education,
  projects,
  blogPosts,
  profileToText,
} from '../../src/lib/data.ts';

export { profile, skills, certifications, education, projects, blogPosts, profileToText };

/** Strip HTML tags and collapse whitespace. Used for blog RAG + summaries. */
export function stripHtml(html: string): string {
  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getProjectById(id: number) {
  return projects.find((p) => p.id === id);
}

/** Human-readable document text used for matching and RAG grounding. */
export function projectText(p: (typeof projects)[number]): string {
  return [p.title, p.description, p.tags.join(', ')].join(' ').toLowerCase();
}

export function postText(post: (typeof blogPosts)[number]): string {
  return [post.title, post.excerpt, post.tags.join(', ')].join(' ').toLowerCase();
}

/**
 * Slice a long blog post into overlapping chunks for grounded Q&A.
 * Simple heading/paragraph aware chunker with a soft character budget.
 */
export function chunkText(text: string, maxChars = 1600, overlap = 200): string[] {
  const cleaned = stripHtml(text);
  if (cleaned.length <= maxChars) return [cleaned];

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      // keep a small overlap so context carries between chunks
      const words = current.split(' ');
      current = words.slice(-Math.floor(overlap / 6)).join(' ');
    }
    current = current ? current + ' ' + sentence : sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
