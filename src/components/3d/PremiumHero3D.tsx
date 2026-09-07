import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════
   PREMIUM HERO 3D SCENE
   Refined floating geometry — elegant, professional.
   ═══════════════════════════════════════════════ */

function StarDust({ count = 700 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#a5b4fc"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const orbA = useRef<THREE.Mesh>(null);
  const orbB = useRef<THREE.Mesh>(null);
  const orbC = useRef<THREE.Mesh>(null);

  // Shared wireframe geometry for elegant orbits
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  }), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
    if (core.current) {
      core.current.rotation.x += delta * 0.4;
      core.current.rotation.y += delta * 0.5;
      core.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04);
    }
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.5) * 0.15;
      ringA.current.rotation.y += delta * 0.3;
    }
    if (ringB.current) {
      ringB.current.rotation.x = Math.PI / 2.4 - Math.sin(t * 0.5) * 0.15;
      ringB.current.rotation.z += delta * 0.22;
    }
    if (orbA.current) {
      orbA.current.rotation.x += delta * 0.7;
      orbA.current.rotation.y += delta * 0.5;
      const a = t * 0.5;
      orbA.current.position.set(Math.cos(a) * 3.4, Math.sin(a * 0.7) * 1.1, Math.sin(a) * 3.4);
    }
    if (orbB.current) {
      orbB.current.rotation.x += delta * 0.6;
      orbB.current.rotation.z += delta * 0.4;
      const b = -t * 0.38 + 1.2;
      orbB.current.position.set(Math.cos(b) * 4.2, Math.sin(b * 1.3) * 0.8, Math.sin(b) * 4.2);
    }
    if (orbC.current) {
      orbC.current.rotation.y += delta * 0.5;
      orbC.current.rotation.z += delta * 0.3;
      const c = t * 0.24 + 3.5;
      orbC.current.position.set(Math.cos(c) * 2.6, Math.sin(c) * 2.2, Math.cos(c + 1) * 2.6);
    }
  });

  return (
    <group ref={group}>
      {/* Core — luminous icosahedron */}
      <mesh ref={core} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color={0x6366f1}
          emissive={0x4f46e5}
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Wireframe shell around core */}
      <mesh material={wireMat} scale={1.85}>
        <icosahedronGeometry args={[1.35, 1]} />
      </mesh>

      {/* Elegant torus rings */}
      <mesh ref={ringA}>
        <torusGeometry args={[2.3, 0.03, 16, 96]} />
        <meshBasicMaterial color={0x818cf8} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.9, 0.02, 16, 96]} />
        <meshBasicMaterial color={0x38bdf8} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Orbiting solids */}
      <mesh ref={orbA}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color={0x38bdf8} emissive={0x0ea5e9} emissiveIntensity={0.45} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh ref={orbB}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={0xc7d2fe} emissive={0x818cf8} emissiveIntensity={0.35} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={orbC}>
        <torusKnotGeometry args={[0.24, 0.08, 64, 12]} />
        <meshStandardMaterial color={0x22d3ee} emissive={0x06b6d4} emissiveIntensity={0.4} metalness={0.75} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.03;
    camera.position.z = 6.5 + Math.sin(t * 0.1) * 0.15;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} color={0x93c5fd} />
      <directionalLight position={[6, 8, 8]} intensity={1.4} color={0xe0e7ff} />
      <pointLight position={[-6, -4, -6]} intensity={0.9} color={0x6366f1} />
      <pointLight position={[6, 2, -8]} intensity={0.9} color={0x38bdf8} />
      <SpotLight />
      <StarDust />
      <FloatingShapes />
      <CameraRig />
    </>
  );
}

function SpotLight() {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.set(Math.sin(t * 0.4) * 4, 3, Math.cos(t * 0.4) * 4);
    }
  });
  return <spotLight ref={ref} intensity={1.2} angle={0.5} penumbra={0.8} color={0x818cf8} />;
}

export default function PremiumHero3D() {
  const lowFx = useRef(false);
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      lowFx.current = true;
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}