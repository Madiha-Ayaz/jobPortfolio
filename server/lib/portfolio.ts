/**
 * portfolio — the AI server's view of the portfolio content.
 *
 * Sourced from the persistent content store (seeded from `src/lib/data.ts`),
 * so every AI feature (agent RAG, search, job match, recommendations) works
 * with the CURRENT content — including edits made through the AI assistant.
 */
import { getContent } from './store.ts';
import type { Project, BlogPost, Profile, Skill, Certification, Education } from '../../src/lib/data.ts';

export const projects: Project[] = getContent().projects;
export const blogPosts: BlogPost[] = getContent().blogPosts;
export const profile: Profile = getContent().profile;
export const skills: Skill[] = getContent().skills;
export const certifications: Certification[] = getContent().certifications;
export const education: Education[] = getContent().education;

/** Human-readable document text used for matching and RAG grounding. */
export function projectText(p: Project): string {
  return [p.title, p.description, p.tags.join(', ')].join(' ').toLowerCase();
}

export function postText(post: BlogPost): string {
  return [post.title, post.excerpt, post.tags.join(', ')].join(' ').toLowerCase();
}

/** Plain-text rendering of the profile — used by AI prompts (live data). */
export function profileToText(): string {
  const c = getContent();
  const skillLines = c.skills.map((s) => `- ${s.name} (${s.level}/100, ${s.category})`).join('\n');
  const certLines = c.certifications.map((cert) => `- ${cert.name} — ${cert.issuer} (${cert.year})`).join('\n');
  const projectLines = c.projects
    .map((p) => `- ${p.title}: ${p.description} [tags: ${p.tags.join(', ')}]`)
    .join('\n');
  return [
    `NAME: ${c.profile.name}`,
    `ROLE: ${c.profile.role}`,
    `TAGLINE: ${c.profile.tagline}`,
    `BIO: ${c.profile.bio}`,
    `LOCATION: ${c.profile.location}`,
    `OPEN TO: ${c.profile.openTo.join('; ')}`,
    '',
    'SKILLS:',
    skillLines,
    '',
    'CERTIFICATIONS:',
    certLines,
    '',
    'EDUCATION:',
    `- ${c.education[0]?.degree} — ${c.education[0]?.university} (${c.education[0]?.graduated})`,
    '',
    'SELECTED PROJECTS:',
    projectLines,
  ].join('\n');
}

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
  return getContent().blogPosts.find((p) => p.slug === slug);
}

export function getProjectById(id: number) {
  return getContent().projects.find((p) => p.id === id);
}

/**
 * Slice a long blog post into overlapping chunks for grounded Q&A.
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
      const split = current.split(' ');
      current = split.slice(-Math.floor(overlap / 6)).join(' ');
    }
    current = current ? current + ' ' + sentence : sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}