const fs = require('fs');

const imports = `import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Sparkles, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import RealisticEarth3D from "@/components/3d/RealisticEarth3D";
import { RocketIcon, AIBrainIcon, SparkleIcon, PlanetIcon, CodeIcon, MeteorIcon } from "@/components/ui/RealisticIcons";
import { ScrollProgress, ScrollToTop, CosmicDust, LoadingScreen, AnimatedCounter, SectionDivider, CursorHalo } from "@/components/ui/PageExtras";
import { SkillsConstellation } from "@/components/ui/SkillsConstellation";
import { Testimonials } from "@/components/ui/Testimonials";
import { JourneyTimeline } from "@/components/ui/JourneyTimeline";
import { ShootingStars, OrbitingBadges } from "@/components/3d/HeroEnhancements";
`;

fs.writeFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', imports);
console.log('Wrote part1:', imports.length, 'bytes');

const scene3d = `// ============================================================
// Bright spiral galaxy (the centerpiece background)
// ============================================================
function BrightGalaxy() {
  const ref = useRef<THREE.Points>(null);
  const count = 2500;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color("#ff5ec4"), new THREE.Color("#5e7bff"), new THREE.Color("#7afcff"), new THREE.Color("#ffeb70"), new THREE.Color("#ff8c42"), new THREE.Color("#b07bff")];
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.4) * 15;
      const arm = (i % 5) / 5 * Math.PI * 2;
      const spin = r * 0.5;
      const ang = arm + spin + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(ang) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(ang) * r;
      const c = palette[i % palette.length].clone();
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.04; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Floating colorful orbs (continuous animation)
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => { if (groupRef.current) { groupRef.current.rotation.y = state.clock.elapsedTime * 0.05; groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2; } });
  const orbs = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({ position: [(i - 4) * 1.6, Math.sin(i) * 1.2, Math.cos(i * 0.7) * 2], color: ["#ff5ec4", "#5e7bff", "#7afcff", "#ffeb70", "#ff8c42", "#b07bff", "#00ffaa", "#ff4444"][i % 8] })), []);
  return (
    <group ref={groupRef}>
      {orbs.map((o, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere args={[0.18, 32, 32]} position={o.position as [number, number, number]}>
            <MeshDistortMaterial color={o.color} attach="material" distort={0.5} speed={2} roughness={0.2} metalness={0.9} emissive={o.color} emissiveIntensity={0.5} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', scene3d);

const heroScene = `// ============================================================
// The Earth + galaxy hero scene
// ============================================================
function EarthHeroScene() {
  const { camera, mouse } = useThree();
  useFrame((state) => {
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.04;
    camera.position.z = 6 + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2.0} color="#a78bfa" />
      <pointLight position={[-10, -10, 5]} intensity={1.5} color="#ec4899" />
      <pointLight position={[0, 10, -10]} intensity={1.0} color="#06b6d4" />
      <pointLight position={[0, -10, 0]} intensity={1.2} color="#fbbf24" />
      <Stars radius={80} depth={60} count={4000} factor={6} fade speed={1.5} />
      <Sparkles count={120} scale={[20, 10, 20]} size={4} speed={0.5} color="#c4b5fd" />
      <BrightGalaxy />
      <FloatingOrbs />
      <ShootingStars count={5} />
      <OrbitingBadges />
      <RealisticEarth3D position={[0, 0, 0]} />
    </>
  );
}

