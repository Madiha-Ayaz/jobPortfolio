import { useRef, useState, useEffect, Suspense, lazy } from "react";
import type { ReactNode, CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Emblem3D from "@/components/3d/Emblem3D";
import SpinningEarth from "@/components/home/SpinningEarth";
import AIShowcase from "@/components/ai/AIShowcase";
import { useTheme } from '@/context/ThemeContext';
import { projects } from "@/lib/data";
import {
  IconArrowRight,
  IconSpark,
  IconCode,
} from "@/components/ui/ProIcon";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiThreedotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiFirebase,
  SiOpenrouter,
  SiGreensock,
  SiFramer,
  SiPython,
  SiVite,
  SiExpress,
  SiStreamlit,
} from "react-icons/si";
import { Database, Bot } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

const NebulaBackground3D = lazy(() => import("@/components/3d/NebulaBackground3D"));

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Shared animation presets
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE as any, delay: i * 0.08 },
  }),
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Nexus palette â€” teal, violet, fuchsia on deep blue-black
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const NX = {
  teal: '#2dd4a7',
  tealLight: '#6ee7c8',
  tealDark: '#0d9488',
  violet: '#8b5cf6',
  violetLight: '#c4b5fd',
  cyan: '#22d3ee',
  fuchsia: '#e879f9',
  amber: '#fbbf24',
  ink: '#04070d',
  card: 'rgba(7,16,25,0.92)',
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Reveal wrapper â€” fires once when a block scrolls into view
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE as any, delay }}
    >
      {children}
    </motion.div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Section heading â€” eyebrow + title + subtitle in one animated unit
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
}: {
  eyebrow: string;
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const child = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE as any } },
  };
  return (
    <motion.div
      ref={ref}
      variants={parent}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="text-center mb-16 md:mb-20"
    >
      {eyebrow && (
        <motion.div
          variants={child}
          className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-full glass"
          style={{
            color: NX.tealLight,
            border: `1px solid ${NX.teal}38`,
            boxShadow: `0 0 20px ${NX.teal}14`,
          }}
        >
          {eyebrowIcon}
          <span>{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2
        variants={child}
        className="text-4xl md:text-6xl font-black mb-5 text-gradient tracking-[-0.03em]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={child} className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Palette for featured project cards (nexus spectrum)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PALETTES = [
  { color: '#2dd4a7', accent: '#6ee7c8', glow: 'rgba(45,212,167,0.40)' },
  { color: '#8b5cf6', accent: '#c4b5fd', glow: 'rgba(139,92,246,0.40)' },
  { color: '#22d3ee', accent: '#67e8f9', glow: 'rgba(34,211,238,0.40)' },
  { color: '#34d399', accent: '#6ee7b7', glow: 'rgba(52,211,153,0.35)' },
  { color: '#e879f9', accent: '#f0abfc', glow: 'rgba(232,121,249,0.35)' },
  { color: '#fbbf24', accent: '#fde68a', glow: 'rgba(251,191,36,0.32)' },
];

const featuredProjects = projects.map((p, i) => ({
  ...p,
  palette: PALETTES[i % PALETTES.length],
}));

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Featured projects â€” holographic interactive showcase
   (auto-rotating spotlight stage + selectable crystal rail)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FeaturedShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  useEffect(() => {
    if (inView && !paused) {
      const iv = setInterval(() => setActive((a) => (a + 1) % featuredProjects.length), 4600);
      return () => clearInterval(iv);
    }
  }, [inView, paused]);

  return (
    <div
      ref={ref}
      className="fx relative grid lg:grid-cols-[1.55fr_1fr] gap-8 lg:gap-10 items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ShowcaseStage
        project={featuredProjects[active]}
        index={active}
        total={featuredProjects.length}
        onPick={setActive}
      />
      <ShowcaseRail projects={featuredProjects} active={active} onSelect={setActive} />

      <style>{`
        .fx-scan {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          opacity: 0.4;
          mix-blend-mode: overlay;
          background: repeating-linear-gradient(to bottom, transparent 0px 3px, rgba(255,255,255,0.045) 3px 4px);
        }
        .fx-scan::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 26%;
          transform: translateY(-130%);
          background: linear-gradient(to bottom, transparent, rgba(160,235,255,0.14), transparent);
          animation: fxSweep 4.6s linear infinite;
        }
        @keyframes fxSweep {
          to { transform: translateY(430%); }
        }
        .fx-num {
          font-size: clamp(5rem, 10vw, 8.5rem);
          font-family: Oswald, Montserrat, Arial, sans-serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .fx-beam {
          position: absolute;
          left: 5%;
          right: 5%;
          bottom: -7%;
          height: 130px;
          z-index: 0;
          pointer-events: none;
          filter: blur(7px);
          opacity: 0.45;
        }
        .fx-pt {
          opacity: 0.85;
          animation: fxFloat 5.5s ease-in-out infinite alternate;
        }
        @keyframes fxFloat {
          from { transform: translateY(0); }
          to   { transform: translateY(-22px) scale(1.25); }
        }
        .fx-prog {
          position: relative;
          height: 3px;
          border-radius: 0;
          background: rgba(255,255,255,0.09);
          overflow: hidden;
          flex: 1;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
        .fx-prog > span {
          display: block;
          height: 100%;
          border-radius: inherit;
        }
        .fx-aurora {
          animation: fxBreath 9s ease-in-out infinite alternate;
        }
        @keyframes fxBreath {
          from { transform: translateX(-50%) scale(1); opacity: 0.45; }
          to   { transform: translateX(-50%) scale(1.15); opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fx-scan, .fx-scan::after, .fx-pt, .fx-aurora {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ spotlight stage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ShowcaseStage({ project, index, total, onPick }: { project: (typeof featuredProjects)[0]; index: number; total: number; onPick: (i: number) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { t } = useTheme();

  const onMove = (e: MouseEvent) => {
    if (!stageRef.current || !innerRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    innerRef.current.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };

  const onLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.8, ease: EASE as any }}
    >
      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-500"
        style={{
          background: `linear-gradient(160deg, ${project.palette.color}16 0%, var(--bg-card) 55%, ${project.palette.color}0a 100%)`,
          border: `1px solid ${project.palette.color}38`,
          boxShadow: `0 24px 90px rgba(0,0,0,0.5), 0 0 60px ${project.palette.color}18`,
        }}
      >
        <div ref={innerRef} className="relative will-change-transform" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.25s ease-out' }}>
          {/* floating index */}
          <motion.span
            key={`n-${index}`}
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 0.75, x: 0 }}
            transition={{ duration: 1, ease: EASE as any }}
            className="fx-num absolute top-3 right-6 z-20 pointer-events-none select-none"
            style={{ color: project.palette.color, textShadow: `0 0 46px ${project.palette.color}77` }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>

          {/* scanlines */}
          <div className="fx-scan" aria-hidden="true" />

          {/* media */}
          <div className="relative h-[290px] md:h-[370px] overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% -10%, ${project.palette.color}30, transparent 70%)` }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={`${project.id}-img`}
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.14, filter: 'blur(6px)' }}
                animate={{ opacity: 0.82, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.9, ease: EASE as any }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, color-mix(in srgb, var(--bg) 94%, transparent) 0%, transparent 58%)` }} />
          </div>

          {/* content */}
          <div className="relative z-10 p-6 md:p-8 pt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: EASE as any }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-3 py-1 rounded-full font-semibold tracking-wide"
                      style={{ background: `${project.palette.color}1a`, color: project.palette.accent, border: `1px solid ${project.palette.color}3d` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-heading)', textShadow: `0 0 34px ${project.palette.color}66` }}>
                  {project.title}
                </h3>
                <p className="text-body text-sm md:text-base leading-relaxed line-clamp-3 mb-5">{project.description}</p>
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: project.palette.accent }}
                >
                  {t('card.view')}
                  <IconArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* projection beam */}
          <div className="fx-beam" style={{ backgroundImage: `linear-gradient(to top, ${project.palette.color}59, transparent 70%)` }} aria-hidden="true" />

          {/* hologram particles */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="fx-pt absolute rounded-full pointer-events-none z-10"
              style={{
                left: `${(i * 17 + 8) % 92 + 4}%`,
                top: `${(i * 23 + 12) % 78 + 8}%`,
                width: i % 2 ? 4 : 6,
                height: i % 2 ? 4 : 6,
                background: project.palette.accent,
                boxShadow: `0 0 12px ${project.palette.accent}`,
                animationDelay: `${i * 0.55}s`,
                opacity: 0.85,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* progress rail */}
      <div className="flex mt-5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            aria-label={`Project ${i + 1}`}
            className="fx-prog"
          >
            {i === index ? (
              <motion.span
                key={`${index}-fill`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.6, ease: 'linear' }}
                style={{ background: `linear-gradient(90deg, ${featuredProjects[i].palette.color}, rgba(255,255,255,0.5))`, boxShadow: `0 0 10px ${featuredProjects[i].palette.color}` }}
              />
            ) : (
              <span style={{ width: '0%' }} />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ selectable project rail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ShowcaseRail({ projects, active, onSelect }: { projects: typeof featuredProjects; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="relative space-y-3">
      {projects.map((p, i) => {
        const isActive = i === active;
        return (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE as any, delay: i * 0.08 }}
            onMouseEnter={() => onSelect(i)}
            onClick={() => onSelect(i)}
            whileHover={{ x: 8 }}
            className="w-full text-left rounded-2xl px-4 py-4 flex items-center gap-4 relative overflow-hidden cursor-pointer transition-colors duration-500 group"
            style={{
              background: isActive ? `linear-gradient(135deg, ${p.palette.color}1e, var(--bg-card))` : 'var(--surface)',
              border: `1px solid ${isActive ? `${p.palette.color}77` : 'var(--border-subtle)'}`,
              boxShadow: isActive ? `0 10px 44px ${p.palette.color}22, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
            }}
          >
            <span
              className="shrink-0 w-11 h-11 rounded-xl grid place-items-center font-black text-sm transition-transform duration-500 group-hover:scale-110"
              style={{ background: `${p.palette.color}1a`, color: p.palette.accent, border: `1px solid ${p.palette.color}44` }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-sm truncate" style={{ color: isActive ? 'var(--text-heading)' : 'var(--text-body)' }}>
                {p.title}
              </span>
              <span className="block text-xs text-muted truncate mt-0.5">
                {(p.tags[0] ?? '') + (p.tags[1] ? ` Â· ${p.tags[1]}` : '')}
              </span>
            </span>
            <IconArrowRight
              size={18}
              className="ml-auto shrink-0 transition-all duration-500"
              style={{ color: p.palette.accent, opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0)' : 'translateX(-6px)' }}
            />
            <span
              className="absolute inset-x-6 bottom-0 h-[2px] rounded-full pointer-events-none transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${p.palette.color}, transparent)`, opacity: isActive ? 1 : 0 }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Animated count-up stat
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1800, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    const numRef = ref.current?.querySelector('[data-count]');
    if (!numRef || typeof numRef.textContent !== 'string') return;
    const unsub = spring.on("change", (v) => {
      numRef.textContent = String(Math.round(v));
    });
    return unsub;
  }, [spring]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black mb-2 text-gradient tracking-[-0.03em]">
        <span data-count>0</span>
        <span>{suffix}</span>
      </div>
      <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted font-medium">
        {label}
      </div>
    </div>
  );
}

