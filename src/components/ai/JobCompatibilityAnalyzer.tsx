import { useState } from 'react';
import { apiUrl } from '@/utils/api';
import { profile } from '@/lib/data';

interface JobMatchResult {
  score: number;
  roleGuess: string | null;
  matchedSkills: { skill: string; confidence: number }[];
  missingSkills: string[];
  summary: string;
  strengths: string[];
  suggestions: string[];
  coverLetter: string;
  candidate?: string;
  aiEnabled?: boolean;
  degraded?: boolean;
}

const KNOWN = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Node.js', 'Python', 'Firebase', 'REST APIs', 'Git & GitHub', 'Figma', 'AI Chatbots', 'Generative AI'];

function clientSideMatch(jd: string): JobMatchResult {
  const lower = jd.toLowerCase();
  const matched = KNOWN.filter((s) => lower.includes(s.toLowerCase()));
  const missing = KNOWN.filter((s) => !lower.includes(s.toLowerCase())).slice(0, 8);
  const score = Math.min(98, Math.round(35 + (matched.length / KNOWN.length) * 60));

  return {
    score,
    roleGuess: null,
    matchedSkills: matched.map((skill) => ({ skill, confidence: 0.8 })),
    missingSkills: missing,
    summary: `Matched ${matched.length} of ${KNOWN.length} known skill areas against the description locally (AI server offline).`,
    strengths: matched.slice(0, 5).map((s) => `Hands-on experience with ${s}.`),
    suggestions: [
      'Share concrete metrics and impact from past projects.',
      'Tie your experience directly to the responsibilities listed here.',
    ],
    coverLetter: `Dear Hiring Team,\n\nI'm ${profile.name}, a frontend developer focused on ${matched.slice(0, 3).join(', ') || 'React and modern web'} — I would love to discuss how I can contribute.`,
    aiEnabled: false,
  };
}

export default function JobCompatibilityAnalyzer() {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!jd.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(apiUrl('/job-match'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      });
      if (!resp.ok) throw new Error('Server unavailable');
      const data = await resp.json();
      if (typeof data.score !== 'number') throw new Error('Invalid result');
      setResult(data);
    } catch {
      setResult(clientSideMatch(jd));
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => (s >= 70 ? '#6ee7b7' : s >= 40 ? '#fcd34d' : '#fca5a5');

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 md:p-8"
      style={{
        background: 'linear-gradient(160deg, rgba(16,185,129,0.08) 0%, rgba(139,92,246,0.06) 50%, #0a0a1e 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
        boxShadow: '0 16px 50px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="absolute -top-px left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #10b981, #8b5cf6, transparent)' }} />

      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#6ee7b7" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-heading">AI Job Compatibility Analyzer</h2>
          <p className="text-xs text-muted">Paste a job description — get an instant fit score from the AI.</p>
        </div>
      </div>

      <div className="mt-5">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={4}
          placeholder="Paste the job description here (e.g. 'Looking for a React developer with TypeScript, Tailwind and AI chatbot experience...')"
          className="w-full px-4 py-3 rounded-xl text-sm bg-[#0d0d24]/70 border border-[#10b981]/25 text-body placeholder-dim focus:outline-none focus:ring-2 focus:ring-[#10b981]/40 transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-dim">Powered by the portfolio AI backend · LLM + keyword hybrid</p>
          <button
            onClick={analyze}
            disabled={loading || !jd.trim()}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-900 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #6ee7b7, #c4b5fd)', boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
          >
            {loading ? 'Analyzing...' : 'Analyze Fit'}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor(result.score)}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 263.9} 263.9`}
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-black" style={{ color: scoreColor(result.score) }}>
                {result.score}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Compatibility Score</p>
              {result.roleGuess && (
                <p className="text-sm font-semibold text-[#6ee7b7] mb-1">Best-fit role: {result.roleGuess}</p>
              )}
              <p className="text-sm text-body leading-relaxed">{result.summary}</p>
              {result.aiEnabled !== false && (
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#6ee7b7]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1.5" />
                  {result.aiEnabled ? 'Rated by AI engine' : 'Smart local match (AI server offline)'}
                </p>
              )}
            </div>
          </div>

          {result.matchedSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedSkills.map((m) => (
                  <span key={m.skill} className="px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                    {m.skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Watch Out For</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.missingSkills.map((s) => (
                  <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {result.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Strengths</h4>
                <ul className="space-y-1.5 text-sm text-body">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#6ee7b7]">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.suggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Suggestions</h4>
                <ul className="space-y-1.5 text-sm text-body">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#fcd34d]">›</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.coverLetter && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">AI-Drafted Cover Letter</h4>
              <div className="p-4 rounded-xl text-sm text-body leading-relaxed whitespace-pre-wrap" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {result.coverLetter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
