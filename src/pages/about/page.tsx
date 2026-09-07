import { useState, useEffect, useRef } from 'react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useTheme } from '@/context/ThemeContext';

const skills = [
  { name: 'Next.js', color: '#ffffff', level: 90 },
  { name: 'TypeScript', color: '#3178c6', level: 88 },
  { name: 'React', color: '#61dafb', level: 92 },
  { name: 'Node.js', color: '#68a063', level: 80 },
  { name: 'Python', color: '#3776ab', level: 78 },
  { name: 'AI Chatbots', color: '#ec4899', level: 85 },
  { name: 'Firebase', color: '#ffca28', level: 82 },
  { name: 'JavaScript', color: '#f7df1e', level: 92 },
  { name: 'Tailwind CSS', color: '#38bdf8', level: 95 },
  { name: 'Animations', color: '#a78bfa', level: 88 },
  { name: 'Figma', color: '#f24e1e', level: 75 },
  { name: 'Git & GitHub', color: '#f05032', level: 85 },
];

const certifications = [
  {
    name: 'Presidential Initiative for Artificial Intelligence and Computing',
    issuer: 'PIAIC',
    year: '2022',
    color: '#3776ab',
    status: 'In Progress',
    icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
  {
    name: 'Governor Initiative for Artificial Intelligence and Computing',
    issuer: 'GIAIC',
    year: '2024',
    color: '#a78bfa',
    status: 'In Progress',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  },
  {
    name: 'MERN Stack Developer',
    issuer: 'Saylani Mass IT Training (SMIT)',
    year: '2025',
    color: '#ec4899',
    imageUrl: '/cer.PNG',
    icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  },
  {
    name: 'Google Antigravity Hackathon',
    issuer: 'Google',
    year: '2025',
    color: '#fb923c',
    imageUrl: '/1782404779823.jfif',
    icon: 'M12 2a7 7 0 017 7c0 1.5-.5 2.9-1.3 4 .3 1.2-.2 2.4-1.3 3 .4 1.2 0 2.5-1 3.2L12 21l-3.4 2.7c-1-.7-1.4-2-1-3.2-.5-.6-.8-1.4-.8-2.2 0-.6.1-1.2.4-1.8-.8-1.1-1.2-2.5-1.2-4a7 7 0 017-7z',
  },
];

const education = [
  {
    degree: 'B.BIT (Bachelor of Business & Information Technology)',
    university: 'Virtual University',
    graduated: '2024',
    color: '#10b981',
  },
];

const stats = [
  { value: 6, labelKey: 'about.projects', suffix: '+' },
  { value: 12, labelKey: 'about.technologies', suffix: '+' },
  { value: 3, labelKey: 'about.certsTitle', suffix: '' },
  { value: 100, labelKey: 'about.commitment', suffix: '%' },
];

function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      ref={ref}
      className="relative rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-default"
      style={{
        background: hovered ? `${skill.color}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? skill.color + '40' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? `0 8px 30px ${skill.color}20` : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-semibold text-heading min-w-0">{skill.name}</span>
        <span className="text-xs font-bold flex-shrink-0" style={{ color: skill.color }}>{skill.level}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${skill.level}%` : '0%',
            background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
            boxShadow: `0 0 12px ${skill.color}50`,
            transitionDelay: `${index * 80 + 300}ms`,
          }}
        />
      </div>
    </div>
  );
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutPage() {
  const { t } = useTheme();
  return (
    <div className="relative min-h-screen text-body overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* ═══ HERO INTRO ═══ */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center gap-12 pt-16 pb-12">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div
                className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden"
                style={{
                  border: '3px solid rgba(129,140,248,0.4)',
                  boxShadow: '0 0 40px rgba(129,140,248,0.2), 0 0 80px rgba(129,140,248,0.1), inset 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src="/arab-woman-abaya-hijab-girl-muslim-working-laptop-office-education-online-entrepreneur-freelancer_1030874-9889.avif"
                  alt="Madiha Ayaz"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full"
                style={{
                  background: '#10b981',
                  boxShadow: '0 0 15px rgba(16,185,129,0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </div>

            {/* Bio */}
            <div className="text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full"
                style={{
                  border: '1px solid rgba(129,140,248,0.3)',
                  background: 'rgba(129,140,248,0.08)',
                  color: '#a5b4fc',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{t("about.title")}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight text-gradient">
                Madiha Ayaz
              </h1>

              <p className="text-lg text-body leading-relaxed mb-4">
                {t("about.intro1")}
              </p>
              <p className="text-base text-muted leading-relaxed mb-4">
                {t("about.intro2")}
              </p>
              <p className="text-sm text-dim leading-relaxed">
                {t("about.intro3")}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-8 justify-items-center lg:flex lg:items-center lg:gap-8 lg:justify-start">
                {stats.map((stat) => (
                  <div key={stat.labelKey} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-brand">
                      <Counter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-dim mt-1">{t(stat.labelKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ═══ SKILLS ═══ */}
        <AnimatedSection className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-3 text-heading">
              {t("about.skillsTitle")}
            </h2>
            <p className="text-muted text-sm">{t("about.skillsSub")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {skills.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ CERTIFICATIONS ═══ */}
        <AnimatedSection className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-3 text-heading">
              {t("about.certsTitle")}
            </h2>
            <p className="text-muted text-sm">{t("about.certsSub")}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="relative flex items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl transition-all duration-300 group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}35` }}
                >
                  {cert.imageUrl ? (
                    <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full group/cimg" aria-label={`View ${cert.name} certificate`}>
                      <img
                        src={cert.imageUrl}
                        alt={`${cert.name} certificate`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/cimg:scale-110"
                      />
                    </a>
                  ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke={cert.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={cert.icon} />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${cert.color}20`, color: cert.color }}>
                      {cert.year}
                    </span>
                    {cert.status && (
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase" style={{ background: '#f59e0b18', color: '#fbbf24' }}>
                        {cert.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-heading mb-1">{cert.name}</h3>
                  <p className="text-sm text-muted">{cert.issuer}</p>
                </div>

                {cert.imageUrl ? (
                  <a
                    href={cert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:scale-[1.03]"
                    aria-label={`View ${cert.name} certificate`}
                  >
                    <img
                      src={cert.imageUrl}
                      alt={`${cert.name} certificate`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </a>
                ) : (
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}35` }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={cert.color} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </div>
                )}

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${cert.color}06, transparent 70%)` }}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ EDUCATION ═══ */}
        <AnimatedSection className="py-16 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-3 text-heading">
              {t("about.education")}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {education.map((edu) => (
              <div
                key={edu.degree}
                className="relative p-8 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}35` }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={edu.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${edu.color}20`, color: edu.color }}>
                    {t("about.graduated")} {edu.graduated}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-heading mb-2">{edu.degree}</h3>
                <p className="text-muted font-medium">{edu.university}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(16,185,129,0.6); }
          50% { transform: scale(1.2); box-shadow: 0 0 25px rgba(16,185,129,0.8); }
        }
      `}</style>
    </div>
  );
}
