import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

interface OrbitItem {
  label: string;
  deg: number;
  delay?: number;
  color?: string;
  to?: string;
}

interface SpinningEarthProps {
  orbit?: OrbitItem[];
  size?: number;
  orbitSpeed?: number;
}

const DEFAULT_ORBIT: OrbitItem[] = [
  { label: 'Projects', deg: 0, delay: 0, color: '#2dd4a7', to: '/projects' },
  { label: 'About', deg: 90, delay: 1.5, color: '#8b5cf6', to: '/about' },
  { label: 'Contact', deg: 180, delay: 3, color: '#22d3ee', to: '/contact' },
  { label: 'Blog', deg: 270, delay: 4.5, color: '#e879f9', to: '/blog' },
];

const SpinningEarth: React.FC<SpinningEarthProps> = ({
  orbit,
  size = 460,
  orbitSpeed = 14,
}) => {
  const { t } = useTheme();

  const DEFAULT_ORBIT: OrbitItem[] = [
    { label: t('nav.projects'), deg: 0, delay: 0, color: '#2dd4a7', to: '/projects' },
    { label: t('nav.about'), deg: 90, delay: 1.5, color: '#8b5cf6', to: '/about' },
    { label: t('nav.contact'), deg: 180, delay: 3, color: '#22d3ee', to: '/contact' },
    { label: t('nav.blog'), deg: 270, delay: 4.5, color: '#e879f9', to: '/blog' },
  ];

  const resolvedOrbit = orbit ?? DEFAULT_ORBIT;

  return (
    <div className="earth-scene" style={{ ['--se-size' as string]: `${size}px` }}>
      <div className="earth-scene__orb">
        {/* earth */}
        <div className="earth" />

        {/* orbit ring */}
        <div className="earth-scene__ring" />

        {/* orbit items — each revolves around the earth centre */}
        {resolvedOrbit.map((o, i) => {
          return (
            <div
              key={i}
              className="earth-scene__orbit"
              style={{
                '--se-ang': `${o.deg}deg`,
                '--oc': o.color || '#2dd4a7',
                '--odur': `${orbitSpeed}s`,
                '--odelay': `${o.delay || 0}s`,
              } as React.CSSProperties}
            >
              <div className="earth-scene__orbit-node">
                <span className="earth-scene__orbit-dot" />
                {o.to ? (
                  <Link to={o.to} className="earth-scene__orbit-label">{o.label}</Link>
                ) : (
                  <span className="earth-scene__orbit-label">{o.label}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="earth-scene__chips">
        <span className="earth-chip">✦ CSS Engine</span>
        <span className="earth-chip">⟳ 40s Spin</span>
        <span className="earth-chip">∞ Auto Pulse</span>
      </div>

      <style>{`
        @property --se-pulse {
          syntax: '<length>';
          inherits: false;
          initial-value: 80px;
        }
        @property --se-pulse2 {
          syntax: '<length>';
          inherits: false;
          initial-value: 56px;
        }
        @property --se-r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .earth-scene {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1rem 2rem;
          user-select: none;
          --se-r: min(calc(var(--se-size) * 0.42), calc(78vw * 0.42));
        }

        .earth-scene__orb {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 60px rgba(100, 190, 200, 0.22));
        }

        .earth {
          position: relative;
          width: var(--se-size);
          max-width: 78vw;
          aspect-ratio: 1;
          border-radius: 50%;
          background-image: url('https://i.postimg.cc/9QCCCVsQ/earth.png');
          background-repeat: repeat-x;
          background-size: cover;
          animation: se-spin 40s linear infinite, se-pulse 2s linear infinite alternate-reverse;
          box-shadow: 0 -1px 1px 1px white,
            -1px 1px 1px 1px #64bec8,
            0 0 var(--se-pulse) -20px #64bec8,
            inset 0 0 76px -10px #64bec8,
            inset 0 0 var(--se-pulse2) -10px #64bec8;
        }

        .earth::before,
        .earth::after {
          content: '';
          position: absolute;
          left: 70px;
          height: 10px;
          border-radius: 45%;
          filter: blur(12px);
          transform: rotate(var(--se-r));
          animation: se-rot 10s linear infinite;
        }

        .earth::before {
          width: 14%;
          box-shadow: inset 0 0 70px 90px #a47478, 0 0 140px 70px #a47478;
        }

        .earth::after {
          width: 7%;
          height: 10px;
          box-shadow: inset 0 0 70px -50px white, inset 0 0 70px 90px #e5bc77, 0 0 130px 50px #e5bc77;
        }

        /* ── orbit ring (decorative dashed circle) ── */
        .earth-scene__ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: calc(var(--se-r) * 2 + 40px);
          height: calc(var(--se-r) * 2 + 40px);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px dashed rgba(110, 231, 200, 0.30);
          box-shadow: 0 0 30px rgba(45, 212, 167, 0.14), inset 0 0 30px rgba(45, 212, 167, 0.08);
          pointer-events: none;
          z-index: 2;
          animation: se-ring-spin 30s linear infinite;
        }

        /* ── orbit item ──
           .earth-scene__orbit sits at the centre and revolves.
           .earth-scene__orbit-node is offset by (ox,oy) and counter-rotates
           so the label always stays upright on screen.
        ── */
        .earth-scene__orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          --oc: #2dd4a7;
          --odur: 14s;
          --odelay: 0s;
          --ox: calc(cos(var(--se-ang)) * var(--se-r));
          --oy: calc(sin(var(--se-ang)) * var(--se-r));
          width: 0;
          height: 0;
          transform: translate(-50%, -50%) rotate(0deg);
          animation: se-orbit-rot var(--odur) linear infinite;
          animation-delay: var(--odelay);
          pointer-events: auto;
        }

        .earth-scene__orbit-node {
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(var(--ox), var(--oy)) rotate(0deg);
          animation: se-orbit-rot-rev var(--odur) linear infinite;
          animation-delay: var(--odelay);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: max-content;
        }

        .earth-scene__orbit-dot {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff, var(--oc));
          box-shadow: 0 0 14px var(--oc), 0 0 26px var(--oc);
          animation: se-pulse-dot 2s ease-in-out infinite;
        }

        .earth-scene__orbit-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--oc);
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(7, 16, 25, 0.75);
          border: 1px solid var(--oc);
          box-shadow: 0 0 16px var(--oc), 0 4px 14px rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        a.earth-scene__orbit-label:hover {
          transform: scale(1.12);
          box-shadow: 0 0 24px var(--oc), 0 6px 18px rgba(0,0,0,0.5);
        }

        .earth-scene__chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .earth-chip {
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6ee7c8;
          background: rgba(7, 22, 25, 0.55);
          border: 1px solid rgba(45, 212, 167, 0.28);
          box-shadow: 0 0 18px rgba(45, 212, 167, 0.12);
          backdrop-filter: blur(8px);
        }

        @keyframes se-spin {
          0% { background-position: 0 0; }
          100% { background-position: -199% 0; }
        }

        @keyframes se-pulse {
          0% { --se-pulse: 8rem; --se-pulse2: 5.6rem; --se-r: 0deg; }
          100% { --se-pulse: 10rem; --se-pulse2: 3.6rem; --se-r: 180deg; }
        }

        @keyframes se-rot {
          from { --se-r: 0deg; }
          to { --se-r: 180deg; }
        }

        @keyframes se-ring-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes se-orbit-rot {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes se-orbit-rot-rev {
          from { transform: translate(var(--ox), var(--oy)) rotate(0deg); }
          to { transform: translate(var(--ox), var(--oy)) rotate(-360deg); }
        }

        @keyframes se-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }

        @media (max-width: 640px) {
          .earth-scene { padding-top: 0.5rem; }
          .earth::before,
          .earth::after { left: calc(min(460px, 78vw) * 0.06); }
        }
      `}</style>
    </div>
  );
};

export default SpinningEarth;