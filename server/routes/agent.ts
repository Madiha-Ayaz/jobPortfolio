/**
 * /api/agent — Nova, the grounded portfolio agent.
 * Adds Retrieval-Augmented context (projects / posts / skills) so answers
 * cite real portfolio content, and reports confidence + sources to the UI.
 */
import { Router } from 'express';
import { client, activeModel } from '../lib/aiClient.ts';
import { config } from '../lib/config.ts';
import { AGENT_SYSTEM } from '../lib/prompts.ts';
import { profileToText, getPostBySlug } from '../lib/portfolio.ts';
import { searchPortfolioLocal } from '../lib/search.ts';
import { sanitizeText } from '../lib/security.ts';
import { saveChatMessage } from '../lib/db.ts';

const router = Router();

const TOOLS = [
  { type: 'function' as const, function: { name: 'navigate', description: 'Navigate the user to a specific page in the portfolio.', parameters: { type: 'object' as const, properties: { path: { type: 'string' as const, description: 'Route path like /, /about, /projects, /blog, /contact, /dashboard, /ai' } }, required: ['path'] } } },
  { type: 'function' as const, function: { name: 'openProject', description: 'Open the projects page, optionally highlighting a project by its title.', parameters: { type: 'object' as const, properties: { projectName: { type: 'string' as const } }, required: ['projectName'] } } },
  { type: 'function' as const, function: { name: 'openBlogPost', description: 'Open a specific blog post by slug.', parameters: { type: 'object' as const, properties: { slug: { type: 'string' as const } }, required: ['slug'] } } },
  { type: 'function' as const, function: { name: 'toggleTheme', description: 'Toggle between dark and light mode.', parameters: { type: 'object' as const, properties: {} } } },
  { type: 'function' as const, function: { name: 'openContactForm', description: 'Open the contact page.', parameters: { type: 'object' as const, properties: {} } } },
  { type: 'function' as const, function: { name: 'openAITools', description: 'Open the AI tools / job match page.', parameters: { type: 'object' as const, properties: {} } } },
  { type: 'function' as const, function: { name: 'createProject', description: 'Create a new portfolio project. Requires title and description. The client will confirm with the user before saving.', parameters: { type: 'object' as const, properties: { title: { type: 'string' as const, description: 'Project title' }, description: { type: 'string' as const, description: 'Professional project description' }, tags: { type: 'array' as const, items: { type: 'string' as const }, description: 'Optional technology tags' }, liveUrl: { type: 'string' as const }, repoUrl: { type: 'string' as const }, imageUrl: { type: 'string' as const } }, required: ['title', 'description'] } } },
  { type: 'function' as const, function: { name: 'updateProject', description: 'Update an existing project (title, description, tags, links). The client will confirm with the user before saving.', parameters: { type: 'object' as const, properties: { id: { type: 'number' as const, description: 'The numeric project id' }, title: { type: 'string' as const }, description: { type: 'string' as const, description: 'Improved professional description' }, tags: { type: 'array' as const, items: { type: 'string' as const } }, liveUrl: { type: 'string' as const }, repoUrl: { type: 'string' as const }, imageUrl: { type: 'string' as const } }, required: ['id'] } } },
  { type: 'function' as const, function: { name: 'deleteProject', description: 'Delete a project by id. DESTRUCTIVE — the client will always confirm with the user before executing.', parameters: { type: 'object' as const, properties: { id: { type: 'number' as const, description: 'The numeric project id' } }, required: ['id'] } } },
  { type: 'function' as const, function: { name: 'createBlogPost', description: 'Create a new blog post. Requires title and content. The client will confirm before saving.', parameters: { type: 'object' as const, properties: { title: { type: 'string' as const }, content: { type: 'string' as const, description: 'HTML or plain text content' }, excerpt: { type: 'string' as const }, tags: { type: 'array' as const, items: { type: 'string' as const } }, imageUrl: { type: 'string' as const } }, required: ['title', 'content'] } } },
  { type: 'function' as const, function: { name: 'updateBlogPost', description: 'Update an existing blog post (title, content, tags, etc.). The client will confirm before saving.', parameters: { type: 'object' as const, properties: { id: { type: 'number' as const }, title: { type: 'string' as const }, content: { type: 'string' as const, description: 'Improved content' }, excerpt: { type: 'string' as const }, tags: { type: 'array' as const, items: { type: 'string' as const } }, imageUrl: { type: 'string' as const } }, required: ['id'] } } },
  { type: 'function' as const, function: { name: 'deleteBlogPost', description: 'Delete a blog post by id. DESTRUCTIVE — the client will always confirm with the user before executing.', parameters: { type: 'object' as const, properties: { id: { type: 'number' as const } }, required: ['id'] } } },
  { type: 'function' as const, function: { name: 'updateProfile', description: 'Update portfolio profile fields (name, role, tagline, bio, location, email). The client will confirm before saving.', parameters: { type: 'object' as const, properties: { name: { type: 'string' as const }, role: { type: 'string' as const }, tagline: { type: 'string' as const }, bio: { type: 'string' as const }, location: { type: 'string' as const }, email: { type: 'string' as const } }, required: [] } } },
];

