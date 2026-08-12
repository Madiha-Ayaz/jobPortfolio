import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatarColor: string;
  initials: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Aarav Mehta',
    role: 'CTO, Stellar Labs',
    text: 'The 3D portfolio is hands down the most impressive dev site I have seen. Earth scene, galaxy, and the AI agent actually work — not just a gimmick.',
    avatarColor: '#a855f7',
    initials: 'AM',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Senior Frontend Engineer',
    text: 'The shader work on the Earth with the day/night cycle and city lights is production-grade. Performance is rock-solid on my mid-range laptop.',
    avatarColor: '#ec4899',
    initials: 'PS',
    rating: 5,
  },
  {
    name: 'Diego Alvarez',
    role: 'Product Designer',
    text: 'The attention to micro-interactions is what sets this apart. The cursor halo, animated counters, and the constellation graph — chef\u2019s kiss.',
    avatarColor: '#06b6d4',
    initials: 'DA',
    rating: 5,
  },
];

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.15)',
      }}>
        {/* Quote mark */}
        <div className="absolute top-4 left-6 text-7xl font-serif opacity-10" style={{ color: t.avatarColor }}>"</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <motion.svg
                  key={i}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={t.avatarColor}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <path d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 21 L12 17.5 L6.5 21 L8 14 L3 9.5 L9.5 8.5 Z" />
                </motion.svg>
              ))}
            </div>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8 italic">
              "{t.text}"
            </p>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{
                  background: `linear-gradient(135deg, ${t.avatarColor} 0%, ${t.avatarColor}88 100%)`,
                  boxShadow: `0 0 20px ${t.avatarColor}88`,
                }}
              >
                {t.initials}
              </div>
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-sm text-slate-400">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-purple-400/40 flex items-center justify-center hover:bg-purple-500/20 transition"
          aria-label="Previous testimonial"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === idx ? '#a855f7' : 'rgba(168, 85, 247, 0.3)',
                width: i === idx ? 24 : 8,
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-purple-400/40 flex items-center justify-center hover:bg-purple-500/20 transition"
          aria-label="Next testimonial"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}