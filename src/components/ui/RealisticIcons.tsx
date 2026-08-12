import { motion } from 'framer-motion';

/* ============================================================
   Realistic animated SVG icon set used across the home page.
   Each icon is a small self-contained component that animates
   on hover / continuously when possible.
   ============================================================ */

interface IconProps {
  size?: number;
  className?: string;
  glow?: string; // css color for the drop-shadow glow
}

/* ---------------- ROCKET (3D shading) ---------------- */
export function RocketIcon({ size = 56, className = '', glow = '#8b5cf6' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="rkBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="rkWindow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="rkFlame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Flame */}
      <motion.path
        d="M27 50 Q32 64 37 50 Q34 56 32 56 Q30 56 27 50 Z"
        fill="url(#rkFlame)"
        animate={{ scaleY: [0.8, 1.2, 0.9, 1.1, 0.8] }}
        style={{ transformOrigin: '32px 52px' }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      {/* Body */}
      <path d="M32 6 C42 14 44 26 44 40 L44 50 L20 50 L20 40 C20 26 22 14 32 6 Z" fill="url(#rkBody)" stroke="#94a3b8" strokeWidth="0.5" />
      {/* Fins */}
      <path d="M20 40 L12 50 L20 50 Z" fill="#ef4444" />
      <path d="M44 40 L52 50 L44 50 Z" fill="#ef4444" />
      {/* Window */}
      <circle cx="32" cy="26" r="5" fill="url(#rkWindow)" stroke="#94a3b8" strokeWidth="0.5" />
      <circle cx="30" cy="24" r="1.5" fill="#fff" opacity="0.6" />
      {/* Stripe */}
      <rect x="20" y="36" width="24" height="2" fill="#ef4444" />
    </motion.svg>
  );

/* ---------------- AI BRAIN (neural network style) ---------------- */
export function AIBrainIcon({ size = 56, className = '', glow = '#ec4899' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
    >
      <defs>
        <radialGradient id="abCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <linearGradient id="abRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '32px 32px' }}
      >
        <circle cx="32" cy="32" r="26" fill="none" stroke="url(#abRing)" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '32px 32px' }}
      >
        <ellipse cx="32" cy="32" rx="22" ry="10" fill="none" stroke="url(#abRing)" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5" />
        <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="url(#abRing)" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5" />
      </motion.g>
      {[
        [16, 20], [48, 20], [12, 32], [52, 32], [16, 44], [48, 44],
        [24, 12], [40, 12], [24, 52], [40, 52], [32, 8], [32, 56]
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2}
          fill="#f9a8d4"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      <motion.circle
        cx="32" cy="32" r="10" fill="url(#abCore)"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '32px 32px' }}
      />
      <text x="32" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff">AI</text>
    </motion.svg>
  );
}
}

/* ---------------- SPARKLES (4-point stars) ---------------- */
export function SparkleIcon({ size = 56, className = '', glow = '#fcd34d' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
    >
      <defs>
        <radialGradient id="spCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fcd34d" />
        </radialGradient>
      </defs>
      {[32, 18, 46].map((cx, idx) => {
        const cy = idx === 0 ? 32 : idx === 1 ? 18 : 46;
        const s = idx === 0 ? 1 : 0.6;
        return (
          <motion.path
            key={idx}
            d={`M${cx} ${cy - 14 * s} L${cx + 4 * s} ${cy - 4 * s} L${cx + 14 * s} ${cy} L${cx + 4 * s} ${cy + 4 * s} L${cx} ${cy + 14 * s} L${cx - 4 * s} ${cy + 4 * s} L${cx - 14 * s} ${cy} L${cx - 4 * s} ${cy - 4 * s} Z`}
            fill="url(#spCore)"
            animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 90, 180] }}
            transition={{ duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
    </motion.svg>
  );
}

/* ---------------- PLANET (Earth-like) ---------------- */
export function PlanetIcon({ size = 56, className = '', glow = '#06b6d4' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
    >
      <defs>
        <radialGradient id="plBody" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </radialGradient>
        <radialGradient id="plGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#plGlow)" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '32px 32px' }}
      >
        <circle cx="32" cy="32" r="20" fill="url(#plBody)" />
        <path d="M16 24 Q22 20 28 26 Q22 30 18 28 Z" fill="#22c55e" opacity="0.85" />
        <path d="M30 18 Q40 22 38 30 Q32 28 30 24 Z" fill="#22c55e" opacity="0.85" />
        <path d="M22 38 Q32 36 36 42 Q28 46 22 42 Z" fill="#22c55e" opacity="0.85" />
        <path d="M40 40 Q48 38 48 46 Q44 50 40 46 Z" fill="#22c55e" opacity="0.85" />

/* ---------------- CODE / TERMINAL ---------------- */
export function CodeIcon({ size = 56, className = '', glow = '#10b981' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
    >
      <defs>
        <linearGradient id="codeBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="52" height="44" rx="6" fill="url(#codeBg)" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="14" cy="18" r="1.5" fill="#ef4444" />
      <circle cx="20" cy="18" r="1.5" fill="#fcd34d" />
      <circle cx="26" cy="18" r="1.5" fill="#10b981" />
      <motion.path d="M16 32 L24 38 L16 44" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M48 32 L40 38 L48 44" stroke="#06b6d4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} />
      <motion.path d="M36 28 L28 48" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} />
    </motion.svg>
  );
}

/* ---------------- METEOR / COMET ---------------- */
export function MeteorIcon({ size = 56, className = '', glow = '#fb923c' }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <defs>
        <linearGradient id="mtTail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
          <stop offset="60%" stopColor="#fb923c" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <radialGradient id="mtHead" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fb923c" />
        </radialGradient>
      </defs>
      <path d="M8 50 L48 18" stroke="url(#mtTail)" strokeWidth="6" strokeLinecap="round" />
      <path d="M12 50 L40 26" stroke="url(#mtTail)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="50" cy="16" r="8" fill="url(#mtHead)" />
    </motion.svg>
  );
}
        <ellipse cx="26" cy="20" rx="6" ry="1.5" fill="#fff" opacity="0.4" />
        <ellipse cx="38" cy="42" rx="7" ry="1.5" fill="#fff" opacity="0.4" />
      </motion.g>
      <circle cx="32" cy="32" r="22" fill="none" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.6" />
    </motion.svg>
  );
}