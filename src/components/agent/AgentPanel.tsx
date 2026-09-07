import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '../../context/useAgent';
import { useTheme } from '../../context/ThemeContext';
import {
  Send,
  Trash2,
  X,
  Mic,
  Sparkles,
  Navigation,
  ScrollText,
  FolderOpen,
  FileText,
  Highlighter,
  Mail,
  Gauge,
  SunMoon,
  Plus,
  Pencil,
  Trash,
  User,
  AlertTriangle,
  Check,
  ArrowUpRight,
  Search,
} from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/contact': 'Contact',
  '/dashboard': 'Dashboard',
};

const QUICK_ACTIONS = [
  { label: 'Explain this page', icon: Search, action: 'explain this page' },
  { label: 'Find the problem', icon: AlertTriangle, action: 'find a problem with my portfolio' },
  { label: 'Improve this content', icon: Pencil, action: 'help me improve this content' },
  { label: 'Show Projects', icon: FolderOpen, action: 'show me your projects' },
  { label: 'Go to Dashboard', icon: Gauge, action: 'go to dashboard' },
  { label: 'Where am I?', icon: Navigation, action: 'where am i' },
];

const TOOL_META: Record<string, { label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }> = {
  navigate: { label: 'Navigate', icon: Navigation },
  scrollTo: { label: 'Scroll', icon: ScrollText },
  openProject: { label: 'Open project', icon: FolderOpen },
  openBlogPost: { label: 'Open post', icon: FileText },
  highlightElement: { label: 'Highlight', icon: Highlighter },
  openContactForm: { label: 'Contact', icon: Mail },
  openAITools: { label: 'Dashboard', icon: Gauge },
  toggleTheme: { label: 'Theme', icon: SunMoon },
  createProject: { label: 'Create project', icon: Plus },
  updateProject: { label: 'Edit project', icon: Pencil },
  deleteProject: { label: 'Delete project', icon: Trash },
  createBlogPost: { label: 'Create post', icon: Plus },
  updateBlogPost: { label: 'Edit post', icon: Pencil },
  deleteBlogPost: { label: 'Delete post', icon: Trash },
  updateProfile: { label: 'Update profile', icon: User },
};

/* ── tiny safe markdown renderer (no dangerouslySetInnerHTML) ─────────── */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={key++} className="px-1.5 py-0.5 rounded text-[12px]"
          style={{ background: 'var(--surface-hover)', color: 'var(--accent-light)', fontFamily: 'monospace' }}>
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderMarkdown(text: string): ReactNode {
  const blocks: ReactNode[] = [];
  const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
  const parts: { type: 'code'; lang: string; code: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'code', lang: '', code: text.slice(lastIndex, match.index) });
    parts.push({ type: 'code', lang: match[1], code: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: 'code', lang: '', code: text.slice(lastIndex) });

  let key = 0;
  for (const part of parts) {
    if (part.type === 'code') {
      blocks.push(
        <pre key={key++} className="rounded-lg p-3 my-2 text-[12px] overflow-x-auto"
          style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-body)', whiteSpace: 'pre-wrap' }}>
          <code>{part.code.trim()}</code>
        </pre>,
      );
      continue;
    }
    const lines = part.code.split('\n');
    let para: string[] = [];
    const flush = () => {
      if (para.length) {
        blocks.push(<p key={key++} className="leading-relaxed whitespace-pre-wrap break-words">{renderInline(para.join('\n'))}</p>);
        para = [];
      }
    };
    const list: ReactNode[] = [];
    let inList = false;
    const flushList = () => {
      if (inList) {
        blocks.push(
          <ul key={key++} className="list-disc pl-4 my-1 space-y-0.5">
            {list}
          </ul>,
        );
        list.length = 0;
        inList = false;
      }
    };
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[-*•]\s+/.test(trimmed)) {
        flush();
        flushList();
        inList = true;
        list.push(<li key={key++} className="text-[13px]" style={{ color: 'var(--text-body)' }}>{renderInline(trimmed.replace(/^[-*•]\s+/, ''))}</li>);
      } else {
        flushList();
        para.push(line);
      }
    }
    flushList();
    flush();
  }
  return <>{blocks}</>;
}

