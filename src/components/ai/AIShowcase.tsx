import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const EASE = [0.22, 1, 0.36, 1] as unknown as any;

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
    title: 'ai.f1.title',
    description: 'ai.f1.desc',
    badge: 'ai.f1.badge',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
    color: '#8b5cf6',
    accent: '#c4b5fd',
    isLive: true,
  },
  {
    title: 'ai.f2.title',
    description: 'ai.f2.desc',
    badge: 'ai.f2.badge',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    color: '#06b6d4',
    accent: '#67e8f9',
    path: '/projects',
    isLive: true,
  },
  {
    title: 'ai.f3.title',
    description: 'ai.f3.desc',
    badge: 'ai.f3.badge',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    color: '#10b981',
    accent: '#6ee7b7',
    path: '/contact',
    isLive: true,
  },
  {
    title: 'ai.f4.title',
    description: 'ai.f4.desc',
    badge: 'ai.f4.badge',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    color: '#ec4899',
    accent: '#f9a8d4',
    path: '/blog',
    isLive: true,
  },
  {
    title: 'ai.f5.title',
    description: 'ai.f5.desc',
    badge: 'ai.f5.badge',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    color: '#f59e0b',
    accent: '#fcd34d',
    path: '/contact',
    isLive: true,
  },
  {
    title: 'ai.f6.title',
    description: 'ai.f6.desc',
    badge: 'ai.f6.badge',
    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    color: '#ef4444',
    accent: '#fca5a5',
    isLive: true,
  },
];