const STATS = [
  { target: 10, suffix: '+', labelKey: 'home.statsProjects' },
  { target: 8, suffix: '+', labelKey: 'home.statsTech' },
  { target: 3, suffix: 'D', labelKey: 'home.statsScenes' },
  { target: 100, suffix: '%', labelKey: 'home.statsCuriosity' },
];

function StatsSection() {
  const { t } = useTheme();
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-24">
      <Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE as any, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group transition-all duration-500 hover:-translate-y-1"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* neon top hairline */}
              <div
                className="absolute top-0 right-8 left-8 h-0.5 opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, transparent, ${NX.teal}, ${NX.violet}, transparent)`,
                  boxShadow: `0 0 12px ${NX.teal}66`,
                }}
              />
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${NX.teal}2e, transparent 70%)` }}
              />
              <Stat target={stat.target} suffix={stat.suffix} label={t(stat.labelKey)} />
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Tech orbit marquee â€” dual tilted holographic chip bands
   flowing around a rotating core hub
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type TechChip = { name: string; color: string; icon: ReactNode };

const TECH: TechChip[] = [
  { name: 'React', icon: <SiReact />, color: '#61dafb' },
  { name: 'TypeScript', icon: <SiTypescript />, color: '#3f8ee0' },
  { name: 'Next.js', icon: <SiNextdotjs />, color: '#e2e8f0' },
  { name: 'Three.js', icon: <SiThreedotjs />, color: '#bfd7ff' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#38bdf8' },
  { name: 'Node.js', icon: <SiNodedotjs />, color: '#86c34b' },
  { name: 'Firebase', icon: <SiFirebase />, color: '#ffca28' },
  { name: 'OpenRouter AI', icon: <SiOpenrouter />, color: '#a78bfa' },
  { name: 'GSAP', icon: <SiGreensock />, color: '#88ce02' },
  { name: 'Framer Motion', icon: <SiFramer />, color: '#f1f5f9' },
  { name: 'Python', icon: <SiPython />, color: '#ffd43b' },
  { name: 'RAG', icon: <Database size={15} />, color: '#2dd4a7' },
  { name: 'AI Agents', icon: <Bot size={15} />, color: '#e879f9' },
  { name: 'Vite', icon: <SiVite />, color: '#bd9bff' },
  { name: 'Express', icon: <SiExpress />, color: '#cbd5e1' },
  { name: 'Streamlit', icon: <SiStreamlit />, color: '#ff6b6b' },
];

const TECH_ROW = [...TECH, ...TECH];

function TechChip({ t }: { t: TechChip }) {
  return (
    <span className="tm-chip" style={{ '--tc': t.color } as CSSProperties}>
      <span className="tm-chip-icon">{t.icon}</span>
      <span className="tm-chip-name">{t.name}</span>
      <span className="tm-chip-pip" />
    </span>
  );
}

function TechMarquee() {
  return (
    <section className="tm relative z-10 overflow-hidden" style={{ borderColor: 'rgba(45,212,167,0.08)' }}>
      <div className="tm-orbits">
        <div className="tm-track">
          {TECH_ROW.map((t, i) => (
            <TechChip key={i} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        .tm {
          position: relative;
          background: transparent;
          border-block: 1px solid rgba(45,212,167,0.1);
          padding: 34px 0 34px;
        }

        .tm-orbits {
          position: relative;
          margin-inline: auto;
          width: min(100%, 1500px);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, black 9%, black 91%, transparent);
          mask-image: linear-gradient(to right, transparent, black 9%, black 91%, transparent);
        }

        .tm-track {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 14px;
          padding-right: 14px;
          animation: tm-scroll 30s linear infinite;
          will-change: transform;
        }
        .tm-track:hover { animation-play-state: paused; }

        @keyframes tm-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .tm-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--tc) 34%, transparent);
          background: linear-gradient(180deg, color-mix(in srgb, var(--brand) 12%, transparent), color-mix(in srgb, var(--brand) 3%, transparent));
          color: var(--text-body);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transition: transform 0.25s cubic-bezier(.22,.61,.36,1), box-shadow 0.25s, border-color 0.25s, color 0.25s;
        }
        .tm-chip:hover {
          transform: scale(1.1);
          border-color: var(--tc);
          color: var(--text-heading);
          box-shadow: 0 0 24px color-mix(in srgb, var(--tc) 55%, transparent);
        }

        .tm-chip-icon {
          display: flex;
          font-size: 15px;
          color: var(--tc);
          filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tc) 65%, transparent));
        }
        .tm-chip-pip {
          width: 6px;
          height: 6px;
          margin-left: 2px;
          border-radius: 50%;
          background: var(--tc);
          box-shadow: 0 0 8px var(--tc);
          animation: tm-ping 1.8s ease-in-out infinite;
        }
        @keyframes tm-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.65); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tm-track, .tm-chip-pip { animation: none !important; }
          .tm-chip { transition: none !important; }
        }
      `}</style>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Hero â€” museum-style fossil intro (video bg + GSAP chunk reveal)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ROLES = ['hero.roleFrontend', 'hero.roleAI', 'hero.role3D'];
