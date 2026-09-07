import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ============================================================
   Scroll progress bar pinned to the top of the page.
   ============================================================ */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.7), 0 0 24px rgba(236, 72, 153, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

/* ============================================================
   Floating "scroll to top" arrow that appears after 400px.
   ============================================================ */
export function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
          }}
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Cosmic dust - 40 absolutely-positioned sparkles that drift
   vertically across the page, creating a subtle parallax of
   particles in front of the sections.
   ============================================================ */
export function CosmicDust() {
  const dust = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 20,
      hue: ['#a78bfa', '#f9a8d4', '#67e8f9', '#fcd34d', '#86efac'][i % 5],
    }))
  ).current;
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {dust.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: d.hue,
            boxShadow: `0 0 ${d.size * 4}px ${d.hue}`,
          }}
          animate={{
            y: [0, -40, 0, 40, 0],
            opacity: [0.2, 0.8, 0.4, 0.7, 0.2],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   Loading screen with progress bar shown on initial mount.
   ============================================================ */
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const pct = Math.min(100, ((t - start) / 1400) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a0a1e 50%, #000 100%)' }}
    >
      {/* Spinning galaxy logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-8"
        style={{ filter: 'drop-shadow(0 0 30px #a855f7)' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r="30" fill="none" stroke="url(#loadGrad)" strokeWidth="3" strokeDasharray="60 130" strokeLinecap="round" />
        </svg>
      </motion.div>
      <h1 className="text-3xl font-black mb-2 tracking-wider" style={{ background: 'linear-gradient(90deg, #a78bfa, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Loading Universe
      </h1>
      <p className="text-slate-400 text-sm mb-8">{Math.round(progress)}%</p>
      <div className="w-64 h-1 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899, #06b6d4)' }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

/* ============================================================
   Animated counter - counts up to a target number when in view.
   ============================================================ */
export function AnimatedCounter({ value, suffix = '', duration = 1.6 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ============================================================
   SVG wave divider used between sections.
   ============================================================ */
export function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden leading-[0]" style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg
        className="relative block w-full h-[60px] md:h-[100px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,40 C200,90 400,10 600,50 C800,90 1000,10 1200,50 L1200,120 L0,120 Z"
          fill="url(#waveGrad)"
          animate={{
            d: [
              'M0,40 C200,90 400,10 600,50 C800,90 1000,10 1200,50 L1200,120 L0,120 Z',
              'M0,60 C200,20 400,90 600,40 C800,10 1000,80 1200,30 L1200,120 L0,120 Z',
              'M0,40 C200,90 400,10 600,50 C800,90 1000,10 1200,50 L1200,120 L0,120 Z',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   Custom magnetic cursor halo (a soft glow that follows the
   mouse and grows over interactive elements).
   ============================================================ */
export function CursorHalo() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.closest('a, button, [data-hover]');
      setHover(Boolean(isInteractive));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);
  return (
    <motion.div
      className="pointer-events-none fixed z-[70] rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        width: hover ? 60 : 30,
        height: hover ? 60 : 30,
        x: '-50%',
        y: '-50%',
        background: hover
          ? 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)',
        mixBlendMode: 'screen',
        transition: 'width 0.25s, height 0.25s, background 0.25s',
      }}
      animate={{ x: pos.x - (hover ? 30 : 15), y: pos.y - (hover ? 30 : 15) }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.5 }}
    />
  );
}