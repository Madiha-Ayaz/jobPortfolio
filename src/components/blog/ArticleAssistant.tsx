import { useState } from 'react';
import { BlogPost } from '@/lib/data';
import { useTheme } from '@/context/ThemeContext';
import { apiUrl } from '@/utils/api';

interface ArticleAskResponse {
  answer?: string | null;
  available?: boolean;
  error?: string;
  groundedIn?: number;
}

interface ChatItem {
  q: string;
  a: string;
  offline?: boolean;
}

type Status = 'idle' | 'thinking' | 'done' | 'error';

const ArticleAssistant = ({ post }: { post: BlogPost }) => {
  const { t } = useTheme();
  const [input, setInput] = useState('');
  const [items, setItems] = useState<ChatItem[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  const quick = [
    t('post.askExplain'),
    t('post.askSimple'),
    t('post.askExample'),
    t('post.askSummary'),
  ];

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || status === 'thinking') return;

    setInput('');
    setStatus('thinking');
    try {
      const res = await fetch(apiUrl('article/ask'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: post.slug, question: q }),
      });
      const data: ArticleAskResponse = await res.json();
      if (data.available === false) {
        setItems((prev) => [
          ...prev,
          {
            q,
            a: `${t('post.assistantOffline')}\n\n"${post.excerpt}"`,
            offline: true,
          },
        ]);
      } else if (data.answer) {
        const answer: string = data.answer;
        setItems((prev) => [...prev, { q, a: answer }]);
      } else {
        throw new Error(data.error || 'EMPTY');
      }
      setStatus('done');
    } catch {
      setItems((prev) => [
        ...prev,
        {
          q,
          a: `${t('post.assistantOffline')}\n\n"${post.excerpt}"`,
          offline: true,
        },
      ]);
      setStatus('error');
    }
  };

  return (
    <section
      className="aa mt-12 rounded-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(150deg, color-mix(in srgb, var(--accent) 9%, var(--card-bg)) 0%, var(--card-bg) 55%, color-mix(in srgb, var(--brand) 9%, var(--card-bg)) 100%)',
        border: '1px solid color-mix(in srgb, var(--brand) 22%, var(--border-subtle))',
        boxShadow: '0 24px 60px -24px rgba(0,0,0,0.5)',
      }}
    >
      <div className="aa-head px-6 pt-6 pb-4 border-b" style={{ borderColor: 'color-mix(in srgb, var(--brand) 16%, var(--border-subtle))' }}>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="aa-logo w-9 h-9 rounded-xl grid place-items-center text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--brand))', boxShadow: '0 8px 22px color-mix(in srgb, var(--brand) 40%, transparent)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </span>
          <div>
            <h3 className="aa-title text-lg font-extrabold leading-tight" style={{ color: 'var(--text-heading)' }}>
              {t('post.assistantTitle')}
            </h3>
            <p className="aa-sub text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('post.assistantSub')}
            </p>
          </div>
          <span
            className="aa-status ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              color: status === 'thinking' ? 'var(--accent)' : 'var(--brand)',
              background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--brand) 24%, transparent)',
            }}
          >
            <i className="aa-dot" />
            {status === 'thinking' ? 'AI' : 'Nova'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={status === 'thinking'}
              className="aa-chip px-3 py-1.5 text-xs font-semibold rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{
                background: 'color-mix(in srgb, var(--accent) 9%, var(--surface))',
                border: '1px solid color-mix(in srgb, var(--accent) 26%, var(--border-subtle))',
                color: 'var(--accent)',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="aa-body px-6 py-5 min-h-[96px]">
        {items.length === 0 && status !== 'thinking' && (
          <p className="aa-empty text-sm" style={{ color: 'var(--text-dim)' }}>
            {t('post.assistantPlaceholder')}
          </p>
        )}

        {status === 'thinking' && (
          <div className="aa-bubble aa-bubble-ai">
            <span className="aa-loader" />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('post.assistantThinking')}
            </span>
          </div>
        )}

        {items.map((it, i) => (
          <div key={i} className="space-y-2 mb-3">
            <div className="aa-bubble aa-bubble-user">
              {it.q}
            </div>
            <div className="aa-bubble aa-bubble-ai">
              <span className="whitespace-pre-line text-sm" style={{ color: 'var(--text-heading)' }}>
                {it.a}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form
        className="aa-form px-6 pb-6 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('post.assistantPlaceholder')}
            className="aa-input w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/50"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-heading)',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'thinking'}
            className="aa-send shrink-0 inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-xl text-white transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: 'linear-gradient(120deg, var(--brand), var(--accent))', boxShadow: '0 8px 22px color-mix(in srgb, var(--brand) 35%, transparent)' }}
          >
            {t('post.assistantSend')}
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
};

export default ArticleAssistant;