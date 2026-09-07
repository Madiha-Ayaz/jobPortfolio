import { useState } from 'react';
import { projects as allProjects } from '@/lib/data';
import { apiUrl } from '@/utils/api';
import { trackFinder, trackProjectView } from '@/utils/analytics';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  score: number;
  reason: string;
}

function clientSideRank(query: string): Recommendation[] {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  const aiIntent = /\b(ai|agent|machine learning|genai|generative|llm|chatbot|hackathon)\b/.test(q);

  const scored = allProjects
    .map((p) => {
      const text = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
      let score = 0;
      for (const term of terms) if (text.includes(term)) score += 2;
      for (const tag of p.tags) if (q.includes(tag.toLowerCase())) score += 3;
      if (aiIntent && /\b(ai|agent|hackathon|bank|intelligence)\b/.test(text)) score += 3;
      return { ...p, score: Math.min(100, Math.round(score * 10)) };
    })
    .sort((a, b) => b.score - a.score);

  return scored.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags,
    imageUrl: p.imageUrl,
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    score: p.score,
    reason:
      p.score > 0
        ? `Relevant to "${query.trim()}" — ${p.tags.join(', ')}.`
        : 'Worth a look from the full collection.',
  }));
}

export default function AIProjectRecommender() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const runRecommend = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setStatus(null);

    try {
      const resp = await fetch(apiUrl('/recommend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) throw new Error('Server unavailable');
      const data = await resp.json();
      if (!Array.isArray(data.matches) || data.matches.length === 0) throw new Error('Empty result');
      setResults(data.matches);
      setStatus(data.aiEnabled ? 'Rated by AI engine' : 'Smart keyword match (AI server offline)');
      trackFinder(query, data.matches);
    } catch {
      const local = clientSideRank(query);
      setResults(local);
      setStatus('Smart local match (AI server offline)');
      trackFinder(query, local);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 md:p-8"
      style={{
        background: 'linear-gradient(160deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.06) 50%, #0a0a1e 100%)',
        border: '1px solid rgba(6,182,212,0.2)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="absolute -top-px left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, transparent)' }} />

      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#67e8f9" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black text-heading">AI Project Finder</h2>
          <p className="text-xs text-muted">Tell it what you want to see — AI ranks every project for you.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runRecommend()}
          placeholder="e.g. AI projects, hackathon, React, banking app..."
          className="flex-1 px-4 py-3 rounded-xl text-sm bg-[#0d0d24]/70 border border-[#06b6d4]/25 text-body placeholder-dim focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/40 transition-all"
        />
        <button
          onClick={runRecommend}
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-xl text-sm font-bold text-slate-900 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, #67e8f9, #c4b5fd)', boxShadow: '0 8px 30px rgba(6,182,212,0.25)' }}
        >
          {loading ? 'Ranking...' : 'Recommend'}
        </button>
      </div>

      {status && (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#67e8f9' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1.5" />
          {status}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-5 space-y-4">
          {results.slice(0, 3).map((rec, i) => (
            <a
              key={rec.id}
              href={rec.liveUrl !== '#' ? rec.liveUrl : rec.repoUrl !== '#' ? rec.repoUrl : undefined}
              target={rec.liveUrl !== '#' || rec.repoUrl !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={() => trackProjectView(rec.title, rec.id, 'finder')}
              className="block group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-slate-900"
                    style={{ background: i === 0 ? '#67e8f9' : i === 1 ? '#c4b5fd' : '#f9a8d4' }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-body group-hover:text-[#c4b5fd] transition-colors">
                    {rec.title}
                  </h3>
                </div>
                <span className="text-sm font-black" style={{ color: rec.score >= 70 ? '#6ee7b7' : rec.score >= 40 ? '#fcd34d' : '#fca5a5' }}>
                  {rec.score}%
                </span>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${rec.score}%`,
                    background: `linear-gradient(90deg, ${rec.score >= 70 ? '#10b981' : rec.score >= 40 ? '#f59e0b' : '#ef4444'}, ${i === 0 ? '#67e8f9' : '#c4b5fd'})`,
                  }}
                />
              </div>

              <p className="text-body text-xs leading-relaxed mb-2">{rec.reason}</p>
              <div className="flex flex-wrap gap-1.5">
                {rec.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.25)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
