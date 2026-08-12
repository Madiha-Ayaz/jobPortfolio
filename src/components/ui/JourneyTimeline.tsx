import { motion } from 'framer-motion';

interface Milestone {
  year: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

const MILESTONES: Milestone[] = [
  { year: '2021', title: 'Started the Journey', description: 'Wrote my first line of HTML, CSS, and JavaScript. Fell in love with the web.', color: '#06b6d4', icon: 'M12 2 L2 7 L12 12 L22 7 L12 2 Z M2 17 L12 22 L22 17 M2 12 L12 17 L22 12' },
  { year: '2022', title: 'First Full-Stack App', description: 'Shipped a MERN stack SaaS with auth, payments, and a real database.', color: '#10b981', icon: 'M5 12 L10 17 L19 7' },
  { year: '2023', title: 'Entered 3D Web', description: 'Discovered Three.js and React Three Fiber. Built interactive 3D experiences.', color: '#a855f7', icon: 'M12 2 L2 7 L12 12 L22 7 L12 2 Z' },
  { year: '2024', title: 'AI & Agents', description: 'Integrated OpenRouter, built agentic tool-calling bots, and shipped this portfolio.', color: '#ec4899', icon: 'M12 2 a10 10 0 1 0 0 20 a10 10 0 1 0 0 -20 M12 6 V12 L16 14' },
  { year: '2025+', title: 'Building the Future', description: 'Pushing the limits of real-time 3D, AI agents, and immersive web experiences.', color: '#fcd34d', icon: 'M5 3 L19 12 L5 21 Z' },
];

export function JourneyTimeline() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Center line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 opacity-50" />
      {MILESTONES.map((m, i) => {
        const isLeft = i % 2 === 0;
        return (
          <motion.div
            key={m.year}
            className={`relative flex items-center mb-16 ${isLeft ? 'justify-start' : 'justify-end'}`}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {/* Content card */}
            <div className={`w-5/12 ${isLeft ? 'text-right pr-12' : 'text-left pl-12'}`}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                className="inline-block p-6 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${m.color}20 0%, rgba(10, 10, 30, 0.6) 100%)`,
                  border: `1px solid ${m.color}40`,
                  boxShadow: `0 8px 30px ${m.color}20`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className={`text-3xl font-black mb-2`} style={{ color: m.color }}>{m.year}</div>
                <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{m.description}</p>
              </motion.div>
            </div>
            {/* Center dot */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
              style={{
                background: `radial-gradient(circle, ${m.color} 0%, ${m.color}66 60%, transparent 100%)`,
                boxShadow: `0 0 20px ${m.color}, 0 0 40px ${m.color}80`,
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: i * 0.1 + 0.2 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}