/**
 * ProjectsPage — Professional portfolio projects page.
 * Hero with stats, horizontal scroll with images, CTA.
 */
import { useSearch } from '@/context/SearchContext';
import { projects as allProjects } from '@/lib/data';
import AnimatedSection from '@/components/ui/AnimatedSection';
import AIProjectRecommender from '@/components/ai/AIProjectRecommender';
import { lazy, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CosmicBackground = lazy(() => import('@/components/3d/CosmicBackground'));

const PALETTES = [
  { color: '#8b5cf6', accent: '#c4b5fd', glow: 'rgba(139,92,246,0.45)', bg1: '#1e1145', bg2: '#0f0828', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { color: '#ec4899', accent: '#f9a8d4', glow: 'rgba(236,72,153,0.45)', bg1: '#4a0e2e', bg2: '#2a0618', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
  { color: '#06b6d4', accent: '#67e8f9', glow: 'rgba(6,182,212,0.45)', bg1: '#083847', bg2: '#041e28', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
  { color: '#10b981', accent: '#6ee7b7', glow: 'rgba(16,185,129,0.45)', bg1: '#0a3d28', bg2: '#062216', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { color: '#f59e0b', accent: '#fcd34d', glow: 'rgba(245,158,11,0.45)', bg1: '#3d3008', bg2: '#221b04', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { color: '#ef4444', accent: '#fca5a5', glow: 'rgba(239,68,68,0.45)', bg1: '#3b0f0f', bg2: '#200606', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 1500;
          const step = (ts: number) => {
            let start = 0;
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══ SLIDE CARD — WITH PROJECT IMAGE ═══ */

function SlideCard({ project, index }: { project: typeof allProjects[0]; index: number }) {
  const p = PALETTES[index % PALETTES.length];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-[350px] md:w-[420px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-400"
      style={{
        background: `linear-gradient(170deg, ${p.bg1} 0%, ${p.bg2} 55%, #08080f 100%)`,
        border: `1px solid ${hovered ? p.color + '60' : p.color + '20'}`,
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${p.glow}`
          : `0 8px 32px rgba(0,0,0,0.4)`,
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden" style={{ background: `radial-gradient(ellipse at top, ${p.color}25, ${p.bg2})` }}>
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${p.bg2} 0%, transparent 50%)` }} />

        {/* Number badge */}
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: `${p.color}dd`, color: '#fff', boxShadow: `0 0 15px ${p.color}60` }}
        >
          {index + 1}
        </div>

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1">
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.accent}, ${p.color})`, boxShadow: `0 0 15px ${p.glow}` }} />
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${p.color}15`,
              border: `1px solid ${p.color}35`,
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={p.accent} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: `${p.accent}70` }}>
              Project {String(index + 1).padStart(2, '0')}
            </div>
            <h3
              className="text-xl font-bold leading-tight"
              style={{
                background: `linear-gradient(135deg, #fff 0%, ${p.accent} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              {project.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-sm"
              style={{
                background: `${p.color}12`,
                borderColor: `${p.accent}30`,
                color: p.accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${p.color}, ${p.accent})`,
                color: '#fff',
                boxShadow: `0 4px 20px ${p.color}40`,
              }}
            >
              Live Demo
            </a>
          )}
          {project.repoUrl && project.repoUrl !== '#' && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                borderColor: `${p.accent}40`,
                color: p.accent,
                background: `${p.color}08`,
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */

export default function ProjectsPage() {
  const { searchQuery } = useSearch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredProjects = allProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const scroll = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-body overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10">
        {/* ═══ HERO ═══ */}
        <AnimatedSection>
          <div className="text-center pt-16 pb-10 px-4">
            <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full border border-brand/30 bg-brand/10 text-brand-light backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span>Mission Control</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-tight">
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #fff 30%, #f9a8d4 60%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.15))',
                }}
              >
                Cosmic Projects
              </span>
            </h1>

            <p className="text-lg md:text-xl text-body max-w-2xl mx-auto leading-relaxed mb-10">
              Explore my universe of web creations — each project a star in the
              galaxy, crafted with passion, code &amp; cosmic precision.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-14">
              {[
                { value: allProjects.length, label: 'Projects', suffix: '+' },
                { value: 12, label: 'Technologies', suffix: '+' },
                { value: 100, label: 'Commitment', suffix: '%' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-black" style={{ color: '#c4b5fd' }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dim mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ HORIZONTAL SCROLL ═══ */}
        {filteredProjects.length > 0 && (
          <AnimatedSection className="mt-4">
            <div className="text-center mb-8">
              <h2
                className="text-3xl md:text-4xl font-black mb-2"
                style={{
                  background: 'linear-gradient(90deg, #a78bfa, #ec4899, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                Featured Work
              </h2>
              <p className="text-muted text-sm">Scroll to explore · Click to view live demos</p>
            </div>

            <div className="relative group/scroll">
              <button onClick={() => scroll(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface backdrop-blur-md border border-border-subtle flex items-center justify-center text-muted hover:text-heading hover:bg-surface-hover transition-all opacity-0 group-hover/scroll:opacity-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button onClick={() => scroll(1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface backdrop-blur-md border border-border-subtle flex items-center justify-center text-muted hover:text-heading hover:bg-surface-hover transition-all opacity-0 group-hover/scroll:opacity-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>

              <div className="absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-14 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-10 pb-6 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#a78bfa transparent' }}
              >
                {filteredProjects.map((project, i) => (
                  <div key={project.id} className="snap-center">
                    <SlideCard project={project} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ═══ AI PROJECT FINDER ═══ */}
        <AnimatedSection className="mt-16 px-4">
          <div className="max-w-3xl mx-auto">
            <AIProjectRecommender />
          </div>
        </AnimatedSection>

        {/* ═══ CTA ═══ */}
        <AnimatedSection className="px-4 py-20 text-center mt-16">
          <div
            className="max-w-2xl mx-auto p-10 rounded-3xl border border-brand/15"
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(236,72,153,0.06) 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #fff, #f9a8d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              Have a project in mind?
            </h2>
            <p className="text-muted mb-8">Let&apos;s build something cosmic together.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-slate-900 rounded-full transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #fff, #f9a8d4)',
                boxShadow: '0 10px 40px rgba(167,139,250,0.3)',
              }}
            >
              Get in Touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        div::-webkit-scrollbar { height: 5px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: #a78bfa; border-radius: 3px; }
        div::-webkit-scrollbar-thumb:hover { background: #c4b5fd; }
      `}</style>
    </div>
  );
}
