/**
 * ProfessionalContactScene3D
 * --------------------------
 * Sophisticated 3D background with subtle animations.
 * Professional color palette (dark grays, slate blues, minimal accent).
 * Elegant and corporate, not cartoonish.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  (window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function SophisticatedSphere({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.08;
      ref.current.rotation.y = s.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1 * scale, 64, 64]} position={position}>
        <MeshDistortMaterial
          color="#3a4a64"
          attach="material"
          distort={0.35}
          speed={1.2}
          roughness={0.4}
          metalness={0.6}
          emissive="#1a2540"
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  );
}

function ElegantRing({ speed = 0.15 }: { speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * speed;
      ref.current.rotation.y = s.clock.elapsedTime * (speed * 0.7);
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.8, 0.04, 12, 80]} />
      <meshStandardMaterial
        color="#2a3a52"
        emissive="#1a2a42"
        emissiveIntensity={0.2}
        wireframe={false}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

function ProfessionalParticles({ count = 500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 24;
      a[i * 3 + 1] = (Math.random() - 0.5) * 24;
      a[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return a;
  }, [count]);

  useFrame((s) => {
    if (points.current) {
      points.current.rotation.y = s.clock.elapsedTime * 0.008;
      points.current.rotation.x = s.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#4a6a8a" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function SubtleMouseOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const targetPos = useRef({ x: 0, y: 0 });

  useFrame((s) => {
    if (ref.current) {
      targetPos.current.x = s.mouse.x * 2;
      targetPos.current.y = s.mouse.y * 2;

      ref.current.position.x += (targetPos.current.x - ref.current.position.x) * 0.06;
      ref.current.position.y += (targetPos.current.y - ref.current.position.y) * 0.06;
      ref.current.rotation.x += 0.008;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color="#546a8a"
        emissive="#2a4a6a"
        emissiveIntensity={0.25}
        wireframe={false}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

function ResizeListener() {
  const { size } = useThree();
  useEffect(() => {}, [size.width, size.height]);
  return null;
}

export default function EnhancedContactScene3D() {
  const [lowFx, setLowFx] = useState(false);

  useEffect(() => {
    setLowFx(isCoarsePointer());
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={lowFx ? [1, 1] : [1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <ResizeListener />

        {/* Professional Lighting - Subtle and Corporate */}
        <ambientLight intensity={0.35} />
        <pointLight position={[12, 12, 12]} intensity={0.8} color="#4a6a8a" />
        <pointLight position={[-12, -8, -10]} intensity={0.6} color="#3a5a7a" />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#2a4a6a" />

        {/* 3D Objects - Subtle and Professional */}
        <SophisticatedSphere position={[3.5, 1.5, -2]} scale={1.2} />
        <SophisticatedSphere position={[-4, -2, -1]} scale={0.85} />

        {/* Animated Rings - Professional Style */}
        <ElegantRing speed={0.12} />
        <ElegantRing speed={0.08} />

        {/* Interactive Elements - Refined */}
        <SubtleMouseOrb />

        {/* Subtle Particles */}
        <ProfessionalParticles count={lowFx ? 150 : 500} />

        {/* Minimal Background Stars */}
        <Stars radius={60} depth={60} count={lowFx ? 400 : 1000} factor={2.5} fade speed={0.3} />
      </Canvas>
    </div>
  );
}
