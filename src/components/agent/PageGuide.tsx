import { useEffect, useRef, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Info, Lightbulb, AlertTriangle, Sparkles, X } from 'lucide-react';
import { useAgent } from '@/context/useAgent';

type GuideType = 'info' | 'tip' | 'alert';

export interface PageGuideMessage {
  id: string;
  title: string;
  message: ReactNode;
  type: GuideType;
  /** If true, this guide is dismissible per-session (defaults to true). */
  dismissible?: boolean;
}

interface PageGuideEntry {
  title: string;
  message: string;
  type: GuideType;
}

const PAGE_GUIDES: Record<string, PageGuideEntry> = {
  '/': {
    title: 'Home',
    message:
      "This is your home page — a living showcase of you. The hero, featured projects and AI network all come from your portfolio data. Heading to the dashboard shows you what could be improved.",
    type: 'tip',
  },
  '/projects': {
    title: 'Projects',
    message:
      "You're on the Projects page. You can add, edit, organise and showcase your projects here — just ask Nova to create or improve one, and it will preview changes before saving.",
    type: 'tip',
  },
  '/blog': {
    title: 'Blog',
    message:
      "You're on the Blog page. You can publish professional articles, filter by category and search posts. Ask Nova to help write or polish an article.",
    type: 'tip',
  },
  '/contact': {
    title: 'Contact',
    message:
      'This is your contact page. Messages visitors send land in your Firestore `contacts` inbox. Nova can even help draft a reply.',
    type: 'tip',
  },
  '/dashboard': {
    title: 'Dashboard',
    message:
      'You are viewing your portfolio dashboard. Here you can monitor content health, project counts, skill coverage and AI availability — all from real portfolio data.',
    type: 'tip',
  },
  '/about': {
    title: 'About',
    message:
      "This is your About page, built from your profile, skills and certifications. Ask Nova to refresh the wording or validate the information.",
    type: 'tip',
  },
};

/** Fire a one-off contextual alert that shows in the guide card. */
export function triggerPageGuidance(payload: Omit<PageGuideMessage, 'id'>) {
  window.dispatchEvent(
    new CustomEvent<PageGuideMessage>('nova:guide', {
      detail: { ...payload, id: `alert-${Date.now()}` },
    }),
  );
}

const TYPE_ICON: Record<GuideType, React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>> = {
  info: Info,
  tip: Lightbulb,
  alert: AlertTriangle,
};

const TYPE_COLOR: Record<GuideType, string> = {
  info: 'var(--accent)',
  tip: 'var(--brand)',
  alert: 'var(--danger)',
};

const CARD: Record<string, string> = {
  '/': 'Useful tip',
  '/projects': 'Projects tip',
  '/blog': 'Blog tip',
  '/contact': 'Contact tip',
  '/dashboard': 'Dashboard tip',
  '/about': 'About tip',
};

export default function PageGuide() {
  const location = useLocation();
  const { setIsOpen } = useAgent();
  const [active, setActive] = useState<PageGuideMessage | null>(null);
  const [sessionDismissed, setSessionDismissed] = useState<Record<string, boolean>>({});
  const lastPathRef = useRef<string>('');

  // Show a contextual tip when entering a new page (once per session per path).
  useEffect(() => {
    const path = location.pathname;
    if (path === lastPathRef.current) return;
    lastPathRef.current = path;
    const entry = PAGE_GUIDES[path];
    if (!entry) return;
    if (sessionDismissed[path]) return;
    const t = window.setTimeout(() => {
      setActive({
        id: `guide-${path}`,
        title: entry.title,
        message: entry.message,
        type: entry.type,
        dismissible: true,
      });
    }, 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Listen for manual alerts from pages / AI.
  useEffect(() => {
    const onGuide = (e: Event) => {
      const detail = (e as CustomEvent<PageGuideMessage>).detail;
      if (!detail?.message) return;
      setActive(detail);
    };
    window.addEventListener('nova:guide', onGuide);
    return () => window.removeEventListener('nova:guide', onGuide);
  }, []);

  const dismiss = () => {
    if (active) {
      setSessionDismissed((prev) => ({ ...prev, [active.id]: true }));
      setActive(null);
    }
  };

  const askNova = () => {
    setActive(null);
    setIsOpen(true);
  };

  const ActiveTypeIcon = active ? TYPE_ICON[active.type] : Info;

  return (
    <div aria-live="polite" className="fixed bottom-6 left-4 sm:left-6 z-[60] max-w-[340px] w-full">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden"
            style={{
              background: 'var(--modal-bg)',
              borderColor: 'color-mix(in srgb, var(--brand) 30%, var(--border-default))',
              boxShadow: 'var(--card-shadow)',
            }}
            role="status"
          >
            <div className="flex gap-3 p-4">
              <div
                className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border-subtle)',
                  color: active.type === 'alert' ? 'var(--danger)' : active.type === 'tip' ? 'var(--brand)' : 'var(--accent)',
                }}
              >
                <ActiveTypeIcon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  {CARD[location.pathname] || 'Nova'}
                </p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text-heading)' }}>
                  {active.title}
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {active.message}
                </p>
              </div>
              <button
                onClick={dismiss}
                className="p-1 rounded-md self-start transition-colors shrink-0"
                style={{ color: 'var(--text-dim)' }}
                aria-label="Dismiss guidance"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-4 pb-3">
              <button
                onClick={askNova}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--chat-user-bg)', boxShadow: '0 6px 16px color-mix(in srgb, var(--brand) 30%, transparent)' }}
              >
                <Sparkles size={12} />
                Ask Nova about this page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}