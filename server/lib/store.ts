/**
 * store — a tiny, persistent content store for the portfolio.
 *
 * The portfolio's content historically lived only in `src/lib/data.ts` and
 * could not be changed at runtime. This store seeds from that file and then
 * persists any changes to `server/data/portfolio.json`, making AI-powered
 * portfolio edits REAL and durable while keeping the static data as the
 * seed/default.
 */
import fs from 'fs';
import path from 'path';
import {
  projects as seedProjects,
  blogPosts as seedPosts,
  profile as seedProfile,
  skills as seedSkills,
  certifications as seedCertifications,
  education as seedEducation,
} from '../../src/lib/data.ts';
import type {
  Project,
  BlogPost,
  Profile,
  Skill,
  Certification,
  Education,
} from '../../src/lib/data.ts';

export interface ContentShape {
  projects: Project[];
  blogPosts: BlogPost[];
  profile: Profile;
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');

function seed(): ContentShape {
  return {
    projects: seedProjects,
    blogPosts: seedPosts,
    profile: seedProfile,
    skills: seedSkills,
    certifications: seedCertifications,
    education: seedEducation,
    updatedAt: new Date().toISOString(),
  };
}

let cache: ContentShape | null = null;

/** Initialise the file (seed from static defaults) if needed. */
function ensureFile(): void {
  if (fs.existsSync(DATA_FILE)) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const initial = seed();
  fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
}

function load(): ContentShape {
  ensureFile();
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Shape-safety: fall back to seed if the file is missing required arrays.
    if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.blogPosts)) {
      cache = {
        projects: parsed.projects,
        blogPosts: parsed.blogPosts,
        profile: { ...seedProfile, ...(parsed.profile ?? {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : seedSkills,
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : seedCertifications,
        education: Array.isArray(parsed.education) ? parsed.education : seedEducation,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
      return cache;
    }
    cache = seed();
    return cache;
  } catch {
    cache = seed();
    return cache;
  }
}

function persist(next: ContentShape): ContentShape {
  cache = { ...next, updatedAt: new Date().toISOString() };
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  return cache;
}

export function getContent(): ContentShape {
  const c = load();
  return {
    projects: [...c.projects],
    blogPosts: [...c.blogPosts],
    profile: { ...c.profile, links: [...(c.profile.links ?? [])] },
    skills: [...c.skills],
    certifications: [...c.certifications],
    education: [...c.education],
    updatedAt: c.updatedAt,
  };
}

/* ────────────────────────────── validation ────────────────────────────── */

function cleanStr(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((t) => t.slice(0, 60));
}

function cleanUrl(value: unknown, max = 500): string {
  const s = cleanStr(value, max);
  if (!s) return '';
  if (s !== '#' && !/^https?:\/\//i.test(s)) return '';
  return s;
}

export function validateProject(input: unknown): { ok: true; value: Partial<Project> } | { ok: false; error: string } {
  const src = (input ?? {}) as Record<string, unknown>;
  const title = cleanStr(src.title, 120);
  const description = cleanStr(src.description, 3000);
  if (!title) return { ok: false, error: 'Project title is required.' };
  if (!description) return { ok: false, error: 'Project description is required.' };
  return {
    ok: true,
    value: {
      title,
      description,
      imageUrl: cleanUrl(src.imageUrl ?? (src.image as unknown), 500),
      tags: cleanTags(src.tags),
      liveUrl: cleanUrl(src.liveUrl, 500),
      repoUrl: cleanUrl(src.repoUrl, 500),
    },
  };
}

/** Partial-update validation: only provided fields are returned, and at least one is required. */
export function validateProjectUpdate(input: unknown): { ok: true; value: Partial<Project> } | { ok: false; error: string } {
  const src = (input ?? {}) as Record<string, unknown>;
  const hasAny = ['title', 'description', 'tags', 'liveUrl', 'repoUrl', 'imageUrl', 'image'].some(
    (k) => src[k] !== undefined && src[k] !== null && String(src[k]).trim() !== ''
  );
  if (!hasAny) return { ok: false, error: 'Nothing to update.' };

  const value: Partial<Project> = {};
  if (src.title !== undefined) {
    const title = cleanStr(src.title, 120);
    if (!title) return { ok: false, error: 'Project title cannot be empty.' };
    value.title = title;
  }
  if (src.description !== undefined) {
    const description = cleanStr(src.description, 3000);
    if (!description) return { ok: false, error: 'Project description cannot be empty.' };
    value.description = description;
  }
  if (src.imageUrl !== undefined || src.image !== undefined) {
    value.imageUrl = cleanUrl(src.imageUrl ?? (src.image as unknown), 500);
  }
  if (src.tags !== undefined) value.tags = cleanTags(src.tags);
  if (src.liveUrl !== undefined) value.liveUrl = cleanUrl(src.liveUrl, 500);
  if (src.repoUrl !== undefined) value.repoUrl = cleanUrl(src.repoUrl, 500);
  return { ok: true, value };
}

export function validatePost(input: unknown): { ok: true; value: Partial<BlogPost> } | { ok: false; error: string } {
  const src = (input ?? {}) as Record<string, unknown>;
  const title = cleanStr(src.title, 160);
  if (!title) return { ok: false, error: 'Blog title is required.' };
  const slug = cleanStr(src.slug, 200) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const content = cleanStr(src.content, 60_000);
  return {
    ok: true,
    value: {
      title,
      slug,
      excerpt: cleanStr(src.excerpt, 500),
      content,
      author: cleanStr(src.author, 120) || undefined,
      date: cleanStr(src.date, 20),
      tags: cleanTags(src.tags),
      imageUrl: cleanUrl(src.imageUrl, 500),
    },
  };
}

export function validateProfilePatch(input: unknown): Partial<Profile> {
  const src = (input ?? {}) as Record<string, unknown>;
  const links = Array.isArray(src.links)
    ? src.links
        .filter((l: unknown): l is Record<string, unknown> => typeof l === 'object' && l !== null)
        .map((l) => ({
          label: cleanStr(l.label, 60) || 'link',
          url: cleanUrl(l.url, 500) || '#',
        }))
        .slice(0, 12)
    : undefined;
  const openTo = Array.isArray(src.openTo)
    ? src.openTo.filter((x): x is string => typeof x === 'string').map((s) => s.trim().slice(0, 80)).filter(Boolean).slice(0, 20)
    : undefined;
  return {
    name: cleanStr(src.name, 120) || undefined,
    role: cleanStr(src.role, 120) || undefined,
    tagline: cleanStr(src.tagline, 200) || undefined,
    bio: cleanStr(src.bio, 2000) || undefined,
    location: cleanStr(src.location, 120) || undefined,
    email: cleanStr(src.email, 200) || undefined,
    resumeUrl: cleanUrl(src.resumeUrl, 300) || undefined,
    ...(links ? { links } : {}),
    ...(openTo ? { openTo } : {}),
  };
}

/* ────────────────────────────── mutations ────────────────────────────── */

export function createProject(input: unknown): { ok: true; value: Project } | { ok: false; error: string } {
  const check = validateProject(input);
  if (!check.ok) return check;
  const content = load();
  const id = content.projects.length ? Math.max(...content.projects.map((p) => p.id)) + 1 : 1;
  const project: Project = {
    id,
    title: check.value.title ?? '',
    description: check.value.description ?? '',
    imageUrl: check.value.imageUrl ?? '',
    tags: check.value.tags ?? [],
    liveUrl: check.value.liveUrl ?? '',
    repoUrl: check.value.repoUrl ?? '',
  };
  persist({ ...content, projects: [...content.projects, project] });
  return { ok: true, value: project };
}

export function updateProject(id: number, input: unknown): { ok: true; value: Project } | { ok: false; error: string } {
  const check = validateProjectUpdate(input);
  if (!check.ok) return check;
  const content = load();
  const idx = content.projects.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: `Project ${id} not found.` };
  const projects = [...content.projects];
  projects[idx] = { ...projects[idx], ...check.value };
  persist({ ...content, projects });
  return { ok: true, value: projects[idx] };
}

export function removeProject(id: number): { ok: boolean; error?: string } {
  const content = load();
  const idx = content.projects.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: `Project ${id} not found.` };
  persist({ ...content, projects: content.projects.filter((p) => p.id !== id) });
  return { ok: true };
}

export function createPost(input: unknown): { ok: true; value: BlogPost } | { ok: false; error: string } {
  const check = validatePost(input);
  if (!check.ok) return check;
  const content = load();
  if (content.blogPosts.some((p) => p.slug === check.value.slug)) {
    return { ok: false, error: `A post with slug "${check.value.slug}" already exists.` };
  }
  const id = content.blogPosts.length ? Math.max(...content.blogPosts.map((p) => p.id)) + 1 : 1;
  const post: BlogPost = {
    id,
    slug: check.value.slug ?? '',
    title: check.value.title ?? '',
    excerpt: check.value.excerpt ?? '',
    content: check.value.content ?? '',
    author: check.value.author ?? seedProfile.name,
    date: check.value.date ?? new Date().toISOString().slice(0, 10),
    tags: check.value.tags ?? [],
    imageUrl: check.value.imageUrl ?? '',
  };
  const blogPosts = [post, ...content.blogPosts];
  persist({ ...content, blogPosts });
  return { ok: true, value: post };
}

/** Partial-update validation for blog posts: only provided fields return, at least one is required. */
export function validatePostUpdate(input: unknown): { ok: true; value: Partial<BlogPost> } | { ok: false; error: string } {
  const src = (input ?? {}) as Record<string, unknown>;
  const hasAny = ['title', 'slug', 'excerpt', 'content', 'author', 'date', 'tags', 'imageUrl'].some(
    (k) => src[k] !== undefined && src[k] !== null && String(src[k]).trim() !== ''
  );
  if (!hasAny) return { ok: false, error: 'Nothing to update.' };

  const value: Partial<BlogPost> = {};
  let title: string | undefined;
  if (src.title !== undefined) {
    title = cleanStr(src.title, 160);
    if (!title) return { ok: false, error: 'Blog title cannot be empty.' };
    value.title = title;
  }
  if (src.slug !== undefined) {
    const slug = cleanStr(src.slug, 200);
    if (!slug) return { ok: false, error: 'Blog slug cannot be empty.' };
    value.slug = slug;
  } else if (title) {
    value.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (src.excerpt !== undefined) {
    const excerpt = cleanStr(src.excerpt, 500);
    if (excerpt) value.excerpt = excerpt;
  }
  if (src.content !== undefined) value.content = cleanStr(src.content, 60_000);
  if (src.author !== undefined) {
    const author = cleanStr(src.author, 120);
    if (author) value.author = author;
  }
  if (src.date !== undefined) {
    const date = cleanStr(src.date, 20);
    if (date) value.date = date;
  }
  if (src.tags !== undefined) value.tags = cleanTags(src.tags);
  if (src.imageUrl !== undefined) value.imageUrl = cleanUrl(src.imageUrl, 500);
  return { ok: true, value };
}

export function updatePost(id: number, input: unknown): { ok: true; value: BlogPost } | { ok: false; error: string } {
  const check = validatePostUpdate(input);
  if (!check.ok) return check;
  const content = load();
  const idx = content.blogPosts.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: `Post ${id} not found.` };
  if (check.value.slug && content.blogPosts.some((p) => p.slug === check.value.slug && p.id !== id)) {
    return { ok: false, error: `A post with slug "${check.value.slug}" already exists.` };
  }
  const blogPosts = [...content.blogPosts];
  blogPosts[idx] = { ...blogPosts[idx], ...check.value };
  persist({ ...content, blogPosts });
  return { ok: true, value: blogPosts[idx] };
}

export function removePost(id: number): { ok: boolean; error?: string } {
  const content = load();
  const idx = content.blogPosts.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: `Post ${id} not found.` };
  persist({ ...content, blogPosts: content.blogPosts.filter((p) => p.id !== id) });
  return { ok: true };
}

export function applyProfilePatch(input: unknown): { ok: true; value: Profile } | { ok: false; error: string } {
  const patch = validateProfilePatch(input);
  const content = load();
  const next: Profile = { ...content.profile, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)) };
  persist({ ...content, profile: next });
  return { ok: true, value: next };
}

/** Reload the cache from disk (used by tests / external edits). */
export function reload(): void {
  cache = null;
  load();
}