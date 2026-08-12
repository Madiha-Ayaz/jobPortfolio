import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface EscapeButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  active?: boolean; // when true, it will try to escape
}

const randomPercent = () => `${5 + Math.random() * 90}%`;

const EscapeButton: React.FC<EscapeButtonProps> = ({ label, disabled, onClick, containerRef, active }) => {
  const controls = useAnimation();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ left: string; top: string }>({ left: '50%', top: '72%' });

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;
    const container = containerRef.current;

    const handler = (e: MouseEvent) => {
      if (!active) return;
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;
      const dx = e.clientX - bx;
      const dy = e.clientY - by;
      const dist = Math.hypot(dx, dy);

      if (dist < 120) {
        const newPos = { left: randomPercent(), top: randomPercent() };
        setPos(newPos);
        controls.start({ x: 0, y: 0 });
      }
    };

    container.addEventListener('mousemove', handler);
    return () => container.removeEventListener('mousemove', handler);
  }, [containerRef, active, controls]);

  useEffect(() => {
    // gentle float animation when enabled
    controls.start({ scale: 1, transition: { duration: 0.5 } });
  }, [controls]);

  return (
    <motion.button
      ref={btnRef}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`relative z-20 px-6 py-3 rounded-full font-bold text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-accent/40 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent-dark cursor-pointer'}`}
      animate={controls}
      initial={{ opacity: 1 }}
      style={{ position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
    >
      {label}
    </motion.button>
  );
};

export default EscapeButton;
