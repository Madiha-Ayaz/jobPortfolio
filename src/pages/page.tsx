import { useRef, useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlobalPeopleNetwork3D from "@/components/3d/GlobalPeopleNetwork3D";
import AIDataNetwork3D from "@/components/3d/AINetwork";
import AIShowcase from "@/components/ai/AIShowcase";
import { lazy } from "react";

const CosmicBackground = lazy(() => import("@/components/3d/CosmicBackground"));
import { projects } from "@/lib/data";
import {
  IconCode,
  IconBrain,
  IconGlobe,
  IconArrowRight,
  IconSpark,
  IconStar,
} from "@/components/ui/ProIcon";

const PALETTES = [
  { color: '#8b5cf6', accent: '#c4b5fd', glow: 'rgba(139,92,246,0.45)', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { color: '#ec4899', accent: '#f9a8d4', glow: 'rgba(236,72,153,0.45)', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
  { color: '#06b6d4', accent: '#67e8f9', glow: 'rgba(6,182,212,0.45)', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
  { color: '#10b981', accent: '#6ee7b7', glow: 'rgba(16,185,129,0.45)', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { color: '#f59e0b', accent: '#fcd34d', glow: 'rgba(245,158,11,0.45)', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { color: '#ef4444', accent: '#fca5a5', glow: 'rgba(239,68,68,0.45)', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
];

const featuredProjects = projects.map((p, i) => ({
  ...p,
  palette: PALETTES[i % PALETTES.length],
}));

function ProjectCard3D({ project }: { project: typeof featuredProjects[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(20px)`;
    if (glowRef.current) {
      const px = (e.clientX - rect.left);
      const py = (e.clientY - rect.top);
      glowRef.current.style.background = `radial-gradient(circle at ${px}px ${py}px, ${project.palette.glow}, transparent 60%)`;
      glowRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <Link to="/projects">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 ease-out h-full"
        style={{
          background: `linear-gradient(135deg, ${project.palette.color}18 0%, #0a0a1e 50%, ${project.palette.color}08 100%)`,
          border: `1px solid ${project.palette.color}40`,
          boxShadow: `0 8px 40px ${project.palette.color}18`,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Image area */}
        <div className="relative h-44 overflow-hidden" style={{ background: `radial-gradient(ellipse at top, ${project.palette.color}30, #0a0a1e)` }}>
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #0a0a1e 0%, transparent 60%)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: `linear-gradient(to top, #0a0a1e, transparent)` }} />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `${project.palette.color}15`,
                border: `1px solid ${project.palette.color}40`,
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={project.palette.accent} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={project.palette.icon} />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: project.palette.accent }}>
              {project.title}
            </h3>
          </div>
          <p className="text-body text-sm mb-4 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: `${project.palette.color}15`,
                  color: project.palette.accent,
                  border: `1px solid ${project.palette.color}30`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hover glow */}
        <div ref={glowRef} className="absolute inset-0 opacity-0 pointer-events-none rounded-2xl transition-opacity duration-300" style={{ mixBlendMode: 'screen' }} />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen text-body overflow-x-hidden">
      <CosmicBackground />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {mounted && <GlobalPeopleNetwork3D />}
        </div>

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.45) 80%)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl w-full">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6 px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase rounded-full border border-highlight/20 bg-highlight/5 backdrop-blur-md text-highlight-light max-w-full" style={{ boxShadow: '0 0 20px rgba(6,182,212,0.1), inset 0 1px 0 rgba(6,182,212,0.15)' }}>
            <IconGlobe size={14} />
            <span>Global People Network · Live</span>
            <IconStar size={14} />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #ffffff 40%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.2))',
            }}
          >
            Madiha Ayaz
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl font-semibold mb-4 px-2"
            style={{
              background: 'linear-gradient(90deg, #c4b5fd, #f9a8d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Frontend Developer &bull; AI Enthusiast &bull; 3D Builder
          </p>

          <p className="text-sm sm:text-base md:text-lg text-body max-w-2xl mx-auto mb-10 leading-relaxed px-2">
            Connecting people, systems, and ideas across the globe through
            intelligent real-time data flow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-full text-slate-900 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd, #fff, #f9a8d4)',
                boxShadow: '0 10px 40px rgba(167,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
            >
              <span>Explore Projects</span>
              <IconArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-full border border-white/20 text-slate-100 hover:bg-white/5 transition-all hover:scale-105"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-dim">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-6 h-10 border border-border-default rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS — REAL DATA ═══ */}
      <AnimatedSection className="relative z-10 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-full border border-brand/20 bg-brand/5 text-brand-light backdrop-blur-sm">
              <IconSpark size={14} />
              <span>Featured Work</span>
            </div>
            <h2
              className="text-4xl md:text-6xl font-black mb-4"
              style={{
                background: 'linear-gradient(90deg, #c4b5fd, #fff, #f9a8d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Selected Projects
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Hover over the cards to feel the 3D depth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard3D key={project.id} project={project} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ AI DATA NETWORK ═══ */}
      <section className="relative z-10 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 30% 60%, rgba(167,139,250,0.03) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 40%, rgba(94,234,212,0.02) 0%, transparent 60%)',
        }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 relative z-20">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 text-xs font-semibold tracking-[0.25em] uppercase rounded-full border border-highlight/20 bg-highlight/5 backdrop-blur-xl text-highlight-light" style={{ boxShadow: '0 0 20px rgba(6,182,212,0.08), inset 0 1px 0 rgba(6,182,212,0.1)' }}>
              <IconBrain size={14} />
              <span>AI × Human × Earth</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-[-0.03em]" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 30%, #8B5CF6 60%, #5EEAD4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.15))',
            }}>
              The AI Data Network
            </h2>

            <p className="text-base md:text-lg text-muted max-w-3xl mx-auto leading-relaxed font-light">
              A neon-lit constellation of AI, humans, and Earth — seven orbiting
              nodes pulse with live data across energy-ring-encircled continents,
              each connection a glowing thread in a living digital network.
            </p>
          </div>

          <div className="relative" style={{ filter: 'drop-shadow(0 0 60px rgba(0,200,255,0.08))' }}>
            <AIDataNetwork3D />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8 md:mt-12">
            {[
              { label: 'Vivid Earth', color: '#00aaff' },
              { label: '7 Neon Nodes', color: '#ff0080' },
              { label: 'Energy Rings', color: '#bf00ff' },
              { label: '800+ Particles', color: '#39ff14' },
              { label: 'Drag to Rotate', color: '#ffdd00' },
              { label: 'Real-Time 3D', color: '#00ffff' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-full backdrop-blur-sm"
                style={{
                  border: `1px solid ${color}44`,
                  background: `${color}12`,
                  color,
                  boxShadow: `0 0 12px ${color}20`,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI POWERED SHOWCASE ═══ */}
      <AIShowcase />

      {/* ═══ CTA ═══ */}
      <AnimatedSection className="relative z-10 px-4 py-24 text-center">
        <div
          className="max-w-3xl mx-auto p-12 rounded-3xl border border-brand/15"
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(236,72,153,0.06) 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(236,72,153,0.15))',
              border: '1px solid rgba(167,139,250,0.3)',
            }}
          >
            <IconCode size={22} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, #c4b5fd, #fff, #f9a8d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Ready to build something cosmic?
          </h2>
          <p className="text-body text-lg mb-8">
            Let&apos;s collaborate on your next 3D, agentic, or AI-powered experience.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-9 py-3.5 font-semibold text-slate-900 rounded-full transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #c4b5fd, #fff, #f9a8d4)',
              boxShadow: '0 10px 40px rgba(167,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <span>Let&apos;s Launch a Project</span>
            <IconArrowRight size={18} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
