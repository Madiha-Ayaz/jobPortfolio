import { useEffect, useRef, useState, useCallback } from 'react';
import { Project } from '@/lib/data';
import { useTheme } from '@/context/ThemeContext';

/* ────────────────────────────────────────────────────────────────
   Premium 3D coverflow for portfolio projects.
   Port of the "mzaCarousel" concept, built on real project data:
   drag, tilt, keyboard, autoplay + progress, pagination dots, and
   per-card parallax. Falls back to a flat translate/scale layout
   when the browser can't do preserve-3d.
──────────────────────────────────────────────────────────────── */

const ACCENTS = [
  { strong: '#2dd4a7', accent: '#9ef7d2' },
  { strong: '#8b5cf6', accent: '#c4b5fd' },
  { strong: '#22d3ee', accent: '#a5f3fc' },
  { strong: '#34d399', accent: '#a7f3d0' },
  { strong: '#e879f9', accent: '#f5d0fe' },
  { strong: '#fbbf24', accent: '#fde68a' },
];

interface Breakpoint {
  mq: string;
  gap: number;
  peek: number;
  rotateY: number;
  zDepth: number;
  scaleDrop: number;
  activeLeftBias: number;
}

const BREAKPOINTS: Breakpoint[] = [
  { mq: '(max-width: 1200px)', gap: 24, peek: 0.11, rotateY: 26, zDepth: 110, scaleDrop: 0.08, activeLeftBias: 0.1 },
  { mq: '(max-width: 1000px)', gap: 18, peek: 0.08, rotateY: 20, zDepth: 80, scaleDrop: 0.07, activeLeftBias: 0.09 },
  { mq: '(max-width: 768px)', gap: 14, peek: 0.05, rotateY: 14, zDepth: 60, scaleDrop: 0.06, activeLeftBias: 0.08 },
  { mq: '(max-width: 640px)', gap: 12, peek: 0.03, rotateY: 10, zDepth: 46, scaleDrop: 0.055, activeLeftBias: 0.06 },
  { mq: '(max-width: 480px)', gap: 10, peek: 0.02, rotateY: 8, zDepth: 38, scaleDrop: 0.06, activeLeftBias: 0.04 },
  { mq: '(max-width: 360px)', gap: 8, peek: 0.01, rotateY: 6, zDepth: 30, scaleDrop: 0.07, activeLeftBias: 0.02 },
];

const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

interface Props {
  projects: Project[];
}

