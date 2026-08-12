import { motion } from 'framer-motion';

interface TechNode {
  name: string;
  x: number;
  y: number;
  color: string;
}

const NODES: TechNode[] = [
  { name: 'React',     x:  50, y:  20, color: '#61dafb' },
  { name: 'Three.js',  x:  82, y:  35, color: '#00d8ff' },
  { name: 'TypeScript',x:  72, y:  68, color: '#3178c6' },
  { name: 'Node',      x:  40, y:  82, color: '#10b981' },
  { name: 'OpenRouter',x:  15, y:  72, color: '#a855f7' },
  { name: 'GSAP',      x:  10, y:  40, color: '#84cc16' },
  { name: 'Firebase',  x:  28, y:  15, color: '#f59e0b' },
  { name: 'Tailwind',  x:  60, y:  45, color: '#06b6d4' },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 6], [0, 7],
  [1, 2], [1, 7],
  [2, 3], [2, 7],
  [3, 4], [3, 7],
  [4, 5],
  [5, 6],
];

export function SkillsConstellation() {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="constellationGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Glow background */}
        <circle cx="50" cy="50" r="40" fill="url(#constellationGlow)" />
        {/* Edges with animated dash flow */}
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b];
          return (
            <motion.line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      {/* Nodes overlay */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.08, type: 'spring' }}
        >
          <motion.div
            className="relative w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{
              background: `radial-gradient(circle, ${n.color} 0%, ${n.color}55 70%, transparent 100%)`,
              boxShadow: `0 0 20px ${n.color}, 0 0 40px ${n.color}66`,
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{n.name}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}