const EASE_MF = CustomEase.create('mfEase', '0.52, 0.00, 0.48, 1.00');

const NAME_ROWS: { text: string; d: string }[][] = [
  [
    { text: 'MA', d: '0' },
    { text: 'DIH', d: '0.6' },
    { text: 'A', d: '1' },
  ],
  [
    { text: 'AY', d: '1.33' },
    { text: 'AZ', d: '1.6' },
  ],
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { t } = useTheme();

  useEffect(() => {
    const iv = setInterval(() => setRoleIndex((r) => (r + 1) % ROLES.length), 2600);
    return () => clearInterval(iv);
  }, []);

  useGSAP(
    () => {
      const chunk = (d: string) => `[data-mf="chunk"][data-d="${d}"]`;

      const setVisible = () =>
        gsap.set(
          '[data-mf="video"], [data-mf="circle"], [data-mf="chunk"], [data-mf="desc1"], [data-mf="desc2"], [data-mf="btntext"], [data-mf="scrollrow"], [data-mf="copy"]',
          { autoAlpha: 1, x: 0, y: 0, scale: 1 }
        );

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setVisible();
        gsap.set('[data-mf="video"]', { opacity: 0.55 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_MF } });
      tl.fromTo('[data-mf="video"]', { opacity: 0 }, { opacity: 0.55, duration: 1.6 }, 0)
        .fromTo('[data-mf="circle"]', { scale: 0.417, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.33 }, 0)
        .fromTo(chunk('0'), { x: 58, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.5 }, 0)
        .fromTo(chunk('0.6'), { x: -46, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.5 }, 0.6)
        .fromTo('[data-mf="desc1"]', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3 }, 0.6)
        .fromTo(chunk('1'), { x: 26, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.5 }, 1)
        .fromTo(chunk('1.33'), { x: -66, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.5 }, 1.33)
        .fromTo('[data-mf="desc2"]', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3 }, 1.5)
        .fromTo('[data-mf="btntext"]', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3 }, 1.5)
        .fromTo(chunk('1.6'), { x: 42, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.5 }, 1.6)
        .fromTo('[data-mf="scrollrow"]', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, stagger: 0.08 }, 2)
        .fromTo('[data-mf="copy"]', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3 }, 2);

      if (innerRef.current) {
        gsap.to(innerRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mf relative min-h-screen overflow-hidden">
      <div ref={innerRef} className="mf-inner">
        <video data-mf="video" className="mf-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="https://cdn.zajno.com/dev/codepen/fossil/fossil.mp4" type="video/mp4" />
        </video>

        <div className="mf-orb" aria-hidden="true"></div>
        <div className="mf-orb-label" aria-hidden="true">
          <span className="mf-orb-name">Madiha Ayaz</span>
          <span className="mf-orb-sub">Portfolio</span>
        </div>

        <h1 className="mf-name" aria-label="Madiha Ayaz">
          {NAME_ROWS.map((row, ri) => (
            <span className="mf-line" key={ri}>
              {row.map((c) => (
                <span key={c.text} data-mf="chunk" data-d={c.d} className="mf-chunk">
                  {c.text}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p data-mf="desc2" className="mf-desc2" role="status" aria-live="polite">
          {t(ROLES[roleIndex])}
        </p>

        <p data-mf="desc1" className="mf-desc1">
          {t('hero.badge')}
        </p>

        <p data-mf="copy" className="mf-copy" aria-hidden="true">
          Â© 2026
        </p>

        <div data-mf="scrollrow" className="mf-scroll-row">
          <span className="mf-scroll-label">{t('hero.explore')}</span>
          <span className="mf-scroll-stick" />
          <span className="mf-scroll-link">{t('hero.scroll')}</span>
        </div>

        <Link to="/projects" className="mf-btn" aria-label={t('hero.explore')}>
          <span data-mf="circle" className="mf-btn-circle">
            <span className="mf-btn-ring" />
          </span>
          <span data-mf="btntext" className="mf-btn-text">
            {t('hero.explore')}
          </span>
        </Link>
      </div>

      <style>{`
        .mf {
          background: #00161f;
          color: rgba(255, 255, 255, 0.9);
          font-family: Montserrat, Arial, sans-serif;
          min-height: 100vh;
        }

        .mf-inner {
          position: relative;
          box-sizing: border-box;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 1.4rem;
          padding: clamp(5.5rem, 12vh, 8rem) 1.5rem 3rem;
        }

        .mf-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          z-index: 0;
          pointer-events: none;
          animation: mfZoom 30s ease-in-out infinite alternate;
        }

        .mf-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 22, 31, 0.6), rgba(0, 22, 31, 0.12) 50%, rgba(0, 22, 31, 0.3));
          z-index: 0;
          pointer-events: none;
        }

        .mf-name {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: Oswald, Montserrat, Arial, sans-serif;
          font-weight: 600;
          font-size: clamp(2.2rem, 7vw, 6rem);
          line-height: 0.95;
          letter-spacing: 0.03em;
          color: #fff;
          text-transform: uppercase;
          filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.5));
        }

        .mf-line {
          display: block;
          overflow: hidden;
          white-space: nowrap;
        }

        .mf-line:last-child {
          padding-left: 0;
        }

        .mf-chunk {
          display: inline-block;
          margin-right: 0.12em;
          opacity: 0;
          will-change: transform;
          background: linear-gradient(100deg, #ffffff 35%, #5eead4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        .mf-desc2 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: clamp(0.8rem, 1.7vw, 1.05rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          opacity: 0;
        }

        .mf-desc1 {
          position: absolute;
          z-index: 1;
          top: clamp(4.6rem, 11vh, 7rem);
          right: clamp(1rem, 3vw, 2.5rem);
          margin: 0;
          font-size: clamp(0.7rem, 1.3vw, 0.9rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.66);
          opacity: 0;
        }

        .mf-copy {
          position: absolute;
          z-index: 1;
          right: clamp(1rem, 2.6vw, 2rem);
          bottom: 1.6rem;
          margin: 0;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.4);
          opacity: 0;
        }

        .mf-scroll-row {
          position: absolute;
          z-index: 1;
          left: clamp(1rem, 3.5vw, 3rem);
          bottom: clamp(4.8rem, 14vh, 7rem);
          display: flex;
          align-items: center;
          gap: 0.9rem;
          opacity: 0;
        }

        .mf-scroll-stick {
          width: 5.5rem;
          height: 1px;
          background: rgba(255, 255, 255, 0.35);
          display: block;
        }

        .mf-scroll-link {
          font-size: clamp(0.65rem, 1vw, 0.7rem);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }

        .mf-scroll-label {
          font-size: clamp(0.65rem, 1vw, 0.7rem);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
        }

        .mf-btn {
          position: absolute;
          z-index: 1;
          top: 50%;
          right: clamp(1rem, 3vw, 2.5rem);
          transform: translateY(-50%);
          width: clamp(112px, 12vw, 150px);
          height: clamp(112px, 12vw, 150px);
          display: grid;
          place-items: center;
          text-decoration: none;
        }

        .mf-btn-circle {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0;
        }

        .mf-btn-ring {
          position: absolute;
          inset: 0.7rem;
          border: 1px dashed rgba(255, 255, 255, 0.45);
          border-radius: 50%;
          animation: mfSpin 22s linear infinite;
        }

        .mf-btn-text {
          position: relative;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.95);
          padding: 0 1.6rem;
          opacity: 0;
        }

        @keyframes mfSpin {
          to { transform: rotate(360deg); }
        }

        .mf-orb {
          position: absolute;
          z-index: 1;
          top: clamp(8.5vh, 10vh, 10.5vh);
          right: clamp(1rem, 3vw, 2.5rem);
          width: clamp(170px, 20vw, 300px);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 32%, rgba(45, 212, 167, 0.4), rgba(14, 165, 233, 0.22) 46%, rgba(99, 102, 241, 0.14) 70%, transparent 78%);
          mix-blend-mode: screen;
          animation: mfOrb 16s ease-in-out infinite;
          pointer-events: none;
        }

        .mf-orb-label {
          position: absolute;
          z-index: 2;
          top: clamp(8.5vh, 10vh, 10.5vh);
          right: clamp(1rem, 3vw, 2.5rem);
          width: clamp(170px, 20vw, 300px);
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          pointer-events: none;
          text-align: center;
        }

        .mf-orb-name {
          font-family: Oswald, Montserrat, Arial, sans-serif;
          font-weight: 600;
          font-size: clamp(0.95rem, 1.8vw, 1.4rem);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
          white-space: nowrap;
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.55);
        }

        .mf-orb-sub {
          font-size: clamp(0.65rem, 1.1vw, 0.85rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(94, 234, 212, 0.95);
          white-space: nowrap;
          text-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);
        }

        @keyframes mfOrb {
          0%   { transform: translate3d(0, 0, 0) scale(1);    border-radius: 46% 54% 58% 42% / 52% 48% 52% 48%; }
          50%  { transform: translate3d(-1.5rem, -2rem, 0) scale(1.1); border-radius: 60% 40% 42% 58% / 46% 60% 40% 54%; }
          100% { transform: translate3d(1rem, -1rem, 0) scale(0.94); border-radius: 42% 58% 62% 38% / 56% 44% 58% 42%; }
        }

        @keyframes mfBob {
          0%, 100% { transform: translateY(-12%); }
          50%      { transform: translateY(-4%); }
        }

        @keyframes mfZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        @keyframes mfShimmer {
          to { background-position: -250% 0; }
        }

        @media (max-width: 760px) {
          .mf-btn {
            top: auto;
            bottom: clamp(5rem, 15vh, 8rem);
            transform: none;
          }

          .mf-copy {
            display: none;
          }

          .mf-scroll-row {
            bottom: 1.6rem;
          }

          .mf-orb,
          .mf-orb-label {
            top: clamp(19vh, 22vh, 24vh);
            width: clamp(120px, 38vw, 210px);
            right: 0.5rem;
          }

          .mf-line:last-child {
            padding-left: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mf-btn-ring,
          .mf-orb,
          .mf-video {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Home page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function HomePage() {
  const { t } = useTheme();

  return (
    <div className="theme-nexus relative min-h-screen text-body overflow-x-hidden">
      <Suspense fallback={null}>
        <NebulaBackground3D />
      </Suspense>

      {/* â•â•â• HERO â•â•â• */}
      <Hero />

      {/* â•â•â• TECH MARQUEE â•â•â• */}
      <TechMarquee />

      {/* â•â•â• STATS â•â•â• */}
      <StatsSection />

      {/* â•â•â• FEATURED PROJECTS â€” HOLOGRAPHIC SHOWCASE â•â•â• */}
      <section id="featured" className="relative z-10 px-4 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="fx-aurora absolute left-1/2 top-0 w-[900px] h-[640px] rounded-full" style={{ background: `radial-gradient(ellipse, ${NX.teal}16, transparent 62%)` }} />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={t("feat.eyebrow")}
            eyebrowIcon={<IconSpark size={14} />}
            title={<>{t("feat.title")}</>}
            subtitle={t("feat.sub")}
          />
          <FeaturedShowcase />
        </div>
      </section>

      {/* â•â•â• EARTH / NETWORK â€” SPINNING ORBIT â•â•â• */}
      <section className="relative z-10 py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 55%, ${NX.teal}0f 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">
          <SectionHeading
            eyebrow={t("earth.eyebrow")}
            eyebrowIcon={<IconSpark size={14} />}
            title={<>{t("earth.title")}</>}
            subtitle={t("earth.sub")}
          />

          <Reveal>
            <SpinningEarth size={520} />
          </Reveal>
        </div>
      </section>

      {/* â•â•â• AI POWEEED SHOWCASE â•â•â• */}
      <AnimatedSection>
        <AIShowcase />
      </AnimatedSection>

      {/* â•â•â• CTA â•â•â• */}
      <section className="relative z-10 px-4 py-24 md:py-32 text-center">
        <Reveal>
          <div className="relative mb-10 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Emblem3D className="w-28 h-28 md:w-36 md:h-36" />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="max-w-3xl mx-auto p-12 rounded-3xl glass-strong relative overflow-hidden"
            style={{
              background:
                `linear-gradient(140deg, ${NX.teal}14 0%, rgba(255,255,255,0.02) 45%, ${NX.violet}14 100%)`,
            }}
          >
            {/* decorative glow */}
            <motion.div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${NX.teal}2a, transparent 70%)` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">
              <div
                className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${NX.teal}33, ${NX.violet}33)`,
                  border: `1px solid ${NX.teal}44`,
                }}
              >
                <IconCode size={22} style={{ color: NX.tealLight }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gradient">
                {t("section.ctaTitle")}
              </h2>
              <p className="text-body text-lg mb-8">
                {t("section.ctaSub")}
              </p>
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 px-9 py-3.5 font-semibold rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{
                  color: '#ffffff',
                  boxShadow: `0 10px 40px rgba(13,148,136,0.35), inset 0 1px 0 rgba(255,255,255,0.25)`,
                }}
              >
                <span
                  className="absolute inset-0 bg-[length:200%_100%] animate-gradient-x"
                  style={{ backgroundImage: `linear-gradient(120deg, #0f766e, ${NX.teal}, ${NX.violet}, ${NX.tealDark})` }}
                />
                <span className="relative">{t("section.ctaBtn")}</span>
                <IconArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}