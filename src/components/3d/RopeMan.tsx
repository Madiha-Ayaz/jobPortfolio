/**
 * RopeMan
 * -------
 * A small SVG-based 3D-feeling animation of a man being pulled by a rope.
 *  - 'pulling':  man leans back, plants feet, rope taut to off-screen target.
 *  - 'anchored': man at rest, rope slack, gentle breathing.
 *  - 'caught':   man grabs the rope and pulls in (used when login succeeds).
 * No external deps; pure SVG + CSS animations.
 */
import { CSSProperties } from 'react';

export type RopeManState = 'pulling' | 'anchored' | 'caught';

interface RopeManProps {
  state?: RopeManState;
  /** Target the rope connects to, in % of the wrapper box. */
  targetX?: number; // 0..100
  targetY?: number; // 0..100
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const RopeMan = ({
  state = 'pulling',
  targetX = 92,
  targetY = 12,
  size = 220,
  className = '',
  style,
}: RopeManProps) => {
  const lean =
    state === 'pulling' ? -18 : state === 'caught' ? -28 : 0;
  const forward =
    state === 'caught' ? 'translate(40px, -10px)' : 'translate(0, 0)';

  return (
    <div
      className={`rope-man-wrapper ${className}`}
      style={{ width: size, height: size, perspective: 800, ...style }}
      aria-hidden
    >
      <style>{`
        .rope-man-wrapper {
          position: relative;
          transform-style: preserve-3d;
          user-select: none;
        }
        .rope-man-stage {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
        }
        .rope-man-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,.45));
          animation: rope-man-breathe 3.4s ease-in-out infinite;
        }
        .rope-man-svg.leaning {
          animation: rope-man-breathe 3.4s ease-in-out infinite,
                     rope-man-pull 0.9s ease-in-out infinite;
        }
        .rope-man-svg.caught {
          animation: rope-man-catch 0.7s ease-out forwards;
        }
        .rope-man-svg .arm {
          transform-origin: 70px 80px;
          transition: transform 400ms ease;
        }
        .rope-man-svg.pulling .arm { transform: rotate(-25deg); }
        .rope-man-svg.anchored .arm { transform: rotate(0deg); }
        .rope-man-svg.caught .arm { transform: rotate(40deg); }
        .rope-man-svg .leg {
          transform-origin: 60px 130px;
          transition: transform 400ms ease;
        }
        .rope-man-svg.pulling .leg-a { transform: rotate(15deg); }
        .rope-man-svg.pulling .leg-b { transform: rotate(-12deg); }
        .rope-man-rope {
          fill: none;
          stroke: #d6b78a;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-dasharray: 4 3;
          animation: rope-wave 1.6s ease-in-out infinite;
        }
        .rope-man-target {
          fill: #FF8F9C;
          filter: drop-shadow(0 0 6px rgba(255,143,156,.7));
        }
        .rope-man-floor {
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: 6%;
          height: 6px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,.55), transparent 70%);
        }
        @keyframes rope-man-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-3px) scale(1.01); }
        }
        @keyframes rope-man-pull {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50%      { transform: translateX(2px) rotate(-1deg); }
        }
        @keyframes rope-man-catch {
          0%   { transform: translateX(0)   rotate(0deg); }
          100% { transform: translateX(80px) rotate(-6deg); }
        }
        @keyframes rope-wave {
          0%, 100% { stroke-dashoffset: 0; }
          50%      { stroke-dashoffset: -14; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rope-man-svg, .rope-man-rope { animation: none !important; }
        }
      `}</style>

      <div
        className="rope-man-stage"
        style={{ transform: `${forward} rotateX(8deg)` }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <path
            className="rope-man-rope"
            d={`M 30 60 Q ${(30 + targetX) / 2} ${Math.max(0, 60 - 40)} ${targetX} ${targetY}`}
          />
          <circle className="rope-man-target" cx={targetX} cy={targetY} r="1.6" />
        </svg>

        <svg
          viewBox="0 0 120 160"
          className={`rope-man-svg ${
            state === 'pulling' ? 'leaning pulling' :
            state === 'caught'   ? 'caught'         : 'anchored'
          }`}
          style={{
            transform: `rotate(${lean}deg)`,
            transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)',
          }}
        >
          <circle cx="60" cy="35" r="16" fill="#f5d0b0" />
          <path d="M44 30 Q60 12 76 30 L76 26 Q60 8 44 26 Z" fill="#1f2937" />
          <circle cx="55" cy="36" r="1.6" fill="#1f2937" />
          <circle cx="65" cy="36" r="1.6" fill="#1f2937" />
          <path
            d={state === 'pulling' ? 'M54 44 Q60 50 66 44' : 'M54 44 Q60 47 66 44'}
            stroke="#1f2937"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M44 52 Q60 50 76 52 L72 95 Q60 100 48 95 Z" fill="#8b5cf6" />
          <rect x="48" y="92" width="24" height="4" fill="#1f2937" />
          <g className="arm">
            <path d="M72 55 Q92 50 100 38 L96 34 Q88 44 70 50 Z" fill="#f5d0b0" />
          </g>
          <path d="M48 55 Q34 64 30 78 L34 80 Q42 68 50 60 Z" fill="#f5d0b0" />
          <g className="leg leg-a">
            <rect x="50" y="96" width="9" height="42" rx="3" fill="#1f2937" />
            <rect x="49" y="135" width="12" height="6" rx="2" fill="#1f2937" />
          </g>
          <g className="leg leg-b">
            <rect x="61" y="96" width="9" height="42" rx="3" fill="#1f2937" />
            <rect x="60" y="135" width="12" height="6" rx="2" fill="#1f2937" />
          </g>
          <ellipse cx="55" cy="142" rx="8" ry="3" fill="#0f1724" />
          <ellipse cx="65" cy="142" rx="8" ry="3" fill="#0f1724" />
        </svg>

        <div className="rope-man-floor" />
      </div>
    </div>
  );
};

export default RopeMan;
