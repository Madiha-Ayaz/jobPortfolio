/**
 * aiClient — thin wrapper around the OpenRouter API (OpenAI-compatible).
 *
 * Every helper degrades gracefully: if no API key is configured, or the
 * upstream call fails/times out, the callers fall back to deterministic
 * heuristic logic so the product keeps working offline.
 */
import OpenAI from 'openai';
import { config, hasAiKey, activeProvider, activeModel } from './config.ts';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

let client: OpenAI | null = null;

if (hasAiKey) {
  if (activeProvider === 'grok') {
    client = new OpenAI({
      apiKey: config.grokApiKey,
      baseURL: config.grokBaseUrl,
    });
  } else {
    client = new OpenAI({
      apiKey: config.openRouterApiKey,
      baseURL: config.openRouterBaseUrl,
      defaultHeaders: {
        'HTTP-Referer': config.siteUrl,
        'X-Title': 'My Job Portfolio - Nova AI',
      },
    });
  }
}

export function isAiAvailable(): boolean {
  return Boolean(client && hasAiKey);
}

/** The resolved model name for the currently active provider. */
export { activeModel };

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI request timed out')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/** Run a chat completion and return the plain-text reply. Returns null on failure. */
export async function complete(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; model?: string; timeoutMs?: number } = {}
): Promise<string | null> {
  if (!client) return null;
  try {
    const res = await withTimeout(
      client.chat.completions.create({
        model: opts.model || activeModel,
        messages: messages as any,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 800,
      }),
      opts.timeoutMs || config.aiTimeoutMs
    );
    return (res as any)?.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[aiClient] completion failed:', (err as Error)?.message || String(err));
    return null;
  }
}

/**
 * Robust JSON extraction from an LLM reply. LLMs frequently wrap JSON in
 * markdown fences or prose; this unwraps common patterns.
 */
export function extractJson<T = unknown>(text: string): T | null {
  if (!text) return null;

  const trimmed = text.trim();

  // 1) Bare JSON
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    /* continue */
  }

  // 2) JSON inside a markdown code block
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim()) as T;
    } catch {
      /* continue */
    }
  }

  // 3) First { ... } block in the response
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as T;
    } catch {
      /* continue */
    }
  }

  return null;
}

/**
 * Ask the model for a JSON object. Returns the parsed object or null.
 * The prompt must instruct the model to reply with ONLY JSON.
 */
export async function completeJson<T = Record<string, unknown>>(
  system: string,
  user: string,
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<T | null> {
  const reply = await complete(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    { temperature: opts.temperature ?? 0.3, maxTokens: opts.maxTokens ?? 900 }
  );
  if (!reply) return null;
  return extractJson<T>(reply);
}

export { client };
