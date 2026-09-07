import { createContext, useState, useCallback, ReactNode, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiUrl } from '@/utils/api';
import { useNotification } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { trackChat } from '@/utils/analytics';

export interface AgentToolArgs {
  path?: string;
  sectionId?: string;
  projectName?: string;
  slug?: string;
  selector?: string;
  id?: number;
  title?: string;
  description?: string;
  tags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  content?: string;
  excerpt?: string;
  name?: string;
  role?: string;
  tagline?: string;
  bio?: string;
  location?: string;
  email?: string;
}

export type AgentToolName =
  | 'navigate'
  | 'scrollTo'
  | 'openProject'
  | 'openBlogPost'
  | 'highlightElement'
  | 'openContactForm'
  | 'openAITools'
  | 'toggleTheme'
  | 'createProject'
  | 'updateProject'
  | 'deleteProject'
  | 'createBlogPost'
  | 'updateBlogPost'
  | 'deleteBlogPost'
  | 'updateProfile';

export interface AgentTool {
  name: AgentToolName;
  args: AgentToolArgs;
}

/** Tools that change portfolio content — always gated behind confirmation. */
export const MUTATION_TOOLS: AgentToolName[] = [
  'createProject',
  'updateProject',
  'deleteProject',
  'createBlogPost',
  'updateBlogPost',
  'deleteBlogPost',
  'updateProfile',
];

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  toolCalls?: AgentTool[];
  timestamp: number;
}

export interface PendingAction {
  id: string;
  tool: AgentTool;
  summary: string;
}

