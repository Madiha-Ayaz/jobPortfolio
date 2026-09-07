/**
 * Server configuration — single place for environment-driven settings.
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3001),

  // OpenRouter gives access to Gemini / GPT / Claude / Llama / Grok through one
  // OpenAI-compatible API. Key is read server-side only (never VITE_ prefixed).
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',

  // xAI Grok — alternative direct provider (OpenAI-compatible).
  // Set GROK_API_KEY to use Grok instead of OpenRouter.
  grokApiKey: process.env.GROK_API_KEY || process.env.XAI_API_KEY || '',
  grokModel: process.env.GROK_MODEL || 'grok-3-mini',
  grokBaseUrl: process.env.GROK_BASE_URL || 'https://api.x.ai/v1',

  // Public site URL (sent to OpenRouter as the HTTP-Referer).
  siteUrl: process.env.SITE_URL || 'http://localhost:5173',

  // Comma separated list of allowed browser origins.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  // Request hardening
  jsonLimit: process.env.JSON_BODY_LIMIT || '128kb',

  // Rate limiting (requests per window per IP)
  rateLimit: {
    windowMs: Number(process.env.RATE_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 30),
  },

  // Timeout for a single upstream LLM call (ms)
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS || 30_000),

  // Neon (PostgreSQL) — connection string + SSL flag. Server-side only.
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL === 'true' || /sslmode=require/.test(process.env.DATABASE_URL || ''),
} as const;

/** True when a Neon/Postgres connection string has been provided. */
export const hasDatabase = Boolean(config.databaseUrl);

export const hasAiKey = Boolean(config.openRouterApiKey || config.grokApiKey);

/** Which provider is active right now: 'grok' | 'openrouter' | null */
export const activeProvider = config.grokApiKey
  ? 'grok'
  : config.openRouterApiKey
  ? 'openrouter'
  : null;

/** The model name for the active provider. */
export const activeModel = config.grokApiKey ? config.grokModel : config.model;
