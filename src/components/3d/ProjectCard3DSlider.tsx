/**
 * ProjectCard3DSlider — A stunning 3D carousel slider with glassmorphism cards.
 * Auto-rotates every 4s, drag/click to explore, smooth transitions, parallax depth.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, Float, Sparkles } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Project } from "@/lib/data";

interface Project3DItem {
  title: string;
  description: string;
  tech: string[];
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  color: string;
  accent: string;
}

interface ProjectCard3DSliderProps {
  projects: Project[];
}

const PALETTE = [
  { color: "#8b5cf6", accent: "#c4b5fd" },
  { color: "#ec4899", accent: "#f9a8d4" },
  { color: "#06b6d4", accent: "#67e8f9" },
  { color: "#10b981", accent: "#6ee7b7" },
  { color: "#f59e0b", accent: "#fcd34d" },
  { color: "#ef4444", accent: "#fca5a5" },
];

function toProject3DItem(p: Project, idx: number): Project3DItem {
  return {
    title: p.title,
    description: p.description,
    tech: p.tags,
    imageUrl: p.imageUrl,
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    color: PALETTE[idx % PALETTE.length].color,
    accent: PALETTE[idx % PALETTE.length].accent,
  };
}

function Card3D({ item, position, rotation, isActive, onClick }: { item: Project3DItem; position: [number, number, number]; rotation: [number, number, number]; isActive: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.05;
      const targetScale = isActive ? 1.15 : hovered ? 1.08 : 1.0;
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1;
      groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1;
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.1;
    }
  });
  return (
    <group ref={groupRef} position={position} rotation={rotation} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <RoundedBox args={[3.4, 4.6, 0.25]} radius={0.15} smoothness={6}>
        <meshStandardMaterial color={item.color} metalness={0.7} roughness={0.25} emissive={item.color} emissiveIntensity={isActive ? 0.5 : hovered ? 0.35 : 0.15} />
      </RoundedBox>
      <RoundedBox args={[3.2, 4.4, 0.05]} radius={0.12} smoothness={6} position={[0, 0, 0.13]}>
        <meshPhysicalMaterial color="#0a0a1e" metalness={0.1} roughness={0.1} transparent opacity={0.85} transmission={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.14]}>
        <ringGeometry args={[2.0, 2.08, 64]} />
        <meshBasicMaterial color={item.accent} transparent opacity={isActive ? 0.9 : hovered ? 0.7 : 0.3} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 1.7, 0.16]} fontSize={0.32} color={item.accent} anchorX="center" anchorY="middle" maxWidth={2.9} outlineWidth={0.01} outlineColor="#000000">{item.title}</Text>
      <mesh position={[0, 1.35, 0.16]}>
        <boxGeometry args={[1.2, 0.03, 0.01]} />
        <meshBasicMaterial color={item.accent} />
      </mesh>
      <Text position={[0, 0.3, 0.16]} fontSize={0.13} color="#e0e7ff" anchorX="center" anchorY="middle" maxWidth={2.9} textAlign="center" lineHeight={1.4}>{item.description.length > 140 ? item.description.substring(0, 140) + "..." : item.description}</Text>
    </group>
  );
}

function CarouselScene({ items, activeIndex, setActiveIndex }: { items: Project3DItem[]; activeIndex: number; setActiveIndex: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const { camera, mouse } = useThree();
  useEffect(() => {
    targetRotation.current = -(activeIndex * (Math.PI * 2)) / items.length;
  }, [activeIndex, items.length]);
  useFrame((state, delta) => {
    targetRotation.current += delta * 0.05;
    currentRotation.current += (targetRotation.current - currentRotation.current) * 0.05;
    if (groupRef.current) groupRef.current.rotation.y = currentRotation.current;
    camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  const radius = 7;
  return (
    <group ref={groupRef}>
      {/* Inner orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.02, 128]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.5, radius + 0.52, 128]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Sparkle particles around the carousel */}
      <Sparkles
        count={80}
        scale={[16, 8, 16]}
        size={3}
        speed={0.4}
        color="#c4b5fd"
      />

      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isActive = i === activeIndex;
        return (
          <Float
            key={i}
            speed={1.2}
            rotationIntensity={0.1}
            floatIntensity={0.3}
          >
            <Card3D
              item={item}
              position={[x, 0, z]}
              rotation={[0, -angle, 0]}
              isActive={isActive}
              onClick={() => setActiveIndex(i)}
            />
          </Float>
        );
      })}
    </group>
  );
}

export default function ProjectCard3DSlider({ projects }: ProjectCard3DSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const items = useMemo(() => projects.slice(0, 6).map((p, i) => toProject3DItem(p, i)), [projects]);
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setActiveIndex((prev) => (prev + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [autoPlay, items.length]);
  const handlePrev = () => { setAutoPlay(false); setActiveIndex((prev) => (prev - 1 + items.length) % items.length); };
  const handleNext = () => { setAutoPlay(false); setActiveIndex((prev) => (prev + 1) % items.length); };
  return (
    <div className="relative w-full">
      <div className="w-full h-[600px] relative">
        <Canvas camera={{ position: [0, 1, 9], fov: 55 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={1.5} color="#a78bfa" />
          <pointLight position={[-8, -4, 6]} intensity={1.2} color="#ec4899" />
          <pointLight position={[0, -8, -6]} intensity={1.0} color="#06b6d4" />
          <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
          <CarouselScene items={items} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </Canvas>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <button onClick={handlePrev} aria-label="Previous project" className="group relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/50 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110">
          <span className="relative z-10">‹</span>
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => { setAutoPlay(false); setActiveIndex(i); }} aria-label={"Go to project " + (i + 1)} className={"transition-all duration-300 rounded-full " + (i === activeIndex ? "w-10 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-pink-400/50" : "w-2.5 h-2.5 bg-slate-500 hover:bg-slate-300")} />
          ))}
        </div>
        <button onClick={handleNext} aria-label="Next project" className="group relative w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-500/50 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
          <span className="relative z-10">›</span>
        </button>
      </div>
    </div>
  );
}
