
/**
 * ProjectCard — Cosmic-themed 3D project card.
 * Unique 3D movement, holographic glassmorphism, orbital rings,
 * depth parallax layers, mouse-tracked tilt, animated borders.
 */
import { Project } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, MouseEvent, useState } from 'react';
import { trackProjectView } from '@/utils/analytics';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const PALETTE = [
  { color: '#8b5cf6', accent: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.5)' },
  { color: '#ec4899', accent: '#f9a8d4', glow: 'rgba(236, 72, 153, 0.5)' },
  { color: '#06b6d4', accent: '#67e8f9', glow: 'rgba(6, 182, 212, 0.5)' },
  { color: '#10b981', accent: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.5)' },
  { color: '#f59e0b', accent: '#fcd34d', glow: 'rgba(245, 158, 11, 0.5)' },
  { color: '#ef4444', accent: '#fca5a5', glow: 'rgba(239, 68, 68, 0.5)' },
];

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [palette] = useState(PALETTE[index % PALETTE.length]);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 50, rotateX: -15 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        delay: (index % 3) * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 12 + index,
        repeat: -1,
        ease: 'none',
      });
    }
  }, { scope: cardRef });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    const rotateY = px * 18;
    const rotateX = -py * 18;

    if (innerRef.current) {
      innerRef.current.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    }
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${palette.glow}, transparent 60%)`;
      glowRef.current.style.opacity = '1';
    }
  };

  const handleLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  return (
    <div ref={cardRef} className="opacity-0 h-full perspective-1000">
      <div
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer group"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={innerRef}
          className="relative h-full transition-transform duration-200 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="relative h-full rounded-2xl overflow-hidden border backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${palette.color}25 0%, #0a0a1e 50%, ${palette.accent}15 100%)`,
              borderColor: `${palette.accent}40`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 ${palette.accent}20`,
            }}
          >

            <div
              className="relative h-52 overflow-hidden"
              style={{
                background: `radial-gradient(ellipse at top, ${palette.color}60 0%, #0a0a1e 70%)`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: `${(i * 47) % 100}%`,
                      top: `${(i * 31) % 100}%`,
                      width: `${1 + (i % 3)}px`,
                      height: `${1 + (i % 3)}px`,
                      opacity: 0.3 + (i % 5) * 0.1,
                      animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>

              <div
                ref={ringRef}
                className="absolute inset-0 pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute top-1/2 left-1/2 rounded-full border-2"
                  style={{
                    width: '180px',
                    height: '180px',
                    marginLeft: '-90px',
                    marginTop: '-90px',
                    borderColor: `${palette.accent}40`,
                    borderStyle: 'dashed',
                    boxShadow: `0 0 30px ${palette.glow}`,
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: palette.accent,
                    top: '50%',
                    left: '50%',
                    marginTop: '-4px',
                    boxShadow: `0 0 12px ${palette.accent}`,
                  }}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  style={{
                    boxShadow: `0 4px 20px ${palette.color}60`,
                  }}
                />
              </div>

              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-50"
                style={{ background: palette.color }}
              />
              <div
                className="absolute bottom-0 left-0 w-20 h-20 rounded-full blur-xl opacity-40"
                style={{ background: palette.accent }}
              />
            </div>


            <div className="p-6 relative">
              <h3
                className="text-2xl font-bold mb-2 tracking-wide"
                style={{
                  background: `linear-gradient(135deg, ${palette.accent} 0%, #ffffff 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {project.title}
              </h3>

              <div
                className="h-0.5 w-12 mb-4 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${palette.color} 0%, ${palette.accent} 100%)`,
                  boxShadow: `0 0 8px ${palette.glow}`,
                }}
              />

              <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm"
                    style={{
                      background: `${palette.color}20`,
                      borderColor: `${palette.accent}40`,
                      color: palette.accent,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: `${palette.accent}20` }}>
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackProjectView(project.title, project.id, 'live')}
                    className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${palette.color} 0%, ${palette.accent} 100%)`,
                      color: '#fff',
                      boxShadow: `0 4px 15px ${palette.color}50`,
                    }}
                  >
                    Live Demo ↗
                  </a>
                )}
                {project.repoUrl && project.repoUrl !== '#' && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackProjectView(project.title, project.id, 'repo')}
                    className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full border transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: palette.accent,
                      color: palette.accent,
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-300"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