function AgentPanel() {
  const {
    messages,
    sendMessage,
    isThinking,
    toggleListening,
    isListening,
    currentLocation,
    setIsOpen,
    setIsVisible,
    clearMessages,
    pendingAction,
    isConfirming,
    confirmAction,
    cancelAction,
  } = useAgent();
  const { t } = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const PAGE_NAMES: Record<string, string> = {
    '/': t('nav.home'),
    '/about': t('nav.about'),
    '/projects': t('nav.projects'),
    '/blog': t('nav.blog'),
    '/contact': t('nav.contact'),
    '/dashboard': t('nav.dashboard'),
  };

  const QUICK_ACTIONS = [
    { label: t('agent.explainPage'), icon: Search, action: 'explain this page' },
    { label: t('agent.findProblem'), icon: AlertTriangle, action: 'find a problem with my portfolio' },
    { label: t('agent.improveContent'), icon: Pencil, action: 'help me improve this content' },
    { label: t('agent.showProjects'), icon: FolderOpen, action: 'show me your projects' },
    { label: t('agent.goDashboard'), icon: Gauge, action: 'go to dashboard' },
    { label: t('agent.whereAmI'), icon: Navigation, action: 'where am i' },
  ];

  const pageName = PAGE_NAMES[currentLocation] || currentLocation;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, pendingAction]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className="fixed bottom-28 right-4 sm:right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100dvh-8rem)] rounded-2xl border shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
      style={{
        background: 'var(--modal-bg)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--card-shadow)',
      }}
      role="dialog"
      aria-label="Portfolio AI assistant"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border-subtle)', background: 'color-mix(in srgb, var(--brand) 10%, transparent)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: 'var(--chat-user-bg)', boxShadow: '0 0 18px color-mix(in srgb, var(--brand) 40%, transparent)' }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{t('agent.title')}</h3>
            <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
              On: {pageName}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={clearMessages} title={t('agent.clearChat')} aria-label={t('agent.clearChat')}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" style={{ color: 'var(--text-dim)' }}>
            <Trash2 size={14} />
          </button>
          <button onClick={() => setIsVisible(false)} title="Hide agent" aria-label="Hide agent"
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" style={{ color: 'var(--text-dim)' }}>
            <X size={14} />
          </button>
          <button onClick={() => setIsOpen(false)} title="Close chat" aria-label="Close chat"
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" style={{ color: 'var(--text-dim)' }}>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm'}`}
              style={
                msg.role === 'user'
                  ? { background: 'var(--chat-user-bg)', color: '#fff' }
                  : { background: 'var(--chat-agent-bg)', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' }
              }
            >
              <div className="whitespace-pre-wrap break-words">{renderMarkdown(msg.text)}</div>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t flex flex-wrap gap-1" style={{ borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)' }}>
                  {msg.toolCalls.map((tc, i) => {
                    const meta = TOOL_META[tc.name];
                    const Icon = meta?.icon || Sparkles;
                    return (
                      <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--brand) 14%, transparent)',
                          color: msg.role === 'user' ? '#fff' : 'var(--brand-light)',
                        }}>
                        <Icon size={10} />
                        {meta?.label || tc.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5"
              style={{ background: 'var(--chat-agent-bg)', border: '1px solid var(--border-subtle)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--brand)', animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--brand)', animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--brand)', animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Confirmation card */}
        <AnimatePresence>
          {pendingAction && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl border p-3.5"
              style={{ background: 'var(--card-bg)', borderColor: 'color-mix(in srgb, var(--warning) 45%, transparent)' }}
              role="alert"
              aria-label="Pending action confirmation"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={15} style={{ color: 'var(--warning)' }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--warning)' }}>
                  {t('agent.confirmAction')}
                </span>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-body)' }}>{pendingAction.summary}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={confirmAction}
                  disabled={isConfirming}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'var(--chat-user-bg)', boxShadow: '0 6px 16px color-mix(in srgb, var(--brand) 30%, transparent)' }}
                >
                  <Check size={13} /> {isConfirming ? t('agent.applying') : t('agent.yesApply')}
                </button>
                <button
                  onClick={cancelAction}
                  disabled={isConfirming}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                >
                  {t('agent.cancel')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="px-3 py-2 border-t flex gap-2 overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--border-subtle)' }}>
        {QUICK_ACTIONS.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              onClick={() => sendMessage(qa.action)}
              disabled={isThinking}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors disabled:opacity-50 hover:-translate-y-0.5"
              style={{ background: 'var(--surface)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
            >
              <Icon size={12} />
              {qa.label}
            </button>
          );
        })}
      </div>

      {/* Composer */}
      <div className="p-3 border-t flex gap-2 items-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface)' }}>
        <button
          onClick={toggleListening}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
          style={{
            background: isListening ? 'var(--danger)' : 'var(--surface-hover)',
            color: isListening ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${isListening ? 'transparent' : 'var(--border-default)'}`,
          }}
          title={isListening ? 'Stop listening' : 'Voice input'}
          aria-label={isListening ? 'Stop voice input' : 'Voice input'}
        >
          <Mic size={15} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('agent.placeholder')}
          disabled={isThinking}
          aria-label="Message the assistant"
          className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 disabled:opacity-50 input"
          style={{ borderColor: 'var(--input-border)' }}
        />
        <button
          onClick={handleSend}
          disabled={isThinking || !input.trim()}
          className="w-9 h-9 rounded-full text-white flex items-center justify-center disabled:opacity-40 transition-transform hover:scale-105 flex-shrink-0"
          style={{ background: 'var(--chat-user-bg)', boxShadow: '0 6px 16px color-mix(in srgb, var(--brand) 30%, transparent)' }}
          title="Send"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default AgentPanel;