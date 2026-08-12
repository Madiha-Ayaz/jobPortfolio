/**
 * api — single place that resolves the Nova AI backend URL.
 *
 * Resolution order:
 *   1. VITE_API_BASE_URL  — set this in .env to a deployed backend
 *      (e.g. https://nova-ai-backend.onrender.com). Works on the deployed site.
 *   2. Same origin fallback — "" means requests go to `/api/*` on the current
 *      domain (useful when the backend is served by Vercel functions or a proxy).
 *   3. localhost:3001 — the default local dev backend.
 */
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : '')
).replace(/\/+$/, '');

/** Build an absolute URL for a Nova AI API route. */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api/${path.replace(/^\/+/, '')}`;
}
