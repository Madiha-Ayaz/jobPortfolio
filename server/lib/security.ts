/**
 * security — lightweight request hardening for the AI endpoints.
 * In-memory sliding-window rate limiter + input sanitization.
 */
import { config } from './config.ts';

const buckets = new Map<string, number[]>();

export function rateLimit(ip: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const windowStart = now - config.rateLimit.windowMs;
  const hits = (buckets.get(ip) || []).filter((t) => t > windowStart);

  if (hits.length >= config.rateLimit.max) {
    const retryAfterMs = Math.max(0, windowStart + config.rateLimit.windowMs - now);
    return { ok: false, retryAfterMs };
  }

  hits.push(now);
  buckets.set(ip, hits);
  return { ok: true, retryAfterMs: 0 };
}

/** Strip control characters and cap length to keep prompts clean. */
export function sanitizeText(value: unknown, maxLen = 4000): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

export function clientIp(req: { ip?: string; headers: Record<string, unknown>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}
