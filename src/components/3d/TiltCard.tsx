/**
 * TiltCard — a lightweight, dependency-free 3D tilt card.
 *
 * What it does:
 *  - Tilts the card in 3D (rotateX / rotateY) following the cursor.
 *  - Adds a parallax "depth" to inner layers (image vs text).
 *  - Casts a soft coloured glow that follows the cursor.
 *  - Has a "flip on click" mode (off by default) so it can be used
 *    for project/blog previews.
 *
 * Performance:
 *  - Uses CSS transforms (GPU accelerated, no re-renders per mousemove).
 *  - Respects `prefers-reduced-motion`.
 *
 * Usage:
 *  <TiltCard>
 *    <img src="..." />
 *    <h3>Title</h3>
 *    <p>Description</p>
 *  </TiltCard>
 */
import { CSSProperties, ReactNode, useRef, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** How far the card tilts (degrees). Default 12. */
  intensity?: number;
  /** How far inner layers translate on Z. Default 30px. */
  depth?: number;
  /** If true, the card flips on click. Default false. */
  flipOnClick?: boolean;
  /** Glow color. Default = accent pink. */
  glowColor?: string;
  /** Perspective in px. Default 1000. */
  perspective?: number;
}

const TiltCard = ({
  children,
  className = '',
  intensity = 12,
  depth = 30,
  flipOnClick = false,
  glowColor = 'rgba(255, 143, 156, 0.35)',
  perspective = 1000,
}: TiltCardProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    // Respect reduced motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalised -0.5..0.5
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    const rotateY = px * intensity * 2; // tilt left/right
    const rotateX = -py * intensity * 2; // tilt up/down

    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    if (glowRef.current) {
      // Glow follows cursor
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent 60%)`;
      glowRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!flipOnClick) return;
    const card = e.currentTarget;
    card.classList.toggle('tilt-card-flipped');
  };

  return (
    <div
      className={`tilt-card ${className} ${flipOnClick ? 'tilt-card-flipable' : ''}`}
      style={{ perspective: `${perspective}px` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <div ref={innerRef} className="tilt-card-inner">
        {children}
        <div ref={glowRef} className="tilt-card-glow" />
      </div>

      {/* Scoped styles — kept here so TiltCard is drop-in. */}
      <style>{`
        .tilt-card {
          position: relative;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .tilt-card-inner {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
          width: 100%;
          height: 100%;
        }
        .tilt-card-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 250ms ease;
          mix-blend-mode: screen;
          border-radius: inherit;
        }
        .tilt-card-flipable {
          cursor: pointer;
        }
        .tilt-card.tilt-card-flipped .tilt-card-inner {
          transform: rotateY(180deg) !important;
        }
        /* Optional: fade children slightly on flip to hint at the back side */
        .tilt-card.tilt-card-flipped .tilt-card-front {
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .tilt-card-inner { transition: none; }
        }
      `}</style>
    </div>
  );
};

/**
 * TiltLayer — helper to give a child a parallax depth inside a TiltCard.
 * depth is the px translation along Z when the card is tilted.
 */
export const TiltLayer = ({
  children,
  depth = 30,
  className = '',
  style,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    className={className}
    style={{
      transform: `translateZ(${depth}px)`,
      transformStyle: 'preserve-3d',
      ...style,
    }}
  >
    {children}
  </div>
);

export default TiltCard;
