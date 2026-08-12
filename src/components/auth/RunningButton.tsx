/**
 * RunningButton
 * -------------
 * A login button that:
 *   1. Moves away from the cursor as long as `armed` is true (i.e. when
 *      the form is not yet valid).
 *   2. Stays still once `armed` is false (form valid).
 *   3. Plays a "snap-in" tween when transitioning from armed -> unarmed.
 *
 * The motion is GPU-accelerated (CSS `translate3d`) and uses `requestAnimationFrame`
 * with a critically-damped spring so the button feels alive but never
 * overshoots the cursor.
 *
 * Props:
 *   - armed:    if true, the button dodges the cursor. If false, it sits still.
 *   - onClick:  passed through to the underlying <button>.
 *   - children: button label / icon.
 *   - containerRef: optional ref to the *parent* of the button. The button
 *     will be clamped to stay inside this box. If omitted, it uses the
 *     window viewport.
 */
import {
  ButtonHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from 'react';

interface RunningButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  armed: boolean;
  children: ReactNode;
  /** Optional parent ref used to clamp the button inside the form. */
  containerRef?: RefObject<HTMLElement | null>;
}

const RunningButton = ({
  armed,
  children,
  containerRef,
  onClick,
  ...rest
}: RunningButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => {
      // Spring-damp current offset towards target.
      const k = reduced ? 1 : 0.18; // smoothing
      offsetRef.current.x += (targetRef.current.x - offsetRef.current.x) * k;
      offsetRef.current.y += (targetRef.current.y - offsetRef.current.y) * k;
      if (btnRef.current) {
        btnRef.current.style.transform = `translate3d(${offsetRef.current.x}px, ${offsetRef.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Recompute target offset when armed state or pointer moves.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMove = (e: PointerEvent) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const btnCX = rect.left + rect.width / 2;
      const btnCY = rect.top + rect.height / 2;

      // Distance from cursor to button centre.
      const dx = e.clientX - btnCX;
      const dy = e.clientY - btnCY;
      const dist = Math.max(1, Math.hypot(dx, dy));

      // Decide movement direction: away from cursor.
      // Also respect the parent container so we don't escape the form.
      const fleeRadius = Math.max(rect.width, rect.height) * 1.1;
      const shouldFlee = armed && dist < fleeRadius;

      if (!shouldFlee) {
        // Snap back gently.
        targetRef.current.x = 0;
        targetRef.current.y = 0;
        return;
      }

      // Compute a unit vector away from the cursor.
      const len = Math.hypot(dx, dy) || 1;
      let nx = -dx / len;
      let ny = -dy / len;

      // Compute the max translation we can do before hitting the container box.
      const parent = containerRef?.current;
      const maxX = parent
        ? Math.min(rect.left - parent.getBoundingClientRect().left,
                   parent.getBoundingClientRect().right - rect.right) - 4
        : Math.min(rect.left, window.innerWidth - rect.right) - 4;
      const maxY = parent
        ? Math.min(rect.top - parent.getBoundingClientRect().top,
                   parent.getBoundingClientRect().bottom - rect.bottom) - 4
        : Math.min(rect.top, window.innerHeight - rect.bottom) - 4;

      // 110px base flee distance, scaled by how close the cursor is.
      const intensity = Math.min(1, (fleeRadius - dist) / fleeRadius + 0.4);
      const fleeDistance = 60 + 70 * intensity;

      // Project (nx,ny) onto the rectangle's allowed box so we never leave it.
      const tryX = nx * fleeDistance;
      const tryY = ny * fleeDistance;
      const scale = Math.min(1, maxX / Math.max(1, Math.abs(tryX)),
                                  maxY / Math.max(1, Math.abs(tryY)));
      targetRef.current.x = tryX * scale;
      targetRef.current.y = tryY * scale;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [armed, containerRef]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      {...rest}
      style={{
        // Start the button at the in-place position with a quick transition.
        transition: armed
          ? 'box-shadow 200ms ease, background-color 200ms ease'
          : 'transform 320ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms ease, background-color 200ms ease',
        willChange: 'transform',
        touchAction: 'manipulation',
        ...(rest.style || {}),
      }}
      className={`relative w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-accent-dark ${
        armed ? 'cursor-not-allowed shadow-[0_0_0_3px_rgba(255,143,156,0.35)]' : 'cursor-pointer'
      } ${rest.className || ''}`}
      onMouseDown={(e) => {
        // Prevent text selection while running.
        if (armed) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
};

export default RunningButton;