export default function ProjectCoverflow({ projects }: Props) {
  const { t } = useTheme();
  const n = projects.length;

  const nRef = useRef(n);
  nRef.current = n;

  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const dotsRef = useRef<HTMLButtonElement[]>([]);

  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  const S = useRef({
    index: 0,
    pos: 0,
    slideW: 820,
    gap: 26,
    peek: 0.14,
    rotateY: 30,
    zDepth: 130,
    scaleDrop: 0.09,
    blurMax: 1.8,
    activeLeftBias: 0.12,
    interval: 5200,
    transitionMs: 840,
    dragging: false,
    pointerId: null as number | null,
    x0: 0,
    v: 0,
    t0: 0,
    animating: false,
    hovering: false,
    startTime: 0,
    pausedAt: 0,
    rafId: 0,
    supports3D: true,
    reduced: false,
  }).current;

  const mod = useCallback((i: number) => ((i % n) + n) % n, [n]);

  const nearest = useCallback(
    (from: number, target: number) => {
      let d = target - Math.round(from);
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      return Math.round(from) + d;
    },
    [n],
  );

  const renderProgress = useCallback((p: number) => {
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
  }, []);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const view = viewportRef.current;
    const pag = paginationRef.current;
    if (!root || !view || !pag) return;
    const vrect = view.getBoundingClientRect();
    const rrect = root.getBoundingClientRect();
    const prect = pag.getBoundingClientRect();
    const bottomGap = Math.max(12, Math.round(rrect.bottom - prect.bottom));
    const pagSpace = prect.height + bottomGap;
    S.slideW = Math.min(860, vrect.width * (1 - S.peek * 2));
    root.style.setProperty('--pcf-slideW', `${S.slideW}px`);
    root.style.setProperty('--pcf-pagH', `${pagSpace}px`);
    root.style.setProperty(
      '--pcf-cardH',
      `${Math.max(300, Math.min(600, Math.round(vrect.height - pagSpace)))}px`,
    );
  }, [S]);

  const render = useCallback(
    (markActive: boolean) => {
      const root = rootRef.current;
      const span = S.slideW + S.gap;
      const tiltX = parseFloat(root?.style.getPropertyValue('--pcf-tiltX') ?? '0') || 0;
      const tiltY = parseFloat(root?.style.getPropertyValue('--pcf-tiltY') ?? '0') || 0;

      for (let i = 0; i < n; i++) {
        let d = i - S.pos;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        const el = slideRefs.current[i];
        if (!el) continue;

        const weight = Math.max(0, 1 - Math.abs(d) * 2);
        const biasActive = -S.slideW * S.activeLeftBias * weight;
        const tx = d * span + biasActive;
        const depth = -Math.abs(d) * S.zDepth;
        const rot = -d * S.rotateY;
        const scale = 1 - Math.min(Math.abs(d) * S.scaleDrop, 0.42);
        const blur = Math.min(Math.abs(d) * S.blurMax, S.blurMax);
        const z = Math.round(1000 - Math.abs(d) * 10);

        el.style.transform = S.supports3D
          ? `translate3d(${tx}px,-50%,${depth}px) rotateY(${rot}deg) scale(${scale})`
          : `translate(${tx}px,-50%) scale(${scale})`;
        el.style.filter = S.supports3D ? `blur(${blur}px)` : 'none';
        el.style.zIndex = String(z);

        if (markActive) el.dataset.state = mod(Math.round(S.index)) === i ? 'active' : 'rest';

        const card = el.querySelector('.pcf-card') as HTMLElement | null;
        if (!card) continue;
        const parBase = Math.max(-1, Math.min(1, -d));
        const parX = parBase * 44 + tiltY * 2.0;
        const parY = tiltX * -1.4;
        const bgX = parBase * -60 + tiltY * -2.2;
        card.style.setProperty('--pcfX', `${parX.toFixed(2)}px`);
        card.style.setProperty('--pcfY', `${parY.toFixed(2)}px`);
        card.style.setProperty('--pcfBgX', `${bgX.toFixed(2)}px`);
        card.style.setProperty('--pcfBgY', `${(parY * 0.35).toFixed(2)}px`);
      }

      const a = mod(Math.round(S.pos));
      dotsRef.current.forEach((dot, i) => {
        dot.setAttribute('aria-selected', i === a ? 'true' : 'false');
      });
    },
    [n, S, mod],
  );

  const startCycle = useCallback(() => {
    S.startTime = performance.now();
    renderProgress(0);
  }, [S, renderProgress]);

  const afterSnap = useCallback(
    (i: number) => {
      S.index = mod(Math.round(S.pos));
      S.pos = S.index;
      S.animating = false;
      render(true);
      setActive(S.index);
      startCycle();
      void i;
    },
    [S, mod, render, startCycle],
  );

  const goTo = useCallback(
    (i: number, animate = true) => {
      if (n === 0) return;
      const start = S.pos;
      const end = nearest(start, i);
      const dur = animate && !S.reduced ? S.transitionMs : 0;
      const t0 = performance.now();
      S.animating = true;

      if (dur === 0) {
        S.pos = end;
        render(false);
        afterSnap(i);
        return;
      }

      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const p = dur ? easeOutQuart(t) : 1;
        S.pos = start + (end - start) * p;
        render(false);
        if (t < 1) requestAnimationFrame(step);
        else afterSnap(i);
      };
      requestAnimationFrame(step);
    },
    [n, S, nearest, render, afterSnap],
  );

  const prev = useCallback(() => {
    goTo(mod(S.index - 1));
  }, [goTo, mod, n, S]);

  const next = useCallback(() => {
    goTo(mod(S.index + 1));
  }, [goTo, mod, n, S]);

  useEffect(() => {
    const root = rootRef.current;
    const view = viewportRef.current;
    const pag = paginationRef.current;
    if (!root || !view || !pag || n === 0) return;

    S.supports3D = typeof CSS !== 'undefined' && !!CSS.supports?.('transform-style', 'preserve-3d');
    S.reduced = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // ── Dots (imperative, mirrors the original) ──
    pag.innerHTML = '';
    dotsRef.current = Array.from({ length: n }, (_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pcf-dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      pag.appendChild(b);
      return b;
    });

    // ── Init ──
    measure();
    goTo(0, false);
    setReady(true);
    if (!S.reduced) startCycle();

    // ── Drag + tilt ──
    const onDragStart = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      S.dragging = true;
      S.pointerId = e.pointerId;
      try {
        view.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      S.x0 = e.clientX;
      S.t0 = performance.now();
      S.v = 0;
      S.pausedAt = performance.now();
      root.dataset.dragging = 'true';
    };
    const onDragMove = (e: PointerEvent) => {
      if (!S.dragging || e.pointerId !== S.pointerId) return;
      const dx = e.clientX - S.x0;
      const dt = Math.max(16, performance.now() - S.t0);
      S.v = dx / dt;
      S.pos = mod(S.index - dx / (S.slideW + S.gap));
      render(false);
    };
    const onDragEnd = (e: PointerEvent) => {
      if (!S.dragging || e.pointerId !== S.pointerId) return;
      S.dragging = false;
      delete root.dataset.dragging;
      try {
        if (S.pointerId != null) view.releasePointerCapture(S.pointerId);
      } catch {
        /* ignore */
      }
      S.pointerId = null;
      if (S.pausedAt) {
        S.startTime += performance.now() - S.pausedAt;
        S.pausedAt = 0;
      }
      const threshold = 0.18;
      const v = S.v;
      let target = Math.round(S.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0));
      goTo(mod(target));
      void e;
    };
    const onTilt = (e: PointerEvent) => {
      const r = view.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      root.style.setProperty('--pcf-tiltX', (my * -6).toFixed(3));
      root.style.setProperty('--pcf-tiltY', (mx * 6).toFixed(3));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const onEnter = () => {
      S.hovering = true;
      S.pausedAt = performance.now();
    };
    const onLeave = () => {
      if (S.pausedAt) {
        S.startTime += performance.now() - S.pausedAt;
        S.pausedAt = 0;
      }
      S.hovering = false;
    };

    view.addEventListener('pointerdown', onDragStart);
    view.addEventListener('pointermove', onDragMove);
    view.addEventListener('pointermove', onTilt);
    view.addEventListener('pointerup', onDragEnd);
    view.addEventListener('pointercancel', onDragEnd);
    root.addEventListener('keydown', onKey);
    root.addEventListener('mouseenter', onEnter);
    root.addEventListener('mouseleave', onLeave);

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      measure();
      render(true);
    });
    ro.observe(view);

    // ── Breakpoints ──
    let bpCleanups: Array<() => void> = [];
    BREAKPOINTS.forEach((bp) => {
      const mq = window.matchMedia(bp.mq);
      const apply = () => {
        Object.keys(bp).forEach((k) => {
          if (k !== 'mq') (S as unknown as Record<string, unknown>)[k] = (bp as unknown as Record<string, unknown>)[k];
        });
        measure();
        render(true);
      };
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', apply);
      else mq.addListener(apply);
      if (mq.matches) apply();
      bpCleanups.push(() => {
        if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', apply);
        else mq.removeListener(apply);
      });
    });

    // ── Autoplay loop ──
    const loop = (t: number) => {
      if (!S.dragging && !S.hovering && !S.animating && !S.reduced) {
        const elapsed = t - S.startTime;
        const p = Math.min(1, elapsed / S.interval);
        renderProgress(p);
        if (elapsed >= S.interval) next();
      }
      S.rafId = requestAnimationFrame(loop);
    };
    S.rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(S.rafId);
      ro.disconnect();
      bpCleanups.forEach((fn) => fn());
      view.removeEventListener('pointerdown', onDragStart);
      view.removeEventListener('pointermove', onDragMove);
      view.removeEventListener('pointermove', onTilt);
      view.removeEventListener('pointerup', onDragEnd);
      view.removeEventListener('pointercancel', onDragEnd);
      root.removeEventListener('keydown', onKey);
      root.removeEventListener('mouseenter', onEnter);
      root.removeEventListener('mouseleave', onLeave);
      pag.innerHTML = '';
    };
  }, [n, S, goTo, next, prev, measure, render, renderProgress, startCycle]);

  if (n === 0) return null;

  return (
    <div
      ref={rootRef}
      className="pcf"
      id="pcf"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <div className="pcf-viewport" ref={viewportRef} role="group" aria-roledescription="carousel" tabIndex={0}>
        <div className="pcf-track" ref={trackRef}>
          {projects.map((project, i) => {
            const acc = ACCENTS[i % ACCENTS.length];
            const bg = project.imageUrl && project.imageUrl.trim()
              ? `url("${project.imageUrl}")`
              : `linear-gradient(140deg, ${acc.strong}55 0%, ${acc.strong}22 45%, #0a0d12 100%)`;
            const kicker = project.tags[0] ?? 'Featured Project';
            const hasLive = project.liveUrl && project.liveUrl !== '#';
            const hasRepo = project.repoUrl && project.repoUrl !== '#';
            const cardStyle = {
              '--pcf-bg': bg,
              '--pcf-accent': acc.accent,
              '--pcf-strong': acc.strong,
            } as React.CSSProperties;

            return (
              <article
                key={project.id}
                className="pcf-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
              >
                <div className="pcf-card" style={cardStyle}>
                  <header className="pcf-head pcf-par-1">
                    <span className="pcf-index">Project {String(i + 1).padStart(2, '0')}</span>
                    <h3 className="pcf-title">{project.title}</h3>
                    <p className="pcf-kicker">{kicker}</p>
                  </header>

                  <p className="pcf-text pcf-par-2">{project.description}</p>

                  <footer className="pcf-actions pcf-par-3">
                    {hasLive && (
                      <a className="pcf-btn" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        {t('projects.live')}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    )}
                    {hasRepo && (
                      <a className="pcf-btn pcf-btn-ghost" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        {t('projects.github')}
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    )}
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="pcf-controls" aria-label="Controls">
        <button className="pcf-prev" aria-label="Previous project" type="button" onClick={prev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button className="pcf-next" aria-label="Next project" type="button" onClick={next}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="pcf-pagination" role="tablist" aria-label="Slide navigation" ref={paginationRef} />

      <div className="pcf-progress" aria-hidden="true">
        <span className="pcf-progressBar" ref={progressRef} />
      </div>

      <span className="pcf-count" aria-hidden="true">
        {ready && (
          <>
            <span className="pcf-count-on">{String(active + 1).padStart(2, '0')}</span> /{' '}
            {String(n).padStart(2, '0')}
          </>
        )}
      </span>

      <style>{`
        .pcf {
          position: relative;
          height: clamp(460px, 70vh, 660px);
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 18px;
          overflow: hidden;
          container-type: layout paint;
          touch-action: none;
          --pcf-slideW: min(880px, 92vw);
          --pcf-pagH: 62px;
          --pcf-cardH: clamp(400px, 60vh, 600px);
          color: #e7ecf2;
        }

        .pcf-viewport {
          position: relative;
          outline: none;
          overflow: hidden;
          height: 100%;
          cursor: grab;
        }
        .pcf[dragging="true"] .pcf-viewport { cursor: grabbing; }

        .pcf-track {
          position: relative;
          height: calc(100% - var(--pcf-pagH) - max(env(safe-area-inset-bottom), 12px));
          transform-style: preserve-3d;
          perspective: 1200px;
          overflow: hidden;
        }

        .pcf-slide {
          position: absolute;
          top: calc(50% + 5px);
          left: 50%;
          width: var(--pcf-slideW);
          height: min(var(--pcf-cardH), calc(100% - 56px));
          transform-style: preserve-3d;
          display: grid;
          place-items: center;
          border-radius: 22px;
          overflow: hidden;
          will-change: transform, filter;
        }

        .pcf-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          box-shadow: 0 20px 50px rgba(0,0,0,0.45);
          backdrop-filter: saturate(120%) blur(4px);
          transform: translateZ(0);
          cursor: grab;
          border: 1px solid color-mix(in srgb, var(--pcf-accent, #9ef7d2) 18%, transparent);
        }

        .pcf-card::before {
          content: "";
          position: absolute;
          inset: -2%;
          background-image: var(--pcf-bg);
          background-size: cover;
          background-position: center;
          filter: contrast(1.02) saturate(1.06) brightness(0.78);
          transform: translate3d(var(--pcfBgX,0px), var(--pcfBgY,0px), 0) translateZ(-60px) scale(1.16);
          transition: transform 800ms cubic-bezier(0.2,0.7,0,1), filter 800ms cubic-bezier(0.2,0.7,0,1);
        }

        .pcf-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(2,4,8,0.35), rgba(2,4,8,0.55) 45%, rgba(2,4,8,0.28) 100%),
            radial-gradient(120% 60% at 50% 120%, color-mix(in srgb, var(--pcf-strong, #2dd4a7) 16%, transparent), transparent 60%);
        }

        .pcf-head {
          position: absolute;
          inset: 22px auto auto 24px;
          z-index: 2;
          max-width: 78%;
        }
        .pcf-index {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--pcf-accent, #9ef7d2);
          border: 1px solid color-mix(in srgb, var(--pcf-accent, #9ef7d2) 40%, transparent);
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
        }
        .pcf-title {
          margin: 0.7rem 0 0;
          font-weight: 800;
          letter-spacing: 0.2px;
          font-size: clamp(22px, 3.1vw, 38px);
          line-height: 110%;
          color: #fff;
          text-shadow: 0 2px 18px rgba(0,0,0,0.7);
          cursor: text;
        }
        .pcf-kicker {
          margin: 0.4rem 0 0;
          color: var(--pcf-accent, #9ef7d2);
          font-size: clamp(11px, 1.6vw, 14px);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-shadow: 0 1px 10px rgba(0,0,0,0.7);
          cursor: text;
        }

        .pcf-text {
          position: absolute;
          inset: auto 24px 92px 24px;
          z-index: 2;
          max-width: 60ch;
          margin: 0;
          padding: 16px 20px;
          color: #dbe4ee;
          font-size: clamp(13px, 1.4vw, 15px);
          line-height: 1.55;
          text-wrap: balance;
          text-align: left;
          background: rgba(0,0,0,0.42);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          cursor: text;
        }

        .pcf-actions {
          position: absolute;
          inset: auto auto 20px 24px;
          z-index: 2;
          display: flex;
          gap: 10px;
        }
        .pcf-btn {
          appearance: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid color-mix(in srgb, var(--pcf-accent, #9ef7d2) 65%, transparent);
          border-radius: 14px;
          padding: 12px 18px;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.02em;
          color: #0b0e13;
          text-decoration: none;
          background-image: linear-gradient(180deg, var(--pcf-accent, #9ef7d2), color-mix(in srgb, var(--pcf-accent, #9ef7d2) 78%, #0b0e13));
          box-shadow: 0 3px 18px color-mix(in srgb, var(--pcf-strong, #2dd4a7) 55%, transparent);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .pcf-btn svg { width: 15px; height: 15px; }
        .pcf-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .pcf-btn:active { transform: translateY(1px); box-shadow: 0 3px 12px rgba(0,0,0,0.3); }
        .pcf-btn-ghost {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(6px);
          color: var(--pcf-accent, #9ef7d2);
          border-color: color-mix(in srgb, var(--pcf-accent, #9ef7d2) 35%, transparent);
          box-shadow: none;
        }
        .pcf-btn-ghost:hover { background: rgba(255,255,255,0.12); }

        .pcf-controls {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }
        .pcf-prev, .pcf-next {
          pointer-events: auto;
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(10,14,20,0.55);
          backdrop-filter: blur(8px);
          color: #e7ecf2;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
        }
        .pcf-prev { margin-left: -6px; }
        .pcf-next { margin-right: -6px; }
        .pcf-prev svg, .pcf-next svg { width: 20px; height: 20px; }
        .pcf-prev:hover, .pcf-next:hover {
          background: rgba(255,255,255,0.14);
          color: #fff;
          transform: scale(1.08);
        }
        .pcf-prev:active, .pcf-next:active { transform: scale(0.98); }

        .pcf-pagination {
          position: absolute;
          left: 0;
          right: 0;
          bottom: max(24px, env(safe-area-inset-bottom));
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
        }
        .pcf-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
          border: 0;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, width 0.25s ease;
        }
        .pcf-dot[aria-selected="true"] {
          width: 26px;
          background: linear-gradient(90deg, var(--pcf-strong, #2dd4a7), var(--pcf-accent, #9ef7d2));
          box-shadow: 0 0 14px color-mix(in srgb, var(--pcf-strong, #2dd4a7) 60%, transparent);
        }

        .pcf-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .pcf-progressBar {
          display: block;
          height: 100%;
          width: 100%;
          transform-origin: left;
          transform: scaleX(0);
          will-change: transform;
          background: linear-gradient(90deg, var(--pcf-strong, #2dd4a7), var(--pcf-accent, #9ef7d2));
        }

        .pcf-count {
          position: absolute;
          right: 22px;
          bottom: 22px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(231,236,242,0.5);
          font-variant-numeric: tabular-nums;
          pointer-events: none;
        }
        .pcf-count-on { color: rgba(231,236,242,0.9); }

        .pcf-slide[data-state="active"] .pcf-card::before {
          filter: contrast(1.06) saturate(1.14) brightness(0.92);
        }
        .pcf-slide[data-state="active"] .pcf-card {
          box-shadow: 0 30px 70px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.07) inset,
            0 0 44px color-mix(in srgb, var(--pcf-strong, #2dd4a7) 22%, transparent);
          border-color: color-mix(in srgb, var(--pcf-accent, #9ef7d2) 42%, transparent);
        }
        .pcf-slide:not([data-state="active"]) .pcf-title { color: rgba(255,255,255,0.85); }

        .pcf-par-1, .pcf-par-2, .pcf-par-3 {
          will-change: transform;
          transition: transform 400ms cubic-bezier(0.2,0.7,0,1);
        }
        .pcf-par-1 { transform: translate3d(calc(var(--pcfX,0px) * 0.35), calc(var(--pcfY,0px) * 0.35), 0); }
        .pcf-par-2 { transform: translate3d(calc(var(--pcfX,0px) * 0.22), calc(var(--pcfY,0px) * 0.22), 0); }
        .pcf-par-3 { transform: translate3d(calc(var(--pcfX,0px) * 0.15), calc(var(--pcfY,0px) * 0.15), 0); }

        @media (max-width: 1000px) {
          .pcf-title { font-size: clamp(20px, 5.2vw, 30px); }
          .pcf-kicker { font-size: clamp(11px, 3.4vw, 13px); }
          .pcf-text { inset: auto 16px 92px 16px; padding: 13px 16px; }
          .pcf-actions { left: 16px; bottom: 18px; gap: 8px; }
          .pcf-head { left: 16px; top: 16px; right: 16px; }
          .pcf-btn { padding: 11px 16px; font-size: 12.5px; }
          .pcf-prev, .pcf-next { width: 42px; height: 42px; }
          .pcf-prev svg, .pcf-next svg { width: 18px; height: 18px; }
        }
        @media (max-width: 640px) {
          .pcf { height: clamp(440px, 62vh, 580px); padding: 0 10px; }
          .pcf-title { font-size: clamp(18px, 4.6vw, 26px); }
          .pcf-kicker { font-size: clamp(10px, 3.2vw, 12px); }
          .pcf-text {
            inset: auto 12px 84px 12px;
            padding: 12px 14px;
            font-size: clamp(12px, 3.4vw, 13.5px);
            line-height: 1.5;
          }
          .pcf-actions { left: 12px; bottom: 16px; right: 12px; }
          .pcf-btn {
            flex: 1;
            justify-content: center;
            padding: 11px 10px;
            font-size: 12px;
            gap: 6px;
          }
          .pcf-btn svg { width: 13px; height: 13px; }
          .pcf-head { left: 12px; top: 14px; right: 12px; max-width: 100%; }
          .pcf-index { font-size: 9px; padding: 3px 8px; letter-spacing: 0.22em; }
          .pcf-prev, .pcf-next { width: 38px; height: 38px; }
          .pcf-prev { margin-left: 2px; }
          .pcf-next { margin-right: 2px; }
          .pcf-pagination { gap: 8px; }
          .pcf-dot { width: 8px; height: 8px; }
          .pcf-dot[aria-selected="true"] { width: 22px; }
        }
        @media (max-width: 400px) {
          .pcf { height: clamp(420px, 58vh, 540px); }
          .pcf-title { font-size: clamp(17px, 5vw, 22px); }
          .pcf-kicker { letter-spacing: 0.08em; }
          .pcf-text {
            -webkit-line-clamp: 3;
            inset: auto 10px 78px 10px;
            padding: 11px 13px;
            font-size: clamp(11.5px, 3.6vw, 13px);
          }
          .pcf-actions { left: 10px; right: 10px; bottom: 14px; }
          .pcf-head { left: 10px; right: 10px; }
          .pcf-prev, .pcf-next { width: 34px; height: 34px; }
          .pcf-prev svg, .pcf-next svg { width: 16px; height: 16px; }
          .pcf-btn { padding: 10px 8px; font-size: 11.5px; }
        }
        @media (max-width: 560px) {
          .pcf-count { display: none; }
          .pcf-text { max-width: 100%; }
        }
        @media (max-height: 400px) {
          .pcf-text { display: none; }
        }
        @media (max-height: 260px) {
          .pcf-kicker { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pcf-progressBar { transition: none; }
          .pcf-par-1, .pcf-par-2, .pcf-par-3 { transition: none; }
          .pcf-card::before { transition: none; }
        }
      `}</style>
    </div>
  );
}