import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

// Floating distorted sphere (the centerpiece)
function DistortSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 100]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Animated particle field
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 1500;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8b5cf6"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Mouse-following 3D object
function MouseFollower() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const { x, y } = state.mouse;
      meshRef.current.position.x += (x * 3 - meshRef.current.position.x) * 0.1;
      meshRef.current.position.y += (y * 3 - meshRef.current.position.y) * 0.1;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color="#ec4899"
        emissive="#ec4899"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

// Rotating ring around the main sphere
function RotatingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2, 0.05, 16, 100]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
    </mesh>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ec4899" />
          <pointLight position={[0, 10, 0]} intensity={1} color="#06b6d4" />

          {/* 3D Objects */}
          <DistortSphere position={[0, 0, 0]} color="#8b5cf6" />
          <RotatingRing />
          <MouseFollower />
          <ParticleField />
          <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />

          {/* Camera Controls (optional - can be removed for non-interactive) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