/* ──────────── 3D tilt feature pod ──────────── */
function TiltPod({ feature, index }: { feature: AIFeature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const { t } = useTheme();

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 12,
      y: ((e.clientY - r.top) / r.height - 0.5) * 12,
    });
  };

  const onLeave = () => {
    setHover(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
      className="h-full"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={onLeave}
        className="group relative rounded-2xl overflow-hidden p-5 h-full will-change-transform"
        style={{
          transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          background: `linear-gradient(160deg, ${feature.color}12 0%, var(--bg-card) 60%)`,
          border: `1px solid ${hover ? feature.color : feature.color + '26'}`,
          boxShadow: hover
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 42px ${feature.color}40`
            : `0 8px 32px rgba(0,0,0,0.35), 0 0 24px ${feature.color}10`,
          transition: 'box-shadow 0.4s ease, border-color 0.3s ease',
        }}
      >
        {/* top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }} />

        {/* hover shine sweep */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(110deg, transparent 32%, ${feature.color}1f 50%, transparent 68%)`, backgroundSize: '250% 100%', backgroundPosition: hover ? '100% 0%' : '0% 0%', transition: 'background-position 0.8s ease, opacity 0.4s ease' }}
        />

        <div className="flex items-start justify-between mb-4 relative">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            style={{ background: `${feature.color}16`, border: `1px solid ${feature.color}38`, boxShadow: `0 0 24px ${feature.color}1a` }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={feature.accent} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
            </svg>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full"
              style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}30`, color: feature.accent }}
            >
              {t(feature.badge)}
            </span>
            {feature.isLive && (
              <span className="flex items-center gap-1.5 text-[9px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                <span className="ai-live-dot w-1.5 h-1.5 rounded-full" style={{ background: feature.accent }} />
                live
              </span>
            )}
          </div>
        </div>

        {/* corner brackets */}
        {[
          'top-3 left-3 border-t border-l',
          'top-3 right-3 border-t border-r',
          'bottom-3 left-3 border-b border-l',
          'bottom-3 right-3 border-b border-r',
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute w-3 h-3 ${pos} pointer-events-none z-10 transition-opacity duration-300`}
            style={{ borderColor: feature.accent, opacity: hover ? 1 : 0 }}
          />
        ))}

        <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2 relative" style={{ color: 'var(--text-dim)' }}>
          {String(index + 1).padStart(2, '0')} / ai.core
        </p>
        <div className="relative h-0.5 rounded-full overflow-hidden mb-3">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{ width: hover ? '96%' : '34%', background: `linear-gradient(90deg, ${feature.color}, ${feature.accent})`, boxShadow: `0 0 8px ${feature.color}` }}
          />
        </div>
        <h3 className="text-lg font-bold mb-2 relative" style={{ color: feature.accent }}>
          {t(feature.title)}
        </h3>
        <p className="text-body text-sm leading-relaxed mb-5 relative">
          {t(feature.description)}
        </p>

        {feature.path && (
          <Link
            to={feature.path}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase transition-all duration-300 relative"
            style={{ color: feature.accent }}
          >
            <span className="group-hover:tracking-[0.25em] transition-all duration-500">{t('ai.tryIt')}</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ──────────── holographic Nova core ──────────── */
function NovaCore() {
  const { t } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative w-full aspect-square max-w-[540px] mx-auto select-none"
      style={{ perspective: '1200px', '--rr': 'clamp(110px, 22vw, 235px)' } as CSSProperties}
    >
      {/* ambient glow */}
      <div className="absolute inset-[-6%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16), transparent 65%)' }} aria-hidden="true" />

      {/* sonar ping */}
      <div className="nc-ping absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] h-[42%] rounded-full" style={{ border: '1px solid rgba(139,92,246,0.4)' }} aria-hidden="true" />

      {/* core orb */}
      <div
        className="nc-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] h-[42%] rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 32%, rgba(165,180,252,0.95), rgba(99,102,241,0.55) 42%, rgba(30,41,59,0.95) 78%)',
          boxShadow: '0 0 90px 22px rgba(124,58,237,0.30), inset 0 0 50px rgba(125,211,252,0.25)',
        }}
      >
        <div className="nc-sheen absolute inset-0 rounded-full" aria-hidden="true" />
        <div
          className="absolute inset-[16%] rounded-full flex items-center justify-center"
          style={{ background: 'rgba(2,6,23,0.35)', backdropFilter: 'blur(3px)', border: '1px solid rgba(165,180,252,0.25)' }}
        >
          <span className="font-black tracking-[0.34em] text-[10px] md:text-[11px] uppercase text-white/90 pl-[0.34em]">Nova</span>
        </div>
      </div>

      {/* aurora halo */}
      <div className="nc-aura absolute -inset-[16%] rounded-full pointer-events-none opacity-70" aria-hidden="true" />

      {/* tick ring */}
      <div className="nc-tick-ring absolute inset-[13%] rounded-full pointer-events-none" aria-hidden="true" />

      {/* dashed orbit ring */}
      <div className="nc-orbit-ring absolute inset-[5%] rounded-full" style={{ border: '1px dashed rgba(167,139,250,0.35)', animationDuration: '60s' }}>
        <span className="nc-sat absolute left-1/2 top-0 w-2 h-2 rounded-full" style={{ background: '#a78bfa', boxShadow: '0 0 10px #a78bfa' }} />
      </div>

      {/* 3D-tilted elliptical rings + satellites */}
      <div className="nc-ell absolute inset-[9%] rounded-full" style={{ animationDuration: '34s' }}>
        <span className="nc-sat absolute left-1/2 top-0 w-1.5 h-1.5 rounded-full" style={{ background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
      </div>
      <div className="nc-ell nc-ell-rev absolute inset-[15%] rounded-full" style={{ animationDuration: '46s' }}>
        <span className="nc-sat absolute left-1/2 top-0 w-1.5 h-1.5 rounded-full" style={{ background: '#f472b6', boxShadow: '0 0 8px #f472b6' }} />
      </div>

      {/* orbiting feature chips */}
      <div className="nc-orbit absolute inset-0" style={{ animationDuration: '38s' }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="nc-chip"
            style={{ transform: `rotate(${i * 60}deg) translateX(var(--rr))` }}
            aria-hidden="true"
          >
            <span className="nc-chipsp" style={{ animationDuration: '38s' }}>
              <span
                className="nc-pill flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  '--pa': `${-i * 60}deg`,
                  background: 'rgba(2,6,23,0.72)',
                  border: `1px solid ${f.color}4d`,
                  boxShadow: `0 4px 18px rgba(0,0,0,0.35), 0 0 12px ${f.color}1f`,
                  backdropFilter: 'blur(4px)',
                } as CSSProperties}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.accent, boxShadow: `0 0 8px ${f.accent}` }} />
                <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: f.accent }}>{t(f.badge)}</span>
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* hologram floor grid */}
      <div className="absolute inset-x-[3%] bottom-0 h-[36%] pointer-events-none" style={{ perspective: '420px' }} aria-hidden="true">
        <div
          className="nc-grid w-full h-full"
          style={{
            transform: 'rotateX(74deg) translateY(28%)',
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.22) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 62% 48% at 50% 30%, black, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 62% 48% at 50% 30%, black, transparent 78%)',
          }}
        />
      </div>

      {/* telemetry chips */}
      <div className="nc-tel absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ left: '3%', top: '26%', background: 'rgba(2,6,23,0.72)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 6px 22px rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} aria-hidden="true">
        <span className="w-1 h-1 rounded-full" style={{ background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
        <span className="font-mono text-[9px] font-semibold tracking-widest text-slate-300">embed · 1536d</span>
      </div>
      <div className="nc-tel absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ right: '3%', top: '40%', background: 'rgba(2,6,23,0.72)', border: '1px solid rgba(56,189,248,0.35)', boxShadow: '0 6px 22px rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', animationDelay: '1.2s' }} aria-hidden="true">
        <span className="w-1 h-1 rounded-full" style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
        <span className="font-mono text-[9px] font-semibold tracking-widest text-slate-300">retrieval · 0.21s</span>
      </div>
      <div className="nc-tel absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ left: '8%', bottom: '16%', background: 'rgba(2,6,23,0.72)', border: '1px solid rgba(244,114,182,0.35)', boxShadow: '0 6px 22px rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', animationDelay: '2s' }} aria-hidden="true">
        <span className="w-1 h-1 rounded-full" style={{ background: '#f472b6', boxShadow: '0 0 6px #f472b6' }} />
        <span className="font-mono text-[9px] font-semibold tracking-widest text-slate-300">tokens · 4.8k/s</span>
      </div>
      <div className="nc-tel absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ right: '7%', bottom: '22%', background: 'rgba(2,6,23,0.72)', border: '1px solid rgba(52,211,153,0.35)', boxShadow: '0 6px 22px rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', animationDelay: '0.6s' }} aria-hidden="true">
        <span className="w-1 h-1 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
        <span className="font-mono text-[9px] font-semibold tracking-widest text-slate-300">grounding · ok</span>
      </div>

      {/* status row */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <span className="w-1.5 h-1.5 rounded-full ai-live-dot" style={{ background: '#34d399' }} />
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--text-muted)' }}>{t('ai.systemsOnline')}</span>
      </div>

      <style>{`
        @keyframes ncSpin { to { transform: rotate(360deg); } }
        @keyframes ncSpinRev { to { transform: rotate(-360deg); } }
        .nc-orbit {
          animation: ncSpin var(--d, 38s) linear infinite;
        }
        .nc-orbit > .nc-chip { position: absolute; left: 50%; top: 50%; }
        .nc-chipsp { display: block; animation: ncSpinRev var(--d, 38s) linear infinite; }
        .nc-pill { transform: translate(-50%, -50%) rotate(var(--pa, 0deg)); }
        .nc-core { animation: ncCore 6s ease-in-out infinite; }
        @keyframes ncCore {
          0%, 100% { box-shadow: 0 0 90px 22px rgba(124,58,237,0.30), inset 0 0 50px rgba(125,211,252,0.25); }
          50%      { box-shadow: 0 0 120px 34px rgba(124,58,237,0.5), inset 0 0 70px rgba(125,211,252,0.42); }
        }
        .nc-sheen {
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
          background-size: 250% 100%;
          animation: ncSheen 5.5s ease-in-out infinite;
        }
        @keyframes ncSheen { 0%,75%,100% { background-position: 120% 0; } 30% { background-position: -120% 0; } }
        .nc-orbit-ring {
          border: 1px dashed rgba(167,139,250,0.35);
          animation: ncSpin var(--d, 60s) linear infinite;
        }
        .nc-sat { margin: -4px 0 0 -4px; position: absolute; display: block; }
        .nc-ell {
          border: 1px solid rgba(56,189,248,0.28);
          transform: rotateX(68deg);
          animation: ncEll var(--d, 34s) linear infinite;
        }
        @keyframes ncEll {
          from { transform: rotateX(68deg) rotate(0deg); }
          to   { transform: rotateX(68deg) rotate(360deg); }
        }
        .nc-ell-rev {
          border-color: rgba(244,114,182,0.28);
          transform: rotateX(69deg) rotate(180deg);
          animation-direction: reverse;
        }
        .nc-ping {
          animation: ncPing 3.6s ease-out infinite;
        }
        @keyframes ncPing {
          0%   { transform: translate(-50%,-50%) scale(0.35); opacity: 0.8; }
          80%  { opacity: 0; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0; }
        }
        .nc-aura {
          background: conic-gradient(from 0deg, transparent, rgba(139,92,246,0.3), transparent 32%, rgba(56,189,248,0.22), transparent 58%, rgba(232,121,249,0.22), transparent 82%);
          filter: blur(5px);
          animation: ncAura 16s linear infinite;
        }
        @keyframes ncAura { to { transform: rotate(360deg); } }
        .nc-tick-ring {
          background: repeating-conic-gradient(from 0deg, rgba(196,181,253,0.9) 0deg 1.6deg, transparent 1.6deg 9deg);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 3px));
          animation: ncAura 44s linear infinite reverse;
        }
        .nc-tel { animation: ncDrift 6s ease-in-out infinite alternate; }
        .nc-grid { animation: ncGridFlick 4s steps(2, end) infinite; }
        @keyframes ncGridFlick { 0%, 90% { opacity: 1; } 95% { opacity: 0.6; } 100% { opacity: 1; } }
        @keyframes ncDrift { from { transform: translateY(-7px); } to { transform: translateY(7px); } }
        .ai-live-dot { animation: aiBlink 1.8s ease-in-out infinite; }
        @keyframes aiBlink { 0%,100% { opacity: 1; box-shadow: 0 0 6px currentColor; } 50% { opacity: 0.35; box-shadow: 0 0 2px currentColor; } }
        .ai-title {
          background: linear-gradient(110deg, #a5b4fc, #f8fafc, #7dd3fc, #f8fafc, #a5b4fc);
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: aiShimmer 8s linear infinite;
        }
        @keyframes aiShimmer { to { background-position: -220% 0; } }
        @media (prefers-reduced-motion: reduce) {
          .nc-orbit, .nc-orbit-ring, .nc-chipsp, .nc-ell, .nc-core, .nc-sheen, .nc-ping, .ai-live-dot, .ai-title,
          .nc-aura, .nc-tick-ring, .nc-tel, .nc-grid {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default function AIShowcase() {
  const { t } = useTheme();

  return (
    <section className="relative z-10 px-4 py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 mb-5 px-5 py-2 text-xs font-bold tracking-[0.25em] uppercase rounded-full border border-brand/25 bg-brand/10 text-brand-light backdrop-blur-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span>{t('ai.title')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
            className="ai-title text-4xl md:text-6xl font-black mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('ai.builtWith')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            {t('ai.sub')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <NovaCore />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <TiltPod key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-2 px-9 py-3.5 font-bold rounded-full overflow-hidden transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(120deg, #818cf8, #38bdf8)',
                color: '#020617',
                boxShadow: '0 12px 44px rgba(99,102,241,0.35)',
              }}
            >
              <span className="absolute inset-0 bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: 'linear-gradient(120deg, #38bdf8, #818cf8, #38bdf8)' }} />
              <svg className="w-4 h-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <span className="relative">{t('ai.seeProjects')}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}