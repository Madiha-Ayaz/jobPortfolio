/**
 * ProjectsPage — Professional portfolio projects page.
 * Hero with stats, horizontal scroll with images, CTA.
 */
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/lib/data';
import { usePortfolio } from '@/context/PortfolioContext';
import { useAgent } from '@/context/useAgent';
import AnimatedSection from '@/components/ui/AnimatedSection';
import AIProjectRecommender from '@/components/ai/AIProjectRecommender';
import ProjectCoverflow from '@/components/projects/ProjectCoverflow';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

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

/* ═══ MAIN PAGE ═══ */

export default function ProjectsPage() {
  const { searchQuery } = useSearch();
  const { projects: hydratedProjects } = usePortfolio();
  const { setIsOpen } = useAgent();
  const { t } = useTheme();
  const allProjects = hydratedProjects ?? [];
  const [healthDismissed, setHealthDismissed] = useState(false);

  const filteredProjects = allProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isAiProject = (p: Project) =>
    /AI|Agent|GPT|RAG|LLM|OpenAI|Gemini|Machine Learning/i.test(`${p.title} ${p.description} ${p.tags.join(' ')}`);

  const orderedProjects = [
    ...filteredProjects.filter(isAiProject),
    ...filteredProjects.filter((p) => !isAiProject(p)),
  ];

  const issues = useMemo(
    () =>
      allProjects.flatMap((p) => {
        const found: string[] = [];
        if (!p.description || p.description.trim().length < 40)
          found.push(`"${p.title}" has a thin description`);
        if (!p.liveUrl || p.liveUrl === '#') found.push(`"${p.title}" is missing a live demo link`);
        if (!p.repoUrl || p.repoUrl === '#') found.push(`"${p.title}" has no source code link`);
        if (!p.tags || p.tags.length === 0) found.push(`"${p.title}" has no tags`);
        return found;
      }),
    [allProjects]
  );

  const techCount = useMemo(() => new Set(allProjects.flatMap((p) => p.tags)).size, [allProjects]);
  const liveDemos = useMemo(
    () => allProjects.filter((p) => p.liveUrl && p.liveUrl !== '#').length,
    [allProjects]
  );

  return (
    <div className="relative min-h-screen text-body overflow-hidden">
      <div className="relative z-10">
        {/* ═══ HERO ═══ */}
        <AnimatedSection>
          <div className="text-center pt-16 pb-10 px-4">
            <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full border border-brand/30 bg-brand/10 text-brand-light backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span>{t('projects.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-tight">
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(120deg, #a5b4fc 0%, #f8fafc 40%, #7dd3fc 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(129,140,248,0.2))',
                }}
              >
                {t('projects.title')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-body max-w-2xl mx-auto leading-relaxed mb-10">
              {t('projects.subtitle')}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-14">
              {[
                { value: allProjects.length, label: t('projects.statProjects'), suffix: '' },
                { value: techCount, label: t('projects.statTech'), suffix: '+' },
                { value: liveDemos, label: t('projects.statDemos'), suffix: '' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-black" style={{ color: '#a5b4fc' }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dim mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ CONTENT HEALTH (AI) ═══ */}
        {issues.length > 0 && !healthDismissed && (
          <AnimatedSection className="px-4 mt-2">
            <div
              className="max-w-3xl mx-auto rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{
                background: 'color-mix(in srgb, var(--danger) 8%, var(--card-bg))',
                borderColor: 'color-mix(in srgb, var(--danger) 35%, var(--border-subtle))',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="var(--danger)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-sm font-bold" style={{ color: 'var(--danger)' }}>
                    {t('projects.healthPrefix')}: {issues.length} {issues.length === 1 ? t('projects.improvement') : t('projects.improvements')} {t('projects.detected')}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {issues.slice(0, 3).join(' · ')}
                  {issues.length > 3 && ` · +${issues.length - 3} more`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(120deg, #818cf8, #38bdf8)', boxShadow: '0 8px 24px color-mix(in srgb, var(--brand) 30%, transparent)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  {t('projects.fixWithAI')}
                </button>
                <button
                  onClick={() => setHealthDismissed(true)}
                  aria-label="Dismiss"
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ═══ PROJECT COVERFLOW ═══ */}
        {orderedProjects.length > 0 && (
          <AnimatedSection className="mt-4">
            <div className="text-center mb-8">
              <h2
                className="text-3xl md:text-4xl font-black mb-2"
                style={{
                  background: 'linear-gradient(120deg, #a5b4fc, #7dd3fc, #67e8f9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                {t('projects.allTitle')}
              </h2>
              <p className="text-muted text-sm">{t('projects.allSub')}</p>
            </div>

            <ProjectCoverflow
              key={orderedProjects.map((p) => p.id).join('-')}
              projects={orderedProjects}
            />
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
            className="max-w-2xl mx-auto p-10 rounded-3xl border border-brand/15 glass-strong"
            style={{
              background: 'linear-gradient(140deg, rgba(99,102,241,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(56,189,248,0.06) 100%)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black mb-3 text-gradient"
            >
              {t('projects.ctaTitle')}
            </h2>
            <p className="text-muted mb-8">{t('projects.ctaSub')}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold rounded-full transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(120deg, #818cf8, #38bdf8)',
                color: '#020617',
                boxShadow: '0 10px 40px rgba(99,102,241,0.35)',
              }}
            >
              {t('projects.ctaBtn')}
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
      `}</style>
    </div>
  );
}
