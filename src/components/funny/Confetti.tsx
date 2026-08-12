import React from 'react';

const COLORS = ['#F97316', '#F43F5E', '#60A5FA', '#34D399', '#FBBF24'];

const Confetti: React.FC<{ count?: number }> = ({ count = 24 }) => {
  const pieces = Array.from({ length: count }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      top: `${-10 - Math.random() * 20}%`,
      background: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: `${6 + Math.random() * 10}px`,
      height: `${8 + Math.random() * 14}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animationDelay: `${Math.random() * 600}ms`,
      opacity: 0.95,
    };
    return <span key={i} className="confetti-piece" style={style} />;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="relative w-full h-full">{pieces}</div>

      <style>{`
        .confetti-piece {
          position: absolute;
          border-radius: 2px;
          will-change: transform, opacity;
          animation: confetti-fall 2200ms cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(140vh) rotate(600deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
