import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useAgent } from '../../context/useAgent';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react';
import AgentPanel from './AgentPanel';

const THEME_COLORS: Record<string, string> = {
  dark: '#818cf8',
  light: '#4f46e5',
  green: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  neutral: '#94a3b8',
};

function Orb({ listening, thinking, isOpen }: { listening: boolean; thinking: boolean; isOpen: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const brand = THEME_COLORS[theme] || '#8b5cf6';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.8;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  const color = listening ? '#ef4444' : thinking ? '#fbbf24' : brand;

  return (
    <>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere ref={meshRef} args={[0.5, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={listening ? 0.7 : 0.4}
            speed={listening ? 4 : 2}
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.85, 0.03, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}

export default function AgentOrb() {
  const { isOpen, setIsOpen, isListening, isThinking, isVisible, setIsVisible } = useAgent();
  const { theme } = useTheme();
  const [pulse, setPulse] = useState(false);
  const brand = THEME_COLORS[theme] || '#8b5cf6';

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        style={{ background: `linear-gradient(135deg, ${brand}, ${brand}cc)`, boxShadow: `0 0 24px ${brand}66` }}
        title="Show AI assistant"
        aria-label="Show AI assistant"
      >
        <Sparkles size={20} />
      </button>
    );
  }

  return (
    <>
      {/* 3D Orb in corner */}
      <div
        className="fixed bottom-6 right-6 z-40 w-24 h-24 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        title="Open portfolio agent"
        role="button"
        aria-label="Open portfolio AI assistant"
      >
        <Canvas
          camera={{ position: [0, 0, 3], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 3]} intensity={1.2} color={brand} />
          <pointLight position={[-3, -3, -3]} intensity={1.2} color={brand} />
          <Orb listening={isListening} thinking={isThinking} isOpen={isOpen} />
        </Canvas>
        {/* Pulse ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all pointer-events-none`}
          style={{
            borderColor: brand,
            transform: pulse ? 'scale(1.5)' : 'scale(1)',
            opacity: pulse ? 0 : 1,
            transition: 'all 1.5s ease-out',
          }}
        />
        {/* Status indicator */}
        {isListening && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white" />
        )}
        {isThinking && (
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full animate-pulse border-2 border-white" />
        )}
      </div>

      {/* Chat panel */}
      {isOpen && <AgentPanel />}
    </>
  );
}