interface AgentSource {
  type: 'project' | 'post' | 'profile';
  title: string;
  href?: string;
}

router.post('/', async (req, res) => {
  try {
    const { messages, currentPath } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!client) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set on the server. Add it to your .env file.' });
    }

    // ── RAG context: ground the agent with the most relevant content ──
    const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
    const queryText = sanitizeText(typeof lastUser?.content === 'string' ? lastUser.content : '', 400);

    const sources: AgentSource[] = [];
    let contextBlock = '';

    if (queryText) {
      const hits = searchPortfolioLocal(queryText, 4);
      const contextLines: string[] = [];
      for (const hit of hits) {
        if (hit.type === 'post') {
          const post = getPostBySlug(hit.href.split('/').pop() || '');
          sources.push({ type: 'post', title: hit.title, href: hit.href });
          contextLines.push(`- BLOG POST "${hit.title}": ${post ? post.excerpt : hit.subtitle}`);
        } else {
          sources.push({ type: 'project', title: hit.title, href: hit.href });
          contextLines.push(`- PROJECT "${hit.title}": ${hit.subtitle} [tags: ${hit.tags.join(', ')}]`);
        }
      }
      if (contextLines.length > 0) {
        contextBlock = `\n\nCONTEXT (portfolio content relevant to the user's latest message — use this to ground your answer):\n${contextLines.join('\n')}`;
      }
    }

    const fullMessages: any = [
      { role: 'system', content: AGENT_SYSTEM },
      { role: 'system', content: `The user is currently on page: ${currentPath || '/'}.` },
      { role: 'system', content: `PORTFOLIO PROFILE:\n${profileToText()}${contextBlock}` },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || ''),
      })),
    ];

    const completion: any = await client.chat.completions.create({
      model: activeModel,
      messages: fullMessages,
      tools: TOOLS as any,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 800,
    });

    const choice = completion.choices?.[0];
    if (!choice) return res.status(500).json({ error: 'No response from model' });

    const message = choice.message;
    const reply = message.content || '';
    const toolCalls = (message.tool_calls || []).map((tc: any) => ({
      id: tc.id,
      name: tc.function.name,
      args: (() => {
        try {
          return JSON.parse(tc.function.arguments);
        } catch {
          return {};
        }
      })(),
    }));

    // ── Persist the exchange to Neon (per visitor / session) ──
    const sessionId = sanitizeText(typeof req.body.sessionId === 'string' ? req.body.sessionId : '', 200) || 'unknown';
    const visitorId = sanitizeText(typeof req.body.visitorId === 'string' ? req.body.visitorId : '', 200);
    const page = sanitizeText(currentPath, 300);
    const lastUserMsg = queryText;
    if (lastUserMsg) saveChatMessage({ sessionId, visitorId: visitorId || undefined, role: 'user', content: lastUserMsg, page });
    if (reply) saveChatMessage({ sessionId, visitorId: visitorId || undefined, role: 'assistant', content: reply, page });

    // Confidence: grounded answers score by top match; ungrounded answers get a neutral band.
    const confidence =
      sources.length > 0
        ? Math.min(0.96, 0.6 + (sources.length / 4) * 0.3)
        : 0.55;

    return res.json({ reply, toolCalls, confidence, sources });
  } catch (error: any) {
    console.error('[agent] OpenRouter error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get AI response' });
  }
});

export default router;
