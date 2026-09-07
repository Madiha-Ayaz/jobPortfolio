'use client';

import { useEffect, useRef } from 'react';

interface ContactFormMascotProps {
  success?: boolean;
}

const FACE_SCALE = 0.78;

function burstAtElement(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  void import('canvas-confetti').then((m) => {
    const c = m.default;
    c({ particleCount: 80, spread: 70, startVelocity: 38, origin: { x, y }, colors: ['#2dd4a7', '#e879f9', '#818cf8', '#f0abfc'] });
    c({ particleCount: 45, spread: 100, startVelocity: 22, decay: 0.9, scalar: 0.9, origin: { x, y }, colors: ['#2dd4a7', '#e879f9', '#fbbf24'] });
  });
}

export default function ContactFormMascot({ success }: ContactFormMascotProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mascotRef = useRef<HTMLDivElement | null>(null);
  const leftEyeRef = useRef<HTMLDivElement | null>(null);
  const rightEyeRef = useRef<HTMLDivElement | null>(null);
  const faceSvgRef = useRef<SVGSVGElement | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const form = root ? (root.closest('form') as HTMLFormElement) : null;
    const formEl = form as HTMLFormElement;
    if (
      !rootRef.current ||
      !trackRef.current ||
      !mascotRef.current ||
      !leftEyeRef.current ||
      !rightEyeRef.current ||
      !faceSvgRef.current ||
      !mouthRef.current ||
      !form
    )
      return;

    const track = trackRef.current as HTMLDivElement;
    const mascot = mascotRef.current as HTMLDivElement;
    const leftEye = leftEyeRef.current as HTMLDivElement;
    const rightEye = rightEyeRef.current as HTMLDivElement;
    const faceSvg = faceSvgRef.current as SVGSVGElement;
    const mouthPath = mouthRef.current as SVGPathElement;

    const EASE_SMOOTH = 'cubic-bezier(.22,.61,.36,1)';
    const EASE_BOUNCE = 'cubic-bezier(.34,1.56,.64,1)';
    const EYE_TOP_FROM_CHLOE = 95;
    const EYE_RADIUS = 22;
    const LEFT_BASE_X = -40;
    const RIGHT_BASE_X = 40;
    const maxMoveX = 16;
    const maxMoveY = 20;
    const sensitivity = 400;
    const leftScaleX = 0.95;
    const rightScaleX = 1.05;

    const fields = Array.from(formEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'));

    const state = {
      dragging: false,
      startPointerX: 0,
      startOffset: 0,
      offset: 0,
      prevOffset: 0,
      velocity: 0,
      lastTime: 0,
      maxOffset: 0,
    };

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
    const rubberBand = (over: number, limit = 120) => limit * (1 - 1 / (over / limit + 1));

    function computeMaxOffset() {
      const trackW = track.clientWidth;
      const mascotW = mascot.getBoundingClientRect().width;
      state.maxOffset = Math.max(0, trackW - mascotW);
      setOffset(clamp(state.offset, 0, state.maxOffset), false);
    }

    function setOffset(px: number, smooth = true) {
      state.offset = px;
      if (!smooth) mascot.style.transition = 'none';
      mascot.style.setProperty('--cfx', `${Math.round(px)}px`);
      if (!smooth) {
        mascot.getBoundingClientRect();
        mascot.style.transition = `transform 220ms ${EASE_SMOOTH}`;
      }
    }

    const measureCtx = document.createElement('canvas').getContext('2d');

    function getCaretPoint(input: HTMLInputElement | HTMLTextAreaElement) {
      if (!measureCtx) return { x: 0, y: 0 };
      const rect = input.getBoundingClientRect();
      const cs = getComputedStyle(input);
      measureCtx.font = `${cs.fontWeight || 400} ${cs.fontSize || '16px'} ${cs.fontFamily || 'Arial,sans-serif'}`;
      const selStart = input.selectionStart ?? input.value.length;
      const w = measureCtx.measureText(input.value.slice(0, selStart)).width;
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const innerW = rect.width - padL - padR;
      const x = rect.left + padL + Math.max(0, Math.min(w, innerW) - input.scrollLeft);
      const y = rect.top + rect.height / 2;
      return { x, y };
    }

    function ellipseClamp(dx: number, dy: number, rx: number, ry: number): [number, number] {
      const nx = dx / rx;
      const ny = dy / ry;
      const d = Math.hypot(nx, ny);
      if (d <= 1 || d === 0) return [dx, dy];
      return [(nx / d) * rx, (ny / d) * ry];
    }

    function eyeCenters() {
      const r = mascot.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + (EYE_TOP_FROM_CHLOE + EYE_RADIUS) * FACE_SCALE;
      const lBase = LEFT_BASE_X * FACE_SCALE;
      const rBase = RIGHT_BASE_X * FACE_SCALE;
      return {
        left: { x: cx + lBase, y: cy },
        right: { x: cx + rBase, y: cy },
      };
    }

    function lookAt(x: number, y: number) {
      const { left, right } = eyeCenters();

      function offset(ex: number, ey: number, multX = 1) {
        const dx = x - ex;
        const dy = y - ey;
        const dist = Math.hypot(dx, dy);
        const p = Math.min(1, dist / sensitivity);
        const ang = Math.atan2(dy, dx);
        let mx = Math.cos(ang) * maxMoveX * p * multX;
        let my = Math.sin(ang) * maxMoveY * p;
        [mx, my] = ellipseClamp(mx, my, maxMoveX, maxMoveY);
        return { mx, my };
      }

      const L = offset(left.x, left.y, leftScaleX);
      const R = offset(right.x, right.y, rightScaleX);

      leftEye.style.transform = `translateX(-50%) translateX(${LEFT_BASE_X}px) translate(${L.mx}px, ${L.my}px)`;
      rightEye.style.transform = `translateX(-50%) translateX(${RIGHT_BASE_X}px) translate(${R.mx}px, ${R.my}px)`;
    }

    function neutralEyes() {
      leftEye.style.transform = `translateX(-50%) translateX(${LEFT_BASE_X}px)`;
      rightEye.style.transform = `translateX(-50%) translateX(${RIGHT_BASE_X}px)`;
    }

    let lastPointer = { x: 0, y: 0 };
    const isField = (el: Element | null) => !!el && fields.includes(el as HTMLInputElement);

    function updateTracker(active: Element) {
      if (isField(active)) {
        const { x, y } = getCaretPoint(active as HTMLInputElement);
        lookAt(x, y);
      }
    }

    function updatePointer(e: PointerEvent) {
      lastPointer = { x: e.clientX, y: e.clientY };
      const active = document.activeElement;
      if (isField(active)) return;
      lookAt(lastPointer.x, lastPointer.y);
    }

    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      mascot.classList.add('cfm-dragging');
      state.dragging = true;
      mascot.setPointerCapture?.(e.pointerId);
      mascot.style.transition = 'none';
      state.startPointerX = e.clientX;
      state.startOffset = state.offset;
      state.prevOffset = state.offset;
      state.velocity = 0;
      state.lastTime = performance.now();
    }

    function onPointerMove(e: PointerEvent) {
      if (!state.dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - state.lastTime);
      const dx = e.clientX - state.startPointerX;

      let desired = state.startOffset + dx;
      if (desired < 0) {
        const over = -desired;
        desired = -rubberBand(over);
      } else if (desired > state.maxOffset) {
        const over = desired - state.maxOffset;
        desired = state.maxOffset + rubberBand(over);
      }

      state.velocity = (desired - state.prevOffset) / dt;
      state.prevOffset = desired;
      state.lastTime = now;
      setOffset(desired, true);
    }

    function onPointerUp() {
      if (!state.dragging) return;
      state.dragging = false;
      mascot.classList.remove('cfm-dragging');

      const current = state.offset;
      const clamped = clamp(current, 0, state.maxOffset);
      const distToClamp = Math.abs(current - clamped);

      if (current < 0 || current > state.maxOffset) {
        const dur = Math.min(600, 260 + distToClamp * 0.9);
        mascot.style.transition = `transform ${dur}ms ${EASE_BOUNCE}`;
        setOffset(clamped, true);
        return;
      }

      const inertia = state.velocity * 160;
      const projected = clamp(current + inertia, 0, state.maxOffset);
      const dur = Math.min(400, 180 + Math.abs(inertia) * 0.6);
      mascot.style.transition = `transform ${dur}ms ${EASE_SMOOTH}`;
      setOffset(projected, true);
    }

    const originalMouthD = mouthPath.getAttribute('d') || '';
    let mouthEllipse: SVGEllipseElement | null = null;

    function showError() {
      if (mouthEllipse) return;
      const b = mouthPath.getBBox();
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;

      const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      el.setAttribute('cx', cx.toFixed(2));
      el.setAttribute('cy', (cy + 5).toFixed(2));
      el.setAttribute('rx', '6');
      el.setAttribute('ry', '10');
      el.setAttribute('fill', '#e879f9');

      mouthPath.style.display = 'none';
      faceSvg.appendChild(el);
      mouthEllipse = el;
      root?.classList.add('cfm-has-error');
    }

    function clearError() {
      if (mouthEllipse) {
        mouthEllipse.remove();
        mouthEllipse = null;
      }
      mouthPath.setAttribute('d', originalMouthD);
      mouthPath.style.display = '';
      root?.classList.remove('cfm-has-error');
    }

    function onInvalid() {
      showError();
    }

    function onInput() {
      if (formEl.checkValidity()) clearError();
    }

    const onFocus = () => updateTracker(document.activeElement as Element);
    const onSelectionChange = () => updateTracker(document.activeElement as Element);

    mascot.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('pointermove', updatePointer);
    formEl.addEventListener('invalid', onInvalid, true);
    formEl.addEventListener('input', onInput, true);
    fields.forEach((f) => {
      f.addEventListener('focus', onFocus);
      f.addEventListener('click', onFocus);
      f.addEventListener('keyup', onSelectionChange);
    });
    document.addEventListener('selectionchange', onSelectionChange);

    computeMaxOffset();
    setOffset(Math.round(state.maxOffset / 2), false);
    neutralEyes();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('pointermove', updatePointer);
      formEl.removeEventListener('invalid', onInvalid, true);
      formEl.removeEventListener('input', onInput, true);
      fields.forEach((f) => {
        f.removeEventListener('focus', onFocus);
        f.removeEventListener('click', onFocus);
        f.removeEventListener('keyup', onSelectionChange);
      });
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, []);

  useEffect(() => {
    const mascot = mascotRef.current;
    if (!mascot) return;
    if (success) {
      mascot.classList.add('cfm-happy');
      burstAtElement(mascot);
    } else {
      mascot.classList.remove('cfm-happy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <div ref={rootRef} className="cfm">
      <div ref={trackRef} className="cfm-track">
        <div ref={mascotRef} className="cfm-mascot" aria-label="Drag left or right">
          <div ref={errorRef} className="cfm-error" aria-live="polite">
            <svg viewBox="0 0 500 500">
              <path id="cfm-curve" fill="transparent" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
              <text className="cfm-error-text" fill="white" width="500" textAnchor="middle">
                <textPath href="#cfm-curve" startOffset="50%">
                  Almost! Fill all the fields
                </textPath>
              </text>
            </svg>
          </div>

          <div className="cfm-face">
            <div className="cfm-eye-whites" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="118" height="57" fill="none">
                <ellipse cx="99" cy="28" fill="#fff" rx="19" ry="28" />
                <ellipse cx="19" cy="28" fill="#fff" rx="19" ry="28" />
              </svg>
            </div>

            <div ref={leftEyeRef} className="cfm-eyeball" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#cfm-left-grad)" />
                <circle cx="22" cy="11" r="6" fill="#FCF5F3" />
                <circle cx="25" cy="20" r="3" fill="#FCF5F3" />
                <defs>
                  <linearGradient id="cfm-left-grad" x1="0" x2="35" y1="17.5" y2="17.5" gradientUnits="userSpaceOnUse">
                    <stop offset=".317" stopColor="#e879f9" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div ref={rightEyeRef} className="cfm-eyeball cfm-eyeball--right" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#cfm-right-grad)" />
                <circle cx="23" cy="11" r="6" fill="#FCF5F3" />
                <circle cx="26" cy="20" r="3" fill="#FCF5F3" />
                <defs>
                  <linearGradient id="cfm-right-grad" x1="0" x2="35" y1="17.5" y2="17.5" gradientUnits="userSpaceOnUse">
                    <stop offset=".317" stopColor="#e879f9" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="cfm-mask">
              <svg ref={faceSvgRef} width="232" height="172" fill="none" viewBox="0 0 232 172" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cfm-face-grad" x1="117.999" x2="118.004" y1="0" y2="168" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7dd3fc" />
                    <stop offset=".25" stopColor="#818cf8" />
                    <stop offset=".5" stopColor="#a855f7" />
                    <stop offset=".78" stopColor="#c026d3" />
                    <stop offset="1" stopColor="#e879f9" />
                  </linearGradient>
                </defs>
                <path fill="url(#cfm-face-grad)" d="M115.972 0c18.723 0 36.111 5.717 50.512 15.501 8.836-12.564 25.962-16.522 39.52-8.694 14.349 8.284 19.264 26.631 10.98 40.98A29.875 29.875 0 0 1 201.197 61c3.096 9.1 4.775 18.853 4.775 29 0 49.706-40.294 78-90 78-49.705 0-90-28.294-90-78 0-11.353 2.103-22.215 5.939-32.218a29.86 29.86 0 0 1-12.888-11.994c-8.284-14.349-3.368-32.696 10.98-40.98 13.405-7.74 30.3-3.958 39.219 8.272C82.847 4.78 98.852 0 115.972 0ZM75.023 82.807c-10.493 0-19 12.536-19 28s8.507 28 19 28c10.494 0 19-12.536 19-28s-8.506-28-19-28Zm80 0c-10.493 0-19 12.536-19 28s8.507 28 19 28c10.494 0 19-12.536 19-28s-8.506-28-19-28Z" />
                <path fill="#e0e7ff" d="M115.023 43.807c40.87 0 74 29.001 74 64.776 0 35.775-33.131 55.224-74 55.224s-74-19.449-74-55.224c0-35.775 33.131-64.776 74-64.776Zm-40 39c-10.493 0-19 12.536-19 28s8.507 28 19 28c10.494 0 19-12.536 19-28s-8.506-28-19-28Zm80 0c-10.493 0-19 12.536-19 28s8.507 28 19 28c10.494 0 19-12.536 19-28s-8.506-28-19-28Z" />
                <path fill="#c026d3" d="M75.504 75.077c-2.605-.046-8.154 1.337-12.012 3.029-.954.418-.556 1.312.467 1.114 12.928-2.505 20.976 1.09 20.976 1.09.985.357 1.706-.947.879-1.591l-.349-.271c-2.507-2.534-6.355-3.308-9.962-3.371ZM151.051 75.077c2.605-.046 8.153 1.337 12.012 3.029.954.418.556 1.312-.467 1.114-12.928-2.505-20.976 1.09-20.976 1.09-.985.357-1.706-.947-.879-1.591l.348-.271c2.507-2.534 6.355-3.308 9.962-3.371Z" />
                <path stroke="#f5d0fe" strokeWidth="2" d="M115 45c40.442 0 73 28.789 73 64.04 0 17.605-8.098 31.049-21.242 40.128C153.58 158.271 135.296 163 115 163c-20.296 0-38.58-4.729-51.758-13.832C50.1 140.089 42 126.645 42 109.04 42 73.789 74.558 45 115 45Z" />
                <ellipse cx="155.023" cy="110.807" stroke="#c026d3" strokeWidth="2" rx="19" ry="28" />
                <ellipse cx="75.023" cy="110.807" stroke="#c026d3" strokeWidth="2" rx="19" ry="28" />
                <path className="cfm-nose" fill="#c026d3" stroke="#c026d3" d="M118 121.5c1.644 0 3.036.174 4.005.697.473.256.839.591 1.09 1.029.251.439.405 1.014.405 1.774 0 .663-.296 1.333-.804 1.991-.506.657-1.196 1.265-1.912 1.79a4.696 4.696 0 0 1-5.568 0c-.716-.525-1.406-1.133-1.912-1.79-.508-.658-.804-1.328-.804-1.991 0-.76.154-1.335.405-1.774.251-.438.617-.773 1.09-1.029.969-.523 2.361-.697 4.005-.697Z" />
                <ellipse className="cfm-nose-light" cx="120" cy="124.501" fill="#FCF5F3" rx="2" ry="1.5" />
                <path
                  ref={mouthRef}
                  className="cfm-mouth"
                  stroke="#c026d3"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M130.283 141.002c-3.315 2.561-7.811 4-12.5 4-4.688 0-9.185-1.439-12.5-4M132.863 141.968l-.879-.424a5.134 5.134 0 0 1-2.467-2.543M103 142.299l.831-.513A5.137 5.137 0 0 0 106.02 139"
                />
                <path className="cfm-arms" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="2" d="M17.105 139h24.98l5.031 5.031a53.938 53.938 0 0 0 6.972 5.881l5.77 4.088H31.532v2.169c0 6.817-2.99 12.999-9.164 14.242-1.919.387-3.769.589-5.262.589C8.204 171 1 163.831 1 155c0-8.693 6.981-15.776 15.69-15.995l.415-.005ZM214.895 139h-24.981l-5.03 5.031a53.988 53.988 0 0 1-6.972 5.881l-5.77 4.088h28.326v2.169c0 6.817 2.99 12.999 9.164 14.242 1.919.387 3.769.589 5.263.589 8.9 0 16.105-7.169 16.105-16 0-8.693-6.981-15.776-15.689-15.995l-.416-.005Z" />
                <path className="cfm-arms-light" fill="#fff" d="M226.009 149.937c1.616 3.555 1.245 7.201-.829 8.144-2.073.943-1.31-2.882-2.926-6.437s-5-5.494-2.926-6.437c2.074-.943 5.065 1.175 6.681 4.73ZM27.603 149.937c1.616 3.555 1.245 7.201-.829 8.144-2.074.943-1.31-2.882-2.926-6.437s-5-5.494-2.926-6.437c2.073-.943 5.065 1.175 6.68 4.73Z" />
                <path className="cfm-head-light" fill="#fff" d="M117.5 31c27.062 0 46.5 13.773 46.5 13.773 0 2.45-19.438-9.273-46.5-9.273S71.5 46 66 44.773C66 44.773 90.438 31 117.5 31Z" opacity=".4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cfm {
          position: relative;
          width: 100%;
          margin: 0 auto 0.5rem;
        }

        .cfm-track {
          position: relative;
          width: min(100%, 520px);
          height: 156px;
          margin-inline: auto;
          border-bottom: 1px dashed rgba(148,163,184,0.18);
        }

        .cfm-mascot {
          position: absolute;
          top: 0;
          left: 0;
          transform: translateY(2px) translateX(var(--cfx, 0px)) scale(${FACE_SCALE});
          transform-origin: top left;
          display: inline-block;
          cursor: grab;
          touch-action: none;
          user-select: none;
          transition: transform 220ms cubic-bezier(.22,.61,.36,1);
        }
        .cfm-mascot.cfm-dragging { cursor: grabbing; }

        .cfm-face { position: relative; width: 232px; height: 172px; }

        .cfm-error {
          position: absolute;
          top: -74px;
          left: 50%;
          transform: translateX(-50%);
          width: 330px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
          pointer-events: none;
          z-index: 5;
        }
        .cfm-has-error .cfm-error { opacity: 1; visibility: visible; }

        .cfm-error-text {
          font: 700 34px/1 'Space Grotesk','Lexend','Inter',Arial,sans-serif;
          fill: #f0abfc;
          filter: drop-shadow(0 0 14px rgba(232,121,249,0.5));
        }

        .cfm-eye-whites {
          position: absolute;
          top: 83px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          overflow: hidden;
        }

        .cfm-eyeball {
          position: absolute;
          top: 95px;
          left: 50%;
          z-index: 1;
          transition: transform 120ms cubic-bezier(.22,.61,.36,1);
          will-change: transform;
          transform: translateX(-50%) translateX(-40px);
        }
        .cfm-eyeball--right { transform: translateX(-50%) translateX(40px); }

        .cfm-mask { position: relative; z-index: 2; }

        .cfm-mascot.cfm-happy {
          animation: cfm-bounce 0.7s cubic-bezier(.22,.61,.36,1);
        }

        @keyframes cfm-bounce {
          0% { transform: translateY(2px) translateX(var(--cfx, 0px)) scale(${FACE_SCALE}) rotate(0deg); }
          30% { transform: translateY(-10px) translateX(var(--cfx, 0px)) scale(${FACE_SCALE}) rotate(-6deg); }
          60% { transform: translateY(2px) translateX(var(--cfx, 0px)) scale(${FACE_SCALE}) rotate(5deg); }
          100% { transform: translateY(2px) translateX(var(--cfx, 0px)) scale(${FACE_SCALE}) rotate(0deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cfm-mascot, .cfm-eyeball { transition: none !important; }
          .cfm-mascot.cfm-happy { animation: none !important; }
        }
      `}</style>
    </div>
  );
}