interface AgentContextType {
  messages: AgentMessage[];
  isOpen: boolean;
  isThinking: boolean;
  isListening: boolean;
  isVisible: boolean;
  currentLocation: string;
  pendingAction: PendingAction | null;
  isConfirming: boolean;
  setIsOpen: (v: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  toggleListening: () => void;
  clearMessages: () => void;
  setIsVisible: (v: boolean) => void;
  executeTool: (tool: AgentTool) => Promise<string>;
  confirmAction: () => Promise<void>;
  cancelAction: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const WELCOME_MSG: AgentMessage = {
  id: '0',
  role: 'agent',
  text: "Hi! I'm Nova, your portfolio assistant. I can navigate you around, answer questions about the portfolio, and help you improve your content — I'll always ask before changing anything. Try: 'show me your projects', 'make this project description more professional', or 'what's on this page?'",
  timestamp: Date.now(),
};

const localAgentResponse = (input: string, currentPath: string): string => {
  const lower = input.toLowerCase().trim();
  if (/(go\s*to|open|show|navigate).*(home|main|landing)/i.test(lower)) return "Taking you home! [[navigate:/]]";
  if (/(go\s*to|open|show).*(about|who)/i.test(lower)) return "Here's about me! [[navigate:/about]]";
  if (/(go\s*to|open|show).*(project|work|portfolio)/i.test(lower)) return "Here are my projects! [[navigate:/projects]]";
  if (/(go\s*to|open|show).*(blog|article|post)/i.test(lower)) return "Reading my blog? [[navigate:/blog]]";
  if (/(go\s*to|open|show).*(contact|hire|email|message)/i.test(lower)) return "Let's get in touch! [[navigate:/contact]]";
  if (/(dashboard|admin|stats)/i.test(lower)) return "Opening your dashboard. [[navigate:/dashboard]]";
  if (/(toggle|switch).*(theme|dark|mode)/i.test(lower)) return 'Toggling theme! [[toggleTheme]]';
  if (/(where|which page|am i)/i.test(lower)) return `You're currently on: ${currentPath}. Want me to take you somewhere?`;
  if (/(hello|hi|hey)/i.test(lower)) return "Hey! Say 'show projects' or 'go to about' to get started. I can also improve your content — just ask.";
  return `Try: \"show projects\", \"go to about\", \"open contact\", \"go to dashboard\", or \"toggle theme\". You're on ${currentPath}.`;
};

const parseToolCalls = (text: string): { cleanText: string; tools: AgentTool[] } => {
  const tools: AgentTool[] = [];
  let cleanText = text;
  const toolRegex = /\[\[(\w+)(?::([^\]]+))?\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = toolRegex.exec(text)) !== null) {
    const name = match[1] as AgentToolName;
    const argStr = match[2] || '';
    const args: AgentToolArgs = {};
    switch (name) {
      case 'navigate': args.path = argStr; break;
      case 'scrollTo': args.sectionId = argStr; break;
      case 'openProject': args.projectName = argStr; break;
      case 'openBlogPost': args.slug = argStr; break;
      case 'highlightElement': args.selector = argStr; break;
      default: break;
    }
    tools.push({ name, args } as AgentTool);
    cleanText = cleanText.replace(match[0], '').trim();
  }
  return { cleanText, tools };
};

export { AgentContext };

export function AgentProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME_MSG]);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef<any>(null);
  const { notify } = useNotification();
  const { theme, setTheme } = useTheme();

  /** Describe what a tool would do, for the confirmation prompt. */
  const describeTool = (tool: AgentTool): string => {
    const a = tool.args;
    switch (tool.name) {
      case 'createProject':
        return `Create a new project titled "${a.title || 'Untitled'}".`;
      case 'updateProject':
        return `Update project ${a.id ?? ''}${a.title ? ` ("${a.title}")` : ''} with the AI-improved content.`;
      case 'deleteProject':
        return `Delete project ${a.id ?? ''} permanently. This cannot be undone.`;
      case 'createBlogPost':
        return `Publish a new blog post titled "${a.title || 'Untitled'}".`;
      case 'updateBlogPost':
        return `Update blog post ${a.id ?? ''}${a.title ? ` ("${a.title}")` : ''} with the AI-improved content.`;
      case 'deleteBlogPost':
        return `Delete blog post ${a.id ?? ''} permanently. This cannot be undone.`;
      case 'updateProfile':
        return `Update your profile information (${Object.keys(a).filter((k) => k in a).length} field(s)).`;
      default:
        return `Perform action ${tool.name}.`;
    }
  };

  const executeContentTool = useCallback(
    async (tool: AgentTool): Promise<string> => {
      const a = tool.args;
      const headers = { 'Content-Type': 'application/json' };
      const raw = {
        title: a.title,
        description: a.description,
        tags: a.tags,
        liveUrl: a.liveUrl,
        repoUrl: a.repoUrl,
        imageUrl: a.imageUrl,
        content: a.content,
        excerpt: a.excerpt,
        name: a.name,
        role: a.role,
        tagline: a.tagline,
        bio: a.bio,
        location: a.location,
        email: a.email,
      };
      const clean = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== undefined && v !== ''));
      let path = '';
      let method = 'POST';
      switch (tool.name) {
        case 'createProject': path = '/content/projects'; break;
        case 'updateProject': path = `/content/projects/${a.id}`; method = 'PATCH'; break;
        case 'deleteProject': path = `/content/projects/${a.id}`; method = 'DELETE'; break;
        case 'createBlogPost': path = '/content/blogs'; break;
        case 'updateBlogPost': path = `/content/blogs/${a.id}`; method = 'PATCH'; break;
        case 'deleteBlogPost': path = `/content/blogs/${a.id}`; method = 'DELETE'; break;
        case 'updateProfile': path = '/content/profile'; method = 'PATCH'; break;
        default: return 'Unknown action.';
      }
      const resp = await fetch(apiUrl(path), {
        method,
        headers,
        body: method === 'DELETE' ? undefined : JSON.stringify(clean),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data?.error || `Request failed (${resp.status})`);
      }
      window.dispatchEvent(new CustomEvent('portfolio:changed'));
      return `${describeTool(tool)} Done. Your portfolio has been updated.`;
    },
    [describeTool],
  );

  const executeTool = useCallback(
    async (tool: AgentTool): Promise<string> => {
      switch (tool.name) {
        case 'navigate':
          navigate(tool.args.path || '/');
          return `Navigated to ${tool.args.path}`;
        case 'scrollTo': {
          const el = document.getElementById(tool.args.sectionId || '');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return `Scrolled to ${tool.args.sectionId}`;
          }
          return 'Section not found';
        }
        case 'openProject':
          navigate('/projects');
          return `Opening projects page`;
        case 'openBlogPost':
          navigate(`/blog/${tool.args.slug || ''}`);
          return 'Opening blog post';
        case 'highlightElement': {
          const el = document.querySelector(tool.args.selector || '');
          if (el) {
            (el as HTMLElement).style.transition = 'all 0.3s';
            (el as HTMLElement).style.boxShadow = '0 0 30px var(--brand)';
            setTimeout(() => {
              (el as HTMLElement).style.boxShadow = '';
            }, 2000);
            return 'Highlighted';
          }
          return 'Element not found';
        }
        case 'openContactForm':
          navigate('/contact');
          return 'Opening contact form';
        case 'openAITools':
          navigate('/dashboard');
          return 'Opening dashboard';
        case 'toggleTheme': {
          const next = theme === 'light' ? 'dark' : 'light';
          setTheme(next);
          return `Theme set to ${next}`;
        }
        default:
          return executeContentTool(tool);
      }
    },
    [navigate, theme, setTheme, executeContentTool],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userMsg: AgentMessage = {
        id: Date.now().toString(),
        role: 'user',
        text,
        timestamp: Date.now(),
      };
      setMessages((m) => [...m, userMsg]);
      setIsThinking(true);

      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'agent')
        .slice(-10)
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        }));

      try {
        const resp = await fetch(apiUrl('/agent'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...history, { role: 'user', content: text }],
            currentPath: location.pathname,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || `Server error ${resp.status}`);
        }

        const data = await resp.json();
        const reply: string = data.reply || '';
        const toolCalls: AgentTool[] = Array.isArray(data.toolCalls)
          ? data.toolCalls
              .filter((tc: any) => tc && typeof tc.name === 'string')
              .map((tc: any) => ({ name: tc.name, args: tc.args || {} }))
          : [];

        const navTools = toolCalls.filter((t) => !MUTATION_TOOLS.includes(t.name));
        const contentTools = toolCalls.filter((t) => MUTATION_TOOLS.includes(t.name));

        // Safe navigation tools run immediately.
        for (const tool of navTools) {
          await executeTool(tool);
        }

        if (contentTools.length > 0) {
          const first = contentTools[0];
          const summary = describeTool(first);
          setPendingAction({ id: Date.now().toString(), tool: first, summary });
          setMessages((m) => [
            ...m,
            {
              id: (Date.now() + 1).toString(),
              role: 'agent',
              text: `${reply}\n\nI need your confirmation: ${summary}`,
              toolCalls: toolCalls,
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            text: reply,
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
            timestamp: Date.now(),
          },
        ]);
      } catch (e: any) {
        const fallback = localAgentResponse(text, location.pathname);
        const { cleanText, tools } = parseToolCalls(fallback);
        for (const tool of tools) {
          await executeTool(tool);
        }
        const offlineMsg =
          e?.message?.includes('OPENROUTER_API_KEY')
            ? '🔑 OpenRouter API key not configured. Using local fallback mode.'
            : e?.message?.includes('Failed to fetch')
            ? '📡 Agent server offline. Using local fallback mode.'
            : `⚠️ ${e?.message || 'Something went wrong'}. Using local fallback.`;

        // Persist fallback exchange to Neon too.
        trackChat('user', text, location.pathname);
        trackChat('assistant', cleanText || offlineMsg, location.pathname);

        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            text: cleanText || offlineMsg,
            toolCalls: tools.length > 0 ? tools : undefined,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, location.pathname, executeTool, describeTool],
  );

  const confirmAction = useCallback(async () => {
    if (!pendingAction || isConfirming) return;
    setIsConfirming(true);
    try {
      const result = await executeTool(pendingAction.tool);
      notify('ai', 'AI action completed', pendingAction.summary, { important: pendingAction.tool.name.startsWith('delete') });
      setMessages((m) => [
        ...m,
        { id: Date.now().toString(), role: 'agent', text: `✅ ${result}`, timestamp: Date.now() },
      ]);
      setPendingAction(null);
    } catch (e: any) {
      notify('error', 'AI action failed', e?.message || 'Something went wrong');
      setMessages((m) => [
        ...m,
        { id: Date.now().toString(), role: 'agent', text: `⚠️ Action failed: ${e?.message || 'Something went wrong'}`, timestamp: Date.now() },
      ]);
    } finally {
      setIsConfirming(false);
    }
  }, [pendingAction, isConfirming, executeTool, notify]);

  const cancelAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  const toggleListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toastWarning();
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [isListening, sendMessage, notify]);

  const toastWarning = useCallback(() => {
    notify('warning', 'Voice input not supported', 'Try Chrome or Edge for dictation.');
  }, [notify]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'new-' + Date.now(),
        role: 'agent',
        text: 'Chat cleared. How can I help?',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return (
    <AgentContext.Provider
      value={{
        messages,
        isOpen,
        isThinking,
        isListening,
        isVisible,
        currentLocation: location.pathname,
        pendingAction,
        isConfirming,
        setIsOpen,
        sendMessage,
        toggleListening,
        clearMessages,
        setIsVisible,
        executeTool,
        confirmAction,
        cancelAction,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}