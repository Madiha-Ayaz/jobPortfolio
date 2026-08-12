import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useAgent } from '../../context/useAgent';
import AgentPanel from './AgentPanel';

function Orb({ listening, thinking, isOpen }: { listening: boolean; thinking: boolean; isOpen: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

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

  const color = listening ? '#ef4444' : thinking ? '#fbbf24' : isOpen ? '#06b6d4' : '#8b5cf6';

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
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        title="Show agent"
      >
        🤖
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
      >
        <Canvas
          camera={{ position: [0, 0, 3], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 3]} intensity={1.2} color="#8b5cf6" />
          <pointLight position={[-3, -3, -3]} intensity={1.2} color="#ec4899" />
          <Orb listening={isListening} thinking={isThinking} isOpen={isOpen} />
        </Canvas>
        {/* Pulse ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-purple-400 ${
            pulse ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          } transition-all duration-1500 pointer-events-none`}
        />
        {/* Status indicator */}
        {isListening && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white" />
        )}
      </div>

      {/* Chat panel */}
      {isOpen && <AgentPanel />}
    </>
  );
}
