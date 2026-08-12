import { Link } from 'react-router-dom';

interface AIFeature {
  title: string;
  description: string;
  badge: string;
  icon: string;
  color: string;
  accent: string;
  path?: string;
  isLive: boolean;
}

const FEATURES: AIFeature[] = [
  {
    title: 'Nova AI Assistant',
    description:
      'A grounded agentic chatbot that answers questions about the portfolio, navigates pages, opens projects, reads blog posts, toggles the theme, and even listens to voice commands.',
    badge: 'Agentic Chatbot',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
    color: '#8b5cf6',
    accent: '#c4b5fd',
    isLive: true,
  },
  {
    title: 'AI Semantic Search',
    description:
      'Natural-language search over every project, skill and blog post. Type "AI projects" or "hackathon work" and the engine understands intent, not just keywords.',
    badge: 'Semantic Search',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    color: '#06b6d4',
    accent: '#67e8f9',
    path: '/projects',
    isLive: true,
  },
  {
    title: 'Job Compatibility Analyzer',
    description:
      'Recruiters paste any job description and get an instant AI compatibility score, matched skills, missing skills and a tailored cover-letter opening.',
    badge: 'Career Intelligence',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    color: '#10b981',
    accent: '#6ee7b7',
    path: '/contact',
    isLive: true,
  },
  {
    title: 'Article Q&A & Summaries',
    description:
      'Every blog post comes with AI-generated summaries, key takeaways and a grounded Q&A reader that answers from the article content itself.',
    badge: 'RAG Reader',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    color: '#ec4899',
    accent: '#f9a8d4',
    path: '/blog',
    isLive: true,
  },
  {
    title: 'Contact AI Co-writer',
    description:
      'The contact form is backed by an intent classifier that triages leads, flags spam and drafts a polished message so every inquiry reaches the right place.',
    badge: 'Lead Intelligence',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    color: '#f59e0b',
    accent: '#fcd34d',
    path: '/contact',
    isLive: true,
  },
  {
    title: '3D AI Data Network',
    description:
      'A real-time, interactive 3D visualization of AI, humans and Earth — 800+ particles, orbiting neural nodes and energy rings rendered with Three.js.',
    badge: 'Realtime 3D',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    color: '#ef4444',
    accent: '#fca5a5',
    isLive: true,
  },
];

export default function AIShowcase() {
  return (
    <section className="relative z-10 px-4 py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full border border-brand/25 bg-brand/10 text-brand-light backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span>AI-Powered Portfolio</span>
          </div>

          <h2
            className="text-4xl md:text-6xl font-black mb-4"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #fff, #67e8f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Built With Intelligence
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Every corner of this portfolio is wired to a custom AI backend — a
            grounded agent, semantic search, RAG article reader and career
            intelligence. Ask the floating Nova orb anything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5"
              style={{
                background: `linear-gradient(160deg, ${feature.color}10 0%, #0a0a1e 60%)`,
                border: `1px solid ${feature.color}22`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 24px ${feature.color}0d`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }} />

              <div className="flex items-start justify-between mb-5">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${feature.color}14`,
                    border: `1px solid ${feature.color}35`,
                  }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={feature.accent} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <span
                  className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full"
                  style={{
                    background: `${feature.color}12`,
                    border: `1px solid ${feature.color}30`,
                    color: feature.accent,
                  }}
                >
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2" style={{ color: feature.accent }}>
                {feature.title}
              </h3>
              <p className="text-body text-sm leading-relaxed mb-5">
                {feature.description}
              </p>

              {feature.path && (
                <Link
                  to={feature.path}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase transition-all duration-300"
                  style={{ color: feature.accent }}
                >
                  Try it
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-slate-900 rounded-full transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #c4b5fd, #fff, #67e8f9)',
              boxShadow: '0 10px 40px rgba(139,92,246,0.25)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            See AI projects
          </Link>
        </div>
      </div>
    </section>
  );
}
