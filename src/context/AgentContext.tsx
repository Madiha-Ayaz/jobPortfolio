import { createContext, useState, useCallback, ReactNode, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiUrl } from '@/utils/api';

export type AgentTool =
  | { name: 'navigate'; args: { path: string } }
  | { name: 'scrollTo'; args: { sectionId: string } }
  | { name: 'openProject'; args: { projectName: string } }
  | { name: 'openBlogPost'; args: { slug: string } }
  | { name: 'highlightElement'; args: { selector: string } }
  | { name: 'openContactForm'; args: Record<string, never> }
  | { name: 'toggleTheme'; args: Record<string, never> };

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  toolCalls?: AgentTool[];
  timestamp: number;
}

interface AgentContextType {
  messages: AgentMessage[];
  isOpen: boolean;
  isThinking: boolean;
  isListening: boolean;
  isVisible: boolean;
  currentLocation: string;
  setIsOpen: (v: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  toggleListening: () => void;
  clearMessages: () => void;
  setIsVisible: (v: boolean) => void;
  executeTool: (tool: AgentTool) => Promise<string>;
}

const WELCOME_MSG: AgentMessage = {
  id: '0',
  role: 'agent',
  text: "Hi! I'm your portfolio agent. I can navigate you around, open projects, read blog posts, and answer questions. Try: 'show me your projects' or 'go to contact'.",
  timestamp: Date.now(),
};

const localAgentResponse = (input: string, currentPath: string): string => {
  const lower = input.toLowerCase().trim();
  if (/(go\s*to|open|show|navigate).*(home|main|landing)/i.test(lower)) return "Taking you home! [[navigate:/]]";
  if (/(go\s*to|open|show).*(about|who)/i.test(lower)) return "Here's about me! [[navigate:/about]]";
  if (/(go\s*to|open|show).*(project|work|portfolio)/i.test(lower)) return "Here are my projects! [[navigate:/projects]]";
  if (/(go\s*to|open|show).*(blog|article|post)/i.test(lower)) return "Reading my blog? [[navigate:/blog]]";
  if (/(go\s*to|open|show).*(contact|hire|email|message)/i.test(lower)) return "Let's get in touch! [[navigate:/contact]]";
  if (/(go\s*to|open).*(login|sign\s*in)/i.test(lower)) return "Opening login. [[navigate:/auth/login]]";
  if (/scroll.*(top|hero|home)/i.test(lower)) return 'Scrolling to top! [[scrollTo:hero]]';
  if (/(toggle|switch).*(theme|dark|mode)/i.test(lower)) return 'Toggling theme! [[toggleTheme]]';
  if (/what.*(do|can).*(do|help)/i.test(lower)) return "I can navigate you around, open projects, scroll to sections, toggle dark mode, and answer questions.";
  if (/(who|your name)/i.test(lower)) return "I'm your portfolio agent - I live in every page and help you explore.";
  if (/(where|which page|am i)/i.test(lower)) return `You're currently on: ${currentPath}. Want me to take you somewhere?`;
  if (/thank/i.test(lower)) return "You're welcome!";
  if (/(hello|hi|hey)/i.test(lower)) return "Hey! Say 'show projects' or 'go to about' to get started.";
  return `Try: \"show projects\", \"go to about\", \"open contact\", or \"toggle theme\". You're on ${currentPath}.`;
};

const parseToolCalls = (text: string): { cleanText: string; tools: AgentTool[] } => {
  const tools: AgentTool[] = [];
  let cleanText = text;
  const toolRegex = /\[\[(\w+)(?::([^\]]+))?\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = toolRegex.exec(text)) !== null) {
    const name = match[1] as AgentTool['name'];
    const argStr = match[2] || '';
    if (name === 'navigate') tools.push({ name, args: { path: argStr } });
    else if (name === 'scrollTo') tools.push({ name, args: { sectionId: argStr } });
    else if (name === 'openProject') tools.push({ name, args: { projectName: argStr } });
    else if (name === 'openBlogPost') tools.push({ name, args: { slug: argStr } });
    else if (name === 'highlightElement') tools.push({ name, args: { selector: argStr } });
    else if (name === 'openContactForm') tools.push({ name, args: {} });
    else if (name === 'toggleTheme') tools.push({ name, args: {} });
    cleanText = cleanText.replace(match[0], '').trim();
  }
  return { cleanText, tools };
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

interface AgentProviderProps {
  children: ReactNode;
}

export { AgentContext };

export function AgentProvider({ children }: AgentProviderProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME_MSG]);
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef<any>(null);

  const executeTool = useCallback(
    async (tool: AgentTool): Promise<string> => {
      switch (tool.name) {
        case 'navigate':
          navigate(tool.args.path);
          return `Navigated to ${tool.args.path}`;
        case 'scrollTo': {
          const el = document.getElementById(tool.args.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return `Scrolled to ${tool.args.sectionId}`;
          }
          return `Section not found`;
        }
        case 'openProject':
          navigate('/projects');
          return `Opening project: ${tool.args.projectName}`;
        case 'openBlogPost':
          navigate(`/blog/${tool.args.slug}`);
          return `Opening blog post`;
        case 'highlightElement': {
          const el = document.querySelector(tool.args.selector);
          if (el) {
            (el as HTMLElement).style.transition = 'all 0.3s';
            (el as HTMLElement).style.boxShadow = '0 0 30px #8b5cf6';
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
        case 'toggleTheme':
          document.documentElement.classList.toggle('dark');
          return 'Toggled theme';
        default:
          return 'Done';
      }
    },
    [navigate]
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

      // Build the message history to send to the server
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'agent')
        .slice(-10) // keep last 10 for context
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
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
          ? data.toolCalls.map((tc: any) => ({
              name: tc.name,
              args: tc.args || {},
            }))
          : [];

        // Execute any tool calls the AI decided to make
        for (const tool of toolCalls) {
          await executeTool(tool as AgentTool);
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
        // Friendly fallback if server is offline or key missing
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
    [messages, location.pathname, executeTool]
  );

  const toggleListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice not supported in this browser. Try Chrome!');
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
  }, [isListening, sendMessage]);

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
        setIsOpen,
        sendMessage,
        toggleListening,
        clearMessages,
        setIsVisible,
        executeTool,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