function EarthShowcase() {
  return (
    <div className="relative w-full h-[500px] my-12">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>

const featuredProjectsDecl = `// ============================================================
// Featured project data
// ============================================================
type ProjectIcon = 'rocket' | 'ai' | 'sparkle' | 'planet' | 'code' | 'meteor';
interface FeaturedProject {
  id: number;
  title: string;
  description: string;
  tech: string[];
  color: string;
  icon: ProjectIcon;
  metrics: { label: string; value: string }[];
}

const featuredProjects: FeaturedProject[] = [
  { id: 1, title: "3D Portfolio Website", description: "A fully 3D animated portfolio with realistic Earth, galaxy, and continuous cosmic animations.", tech: ["React", "Three.js", "GSAP"], color: "#8b5cf6", icon: "rocket", metrics: [{ label: "FPS", value: "60" }, { label: "Stars", value: "2.5K" }, { label: "Shaders", value: "8" }] },

const projectCard = `// ============================================================
// Featured project card with 3D tilt + realistic icon + metrics
// ============================================================
function ProjectCard3D({ project, index }: { project: FeaturedProject; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty('--mx', \`\${(x + 0.5) * 100}%\`);
    cardRef.current.style.setProperty('--my', \`\${(y + 0.5) * 100}%\`);
    cardRef.current.style.transform = \`perspective(1200px) rotateY(\${x * 20}deg) rotateX(\${-y * 20}deg) translateZ(30px)\`;
  };
  const handleLeave = () => { if (cardRef.current) cardRef.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0)"; };
  const Icon = ICON_MAP[project.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 ease-out"
      style={{
        background: \`linear-gradient(135deg, \${project.color}30 0%, #0a0a1e 50%, \${project.color}15 100%)\`,
        border: \`1px solid \${project.color}60\`,
        boxShadow: \`0 8px 40px \${project.color}30\`,
        transformStyle: 'preserve-3d',
      }}
      data-hover
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: \`radial-gradient(circle at var(--mx, 50%) var(--my, 50%), \${project.color}40, transparent 50%)\` }} />
      <div className="relative p-8" style={{ transform: 'translateZ(40px)' }}>
        <Icon size={64} glow={project.color} />
        <h3 className="text-2xl font-bold mb-3 mt-4" style={{ color: project.color }}>{project.title}</h3>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{project.description}</p>
        <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {project.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-lg font-black" style={{ color: project.color }}>{m.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: \`\${project.color}20\`, color: project.color, border: \`1px solid \${project.color}40\` }}>{t}</span>
          ))}
        </div>
        <div className="flex gap-3">
          <Link to="/projects" className="text-xs px-4 py-2 rounded-full font-bold text-white transition-transform hover:scale-105" style={{ background: \`linear-gradient(135deg, \${project.color} 0%, \${project.color}cc 100%)\` }}>View Live →</Link>
          <Link to="/projects" className="text-xs px-4 py-2 rounded-full font-bold border transition-colors hover:bg-white/5" style={{ borderColor: \`\${project.color}80\`, color: project.color }}>Source</Link>
        </div>
      </div>

const homePagePart1 = `// ============================================================
// Main HomePage
// ============================================================
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      <div className="relative min-h-screen text-white overflow-x-hidden">
        <ScrollProgress />
        <CosmicDust />
        <CursorHalo />

        {/* Deep space background gradient + animated nebula */}
        <div className="fixed inset-0 -z-20" style={{ background: "radial-gradient(ellipse at 30% 20%, #1e1b4b 0%, #0a0a1e 40%, #000000 100%)" }} />
        <motion.div
          className="fixed inset-0 -z-20 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {mounted && (
              <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                  <EarthHeroScene />
                </Suspense>
              </Canvas>
            )}
          </div>

          <motion.div
            className="relative z-10 text-center px-4 max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="inline-block mb-6 px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full border border-purple-400/50 bg-purple-500/10 backdrop-blur-md"
              animate={{ boxShadow: ['0 0 20px rgba(168,85,247,0.3)', '0 0 40px rgba(168,85,247,0.6)', '0 0 20px rgba(168,85,247,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦ Welcome to my universe ✦
            </motion.div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              style={{
                background: "linear-gradient(135deg, #c4b5fd 0%, #ffffff 25%, #f9a8d4 50%, #67e8f9 75%, #c4b5fd 100%)",
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(139, 92, 246, 0.4))",
                animation: 'gradShift 8s ease-in-out infinite',
              }}
            >
              Crafting Digital Universes
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Full-Stack Developer building 3D, agentic &amp; cosmic web experiences with React, Three.js &amp; AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/projects" className="group relative px-8 py-4 font-bold rounded-full overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", boxShadow: "0 8px 40px rgba(139, 92, 246, 0.5)" }} data-hover>
                <span className="relative z-10">Explore Projects →</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <Link to="/contact" className="px-8 py-4 font-bold rounded-full border-2 border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition-all" style={{ backdropFilter: "blur(8px)" }} data-hover>
                Get in Touch
              </Link>
            </div>
          </motion.div>

const homePagePart2 = `        {/* STATS BAND */}
        <section className="relative z-10 px-4 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: 4, s: '+', l: 'Years Coding' },
              { v: 30, s: '+', l: 'Projects Shipped' },
              { v: 12, s: '+', l: 'Technologies' },
              { v: 100, s: '%', l: 'Passion' },
            ].map((stat) => (
              <div key={stat.l} className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(8px)' }}>
                <div className="text-4xl md:text-5xl font-black mb-1" style={{ background: 'linear-gradient(90deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <AnimatedCounter value={stat.v} suffix={stat.s} />
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-400">{stat.l}</div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* FEATURED PROJECTS */}
        <AnimatedSection className="relative z-10 px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 backdrop-blur-sm">✨ Featured Work</div>
              <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ background: "linear-gradient(90deg, #67e8f9, #6ee7b7, #fcd34d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Galactic Creations</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">Hover over the cards to feel the 3D depth, follow the cursor glow, and discover the metrics behind each build.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: '1500px' }}>
              {featuredProjects.map((project, index) => (
                <ProjectCard3D key={project.id} project={project} index={index} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/projects" className="inline-block px-8 py-3 rounded-full border-2 border-purple-400/50 text-purple-200 font-bold hover:bg-purple-500/20 transition-all" style={{ backdropFilter: "blur(8px)" }} data-hover>
                See all projects →
              </Link>
            </div>
          </div>
        </AnimatedSection>

        <SectionDivider flip />

        {/* SKILLS CONSTELLATION */}
        <AnimatedSection className="relative z-10 px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 backdrop-blur-sm">🛰️ Tech Stack</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ background: "linear-gradient(90deg, #86efac, #67e8f9, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>My Tech Universe</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">An interconnected web of tools, libraries, and frameworks I use to ship cosmic experiences.</p>
            </div>
            <SkillsConstellation />
          </div>
        </AnimatedSection>

        <SectionDivider />
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', homePagePart2);
console.log('Appended homePagePart2');


          {/* Floating tech badges */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {['React', 'Three.js', 'TypeScript', 'AI'].map((t, i) => (
              <motion.div
                key={t}
                className="absolute px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-md pointer-events-auto"
                style={{
                  left: \`\${10 + i * 22}%\`,
                  top: \`\${20 + (i % 2) * 60}%\`,
                  borderColor: ['#61dafb', '#00d8ff', '#3178c6', '#a855f7'][i],
                  color: ['#61dafb', '#00d8ff', '#3178c6', '#a855f7'][i],
                  background: 'rgba(10,10,30,0.5)',
                  boxShadow: \`0 0 20px \${['#61dafb', '#00d8ff', '#3178c6', '#a855f7'][i]}66\`,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >{t}</motion.div>
            ))}
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-purple-300/60 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-purple-300 rounded-full" />
            </div>
          </motion.div>
        </section>
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', homePagePart1);
console.log('Appended homePagePart1');

    </motion.div>
  );
}
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', projectCard);
console.log('Appended projectCard');

  { id: 2, title: "Agentic AI Chatbot", description: "An intelligent OpenRouter-powered AI agent with tool-calling and portfolio navigation.", tech: ["OpenRouter", "Express", "AI Tools"], color: "#ec4899", icon: "ai", metrics: [{ label: "Tools", value: "5" }, { label: "Models", value: "20+" }, { label: "Latency", value: "1.2s" }] },
  { id: 3, title: "3D Project Constellation", description: "An interactive 3D carousel showcasing projects in a cosmic, rotating galaxy.", tech: ["R3F", "Drei", "Framer"], color: "#06b6d4", icon: "planet", metrics: [{ label: "Items", value: "3D" }, { label: "Tilt", value: "15" }, { label: "Auto", value: "4s" }] },
];

const ICON_MAP: Record<ProjectIcon, React.FC<any>> = { rocket: RocketIcon, ai: AIBrainIcon, sparkle: SparkleIcon, planet: PlanetIcon, code: CodeIcon, meteor: MeteorIcon };
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', featuredProjectsDecl);
console.log('Appended featuredProjectsDecl');

        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" />
          <pointLight position={[-5, -3, 4]} intensity={1.5} color="#ec4899" />
          <Stars radius={50} depth={50} count={1500} factor={4} fade speed={1} />
          <RealisticEarth3D position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
`;
fs.appendFileSync('D:/C DATA/Documents/my-job-portfolio-main/src/pages/page.part1.tsx', heroScene);
console.log('Appended heroScene');

console.log('Appended scene3d');

