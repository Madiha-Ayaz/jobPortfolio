/**
 * analytics — client-side visitor tracking that writes to Neon (Postgres)
 * through the backend (/api/analytics/*).
 *
 * Everything is best-effort: tracking failures never break the UI.
 * A single session id is generated per page-load and a visitor id is kept
 * in localStorage so repeat visits by the same browser are linked.
 */
import { apiUrl } from './api';

const VISITOR_KEY = 'nova_visitor_id';

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = uid();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return uid();
  }
}

/** Session id for this page-load (module-level so analytics all share it). */
export const getSessionId: () => string = (() => {
  let sessionId: string | null = null;
  return () => {
    if (sessionId) return sessionId;
    sessionId = uid();
    return sessionId;
  };
})();

async function post(path: string, body: Record<string, unknown>): Promise<void> {
  try {
    await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* non-fatal */
  }
}

const base = () => ({
  sessionId: getSessionId(),
  visitorId: getVisitorId(),
});

/** Called once when the app mounts. */
export function trackSessionStart(path = '/'): void {
  post('analytics/session/start', {
    ...base(),
    path,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  });
}

/** Called when the app unmounts / before unload. */
export function trackSessionClose(): void {
  post('analytics/session/close', base());
}

/** Called on every route change. */
export function trackPageView(path: string): void {
  if (!path) return;
  post('analytics/page-view', { ...base(), path });
}

/** Called when a project's details/live demo is opened. */
export function trackProjectView(projectTitle: string, projectId?: number, action = 'open'): void {
  if (!projectTitle) return;
  post('analytics/project-view', { ...base(), projectTitle, projectId, action });
}

/** Called for every AI chat message exchanged with the assistant. */
export function trackChat(role: 'user' | 'assistant', content: string, page?: string): void {
  if (!content) return;
  post('analytics/chat', { ...base(), role, content, page });
}

/** Called on a contact-form submission. */
export function trackContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  intent?: string;
  priority?: string;
}): void {
  if (!payload.name || !payload.email || !payload.message) return;
  post('analytics/contact', { ...payload });
}

/** Called when the project finder / AI recommender is used. */
export function trackFinder(query: string, results: unknown[]): void {
  if (!query) return;
  post('analytics/finder', { ...base(), query, results });
}

/** Called when a Firebase user signs in / registers. */
export function trackUser(payload: { uid: string; email?: string; name?: string; provider?: string }): void {
  if (!payload.uid) return;
  post('analytics/user', { ...payload });
}