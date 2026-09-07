/**
 * AuroraCore3D — the "Living Data Core".
 *
 * Continuous hero centrepiece of the Nexus theme: a molten teal
 * energy sphere (MeshDistortMaterial) wrapped in gyroscope rings,
 * an orbiting particle disc, floating crystal shards and sparkles,
 * finished with additive Bloom glow.
 */
import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ═══ THE LIVING CORE — molten energy sphere ═══ */
function LivingCore() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y += delta * 0.6;
    mesh.current.rotation.x += delta * 0.22;
    mesh.current.scale.setScalar(1 + Math.sin(t * 1.3) * 0.05);
  });

  return (
    <group>
      {/* Distorted molten shell */}
      <mesh ref={mesh}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <MeshDistortMaterial
          distort={0.42}
          speed={1.7}
          color="#0b2e29"
          emissive="#0d9488"
          emissiveIntensity={0.5}
          metalness={0.92}
          roughness={0.16}
        />
      </mesh>
      {/* Fine wireframe cage */}
      <mesh scale={1.04}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#2dd4a7" wireframe transparent opacity={0.1} />
      </mesh>
      {/* Blazing heart */}
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color="#d1fae5" />
      </mesh>
    </group>
  );
}

/* ═══ GYROSCOPE RINGS — three crossing orbit rings ═══ */
function GyroRings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += delta * 0.45;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    group.current.rotation.z = Math.cos(t * 0.3) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1.78, 0.014, 8, 120]} />
        <meshBasicMaterial color="#2dd4a7" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.012, 8, 120]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.45, 0.008, 8, 120]} />
        <meshBasicMaterial color="#99f6e4" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ═══ ORBITAL PARTICLE DISC — tilted energy belt ═══ */
function OrbitalParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 650;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 1.9 + Math.random() * 0.7;
      a[i * 3] = Math.cos(ang) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      a[i * 3 + 2] = Math.sin(ang) * r;
    }
    return a;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.35;
  });

  return (
    <points ref={ref} rotation={[Math.PI / 3.2, 0, 0.35]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#7cc9b8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══ ORBITING CRYSTAL SHARDS — 8 independent orbits ═══ */
function OrbitingShards() {
  const refs = useRef<THREE.Mesh[]>([]);

  const data = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        r: 1.15 + (i % 4) * 0.38,
        speed: i % 2 === 0 ? 0.42 : -0.34,
        phase: (i / 8) * Math.PI * 2,
        yAmp: 0.45 + (i % 3) * 0.2,
        phaseY: i,
        size: 0.2 + (i % 3) * 0.06,
        violet: i % 2 === 0,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    data.forEach((d, i) => {
      const m = refs.current[i];
      if (!m) return;
      const a = d.phase + t * d.speed;
      m.position.set(
        Math.cos(a) * d.r,
        Math.sin(t * 0.5 + d.phaseY) * d.yAmp,
        Math.sin(a) * d.r
      );
      m.rotation.x += 0.015;
      m.rotation.y += 0.025;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + Math.sin(t * 2 + i) * 0.2;
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }} scale={d.size}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={d.violet ? '#8b5cf6' : '#2dd4a7'}
            emissive={d.violet ? '#7c3aed' : '#0d9488'}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══ CAMERA — pointer parallax + gentle dolly ═══ */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x += (state.pointer.x * 0.7 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.45 - state.camera.position.y) * 0.03;
    state.camera.position.z = 7.2 + Math.sin(t * 0.12) * 0.2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══ MAIN EXPORT ═══ */
export default function AuroraCore3D() {
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
        camera={{ position: [0, 0, 7.2], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.45} color={0xc8f7e8} />
        <directionalLight position={[6, 8, 8]} intensity={1.3} color={0xd1fae5} />
        <pointLight position={[-5, -4, -6]} intensity={0.9} color={0x0d9488} />
        <pointLight position={[5, 2, -8]} intensity={0.9} color={0x7c3aed} />

        <LivingCore />
        <GyroRings />
        <OrbitalParticles />
        <OrbitingShards />
        <Sparkles count={lowFx.current ? 40 : 90} scale={[7, 4.5, 4]} size={2.4} speed={0.35} color="#99f6e4" opacity={0.7} />
        <Sparkles count={lowFx.current ? 30 : 60} scale={[5, 3, 4]} size={3} speed={0.25} color="#c4b5fd" opacity={0.5} />
        <CameraRig />

        {!lowFx.current && (
          <EffectComposer>
            <Bloom intensity={0.65} luminanceThreshold={0.22} luminanceSmoothing={0.6} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}