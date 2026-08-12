import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';

const client = OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'My Job Portfolio',
      },
    })
  : null;

app.use(cors());
app.use(express.json());

// Tool definitions (use `as const` for strict typing)
const TOOLS = [
  { type: 'function' as const, function: { name: 'navigate', description: 'Navigate the user to a specific page in the portfolio.', parameters: { type: 'object' as const, properties: { path: { type: 'string' as const, description: 'Route path like /, /about, /projects, /blog, /contact, /auth/login' } }, required: ['path'] } } },
  { type: 'function' as const, function: { name: 'openProject', description: 'Open a specific project page.', parameters: { type: 'object' as const, properties: { projectName: { type: 'string' as const } }, required: ['projectName'] } } },
  { type: 'function' as const, function: { name: 'openBlogPost', description: 'Open a specific blog post by slug.', parameters: { type: 'object' as const, properties: { slug: { type: 'string' as const } }, required: ['slug'] } } },
  { type: 'function' as const, function: { name: 'toggleTheme', description: 'Toggle between dark and light mode.', parameters: { type: 'object' as const, properties: {} } } },
  { type: 'function' as const, function: { name: 'highlightElement', description: 'Highlight a CSS selector on the page with a glow effect.', parameters: { type: 'object' as const, properties: { selector: { type: 'string' as const } }, required: ['selector'] } } },
];

const SYSTEM_PROMPT = `You are "Nova", a friendly AI agent embedded in a developer portfolio. Be concise (2-4 sentences), warm, playful. Call tools when the user wants to navigate or interact.`;

// Agent endpoint with tool support
app.post('/api/agent', async (req, res) => {
  try {
    const { messages, currentPath } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!client) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set on the server. Add it to your .env file.' });
    }
    const fullMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'system' as const, content: `The user is currently on page: ${currentPath || '/'}. Use this context for navigation.` },
      ...messages,
    ];
    const completion: any = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
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
    const toolCalls = (message.tool_calls || []).map((tc: any) => ({ id: tc.id, name: tc.function.name, args: (() => { try { return JSON.parse(tc.function.arguments); } catch { return {}; } })() }));
    return res.json({ reply, toolCalls });
  } catch (error: any) {
    console.error('OpenRouter error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get AI response' });
  }
});

// Chat endpoint for regular chatbot conversations
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!client) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    const response: any = await client.chat.completions.create({
      model: model || OPENROUTER_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices?.[0]?.message?.content || '';
    return res.json({ content, message: content });
  } catch (error: any) {
    console.error('Chat error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get chat response' });
  }
});

// Portfolio insights endpoint
app.post('/api/insights', async (req, res) => {
  try {
    const { context, type } = req.body;
    if (!context) {
      return res.status(400).json({ error: 'context is required' });
    }
    if (!client) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    const prompts: Record<string, string> = {
      portfolio: 'As a portfolio advisor, provide 2-3 actionable suggestions to improve this portfolio.',
      project: 'As a technical advisor, provide improvement suggestions for this project description.',
      code: 'As a code reviewer, provide constructive feedback on this code.',
      general: 'Provide helpful suggestions based on this context.',
    };

    const prompt = prompts[type] || prompts.general;
    const response: any = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: context },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (error: any) {
    console.error('Insights error:', error?.message || String(error));
    return res.status(500).json({ error: error?.message || 'Failed to get insights' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(OPENROUTER_API_KEY), model: OPENROUTER_MODEL });
});

app.listen(port, () => {
  console.log(`Agent server running on http://localhost:${port}`);
  console.log(`OpenRouter key: ${OPENROUTER_API_KEY ? 'loaded' : 'MISSING'}`);
  console.log(`Model: ${OPENROUTER_MODEL}`);
});
