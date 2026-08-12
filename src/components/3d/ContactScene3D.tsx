/**
 * ContactScene3D
 * --------------
 * A lightweight 3D background for the Contact page, matching the visual
 * language of HeroScene3D (floating distorted sphere + ring + particles +
 * mouse follower) but tuned to be calmer and use less GPU on mobile.
 *
 * Notes:
 *  - Lazy-loaded by the Contact page (heavy 3D bundle is split out).
 *  - Auto-detects touch / reduced-motion to disable heavy effects.
 *  - Pointer-events: none so it never blocks the form.
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

function DistortOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.15;
      ref.current.rotation.y = s.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.4}>
      <Sphere ref={ref} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.45}
          speed={1.5}
          roughness={0.15}
          metalness={0.85}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </Sphere>
    </Float>
  );
}

function RingAround({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.4;
      ref.current.rotation.y = s.clock.elapsedTime * 0.25;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.04, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

function ParticleField({ count = 700 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 16;
      a[i * 3 + 1] = (Math.random() - 0.5) * 16;
      a[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return a;
  }, [count]);

  useFrame((s) => {
    if (points.current) {
      points.current.rotation.y = s.clock.elapsedTime * 0.04;
      points.current.rotation.x = s.clock.elapsedTime * 0.025;
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
      <pointsMaterial size={0.025} color="#06b6d4" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

function MouseOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.position.x += (s.mouse.x * 2.4 - ref.current.position.x) * 0.08;
      ref.current.position.y += (s.mouse.y * 2.4 - ref.current.position.y) * 0.08;
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.012;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.28, 0]} />
      <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.55} wireframe />
    </mesh>
  );
}

function ResizeListener() {
  const { size } = useThree();
  useEffect(() => {
    // touch size changes; placeholder for future SFX / particle scaling
  }, [size.width, size.height]);
  return null;
}

export default function ContactScene3D() {
  const [lowFx, setLowFx] = useState(false);
  useEffect(() => {
    setLowFx(isCoarsePointer());
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        dpr={lowFx ? [1, 1] : [1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <ResizeListener />
        <ambientLight intensity={0.5} />
        <pointLight position={[8, 8, 8]} intensity={1.3} color="#8b5cf6" />
        <pointLight position={[-8, -8, -6]} intensity={1.3} color="#ec4899" />
        <pointLight position={[0, 8, 0]} intensity={0.9} color="#06b6d4" />

        <DistortOrb position={[2.2, 0.5, 0]} color="#8b5cf6" />
        <DistortOrb position={[-2.4, -0.8, -1]} color="#06b6d4" />
        <RingAround color="#06b6d4" />
        <MouseOrb />
        <ParticleField count={lowFx ? 250 : 700} />
        <Stars radius={45} depth={40} count={lowFx ? 600 : 1500} factor={3} fade speed={0.7} />
      </Canvas>
    </div>
  );
}
