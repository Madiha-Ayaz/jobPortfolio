/**
 * NebulaBackground3D — continuous "Nexus" aurora backdrop.
 *
 * A living teal × violet × fuchsia nebula field:
 *  - multi-layer starfield (tinted with the new palette)
 *  - drifting glow clouds
 *  - animated northern-lights ribbon band
 *  - cosmic dust + periodic comet streak
 *  - mouse parallax + camera breathing
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

/* ═══ TINTED STARFIELD — per-vertex color + twinkle ═══ */
function StarLayer({
  count,
  radius,
  size,
  speed,
  baseOpacity = 0.9,
}: {
  count: number;
  radius: number;
  size: number;
  speed: number;
  baseOpacity?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const palette = [
      new THREE.Color('#e2f5ec'),
      new THREE.Color('#f1f5f9'),
      new THREE.Color('#99f6e4'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#f0abfc'),
      new THREE.Color('#bae6fd'),
      new THREE.Color('#fde68a'),
    ];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.35 + Math.random() * 0.65);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 4;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const brightness = 0.5 + Math.random() * 0.5;
      col[i * 3] = c.r * brightness;
      col[i * 3 + 1] = c.g * brightness;
      col[i * 3 + 2] = c.b * brightness;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, colors: col, phases };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.03;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 0.45) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={baseOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══ DRIFTING NEBULA CLOUDS — teal / violet / fuchsia ═══ */
function NebulaClouds() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.012;
    const t = state.clock.elapsedTime;
    group.current.position.x = Math.sin(t * 0.05) * 0.6;
    group.current.position.y = Math.cos(t * 0.04) * 0.4;
  });

  const clouds = useMemo(
    () => [
      { pos: [10, 6, -18] as [number, number, number], r: 5.5, color: '#14b8a6', opacity: 0.035 },
      { pos: [12, 3, -20] as [number, number, number], r: 4, color: '#0d9488', opacity: 0.025 },
      { pos: [-11, -5, -18] as [number, number, number], r: 5, color: '#8b5cf6', opacity: 0.032 },
      { pos: [-9, -8, -21] as [number, number, number], r: 3.5, color: '#7c3aed', opacity: 0.02 },
      { pos: [3, -4, -30] as [number, number, number], r: 8, color: '#e879f9', opacity: 0.016 },
      { pos: [6, 9, -34] as [number, number, number], r: 6, color: '#2dd4a7', opacity: 0.012 },
      { pos: [-4, 2, -26] as [number, number, number], r: 5, color: '#c4b5fd', opacity: 0.014 },
    ],
    []
  );

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.r, 16, 16]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={c.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══ NORTHERN-LIGHTS RIBBONS — flowing sine glow band ═══ */
function AuroraRibbons() {
  const refs = useRef<THREE.Mesh[]>([]);
  const count = 16;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const m = refs.current[i];
      if (!m) return;
      const p = i / (count - 1);
      const x = (p - 0.5) * 38;
      const y =
        Math.sin(t * 0.55 + p * 6) * 1.6 +
        Math.sin(t * 0.2 + p * 3) * 0.9 +
        p * 7 -
        3.5;
      const z = -15 + Math.sin(t * 0.3 + p * 4) * 1.4;
      m.position.set(x, y, z);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + 0.045 * Math.sin(t * 0.8 + p * 8);
    }
  });

  const colors = ['#2dd4a7', '#8b5cf6', '#e879f9'];

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[2.4, 12, 12]} />
          <meshBasicMaterial
            color={colors[i % 3]}
            transparent
            opacity={0.05}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══ COSMIC DUST — floating close particles ═══ */
function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 350;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 32;
      a[i * 3 + 1] = (Math.random() - 0.5) * 32;
      a[i * 3 + 2] = (Math.random() - 0.5) * 22 - 5;
    }
    return a;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.01;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#99f6e4"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══ COMET — periodic streak ═══ */
function Comet() {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.16) % 13;
    if (t < 0.55) {
      ref.current.visible = true;
      if (trailRef.current) trailRef.current.visible = true;
      const progress = t / 0.55;
      const x = -12 + progress * 24;
      const y = 6 - progress * 9;
      ref.current.position.set(x, y, -4);
      if (trailRef.current) {
        trailRef.current.position.set(x - 0.3, y + 0.15, -4);
        const s = 1 - progress;
        trailRef.current.scale.set(s * 2, s * 0.3, 1);
      }
    } else {
      ref.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
    }
  });

  return (
    <group>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial color="#d1fae5" transparent opacity={0.95} />
      </mesh>
      <mesh ref={trailRef} visible={false}>
        <planeGeometry args={[1.2, 0.02]} />
        <meshBasicMaterial
          color="#99f6e4"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ═══ MOUSE PARALLAX + CAMERA BREATHING ═══ */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.pointer.y * 0.35 - state.camera.position.y) * 0.02;
    state.camera.position.z = 5 + Math.sin(t * 0.08) * 0.15;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══ MAIN EXPORT ═══ */
export default function NebulaBackground3D() {
  const [lowFx, setLowFx] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      setLowFx(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* CSS fallback wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 28% 12%, rgba(20,184,166,0.07) 0%, transparent 45%), ' +
            'radial-gradient(ellipse at 72% 82%, rgba(139,92,246,0.06) 0%, transparent 45%), ' +
            'radial-gradient(ellipse at 55% 45%, rgba(232,121,249,0.025) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 50% 50%, #05121a 0%, #030811 50%, #020509 100%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={lowFx ? [1, 1] : [1, 1.5]}
      >
        <Suspense fallback={null}>
          <StarLayer count={lowFx ? 2200 : 4400} radius={65} size={0.055} speed={0.003} baseOpacity={0.6} />
          <StarLayer count={lowFx ? 600 : 1300} radius={38} size={0.09} speed={0.006} baseOpacity={0.75} />
          <StarLayer count={lowFx ? 50 : 150} radius={22} size={0.16} speed={0.012} baseOpacity={0.9} />
          <StarLayer count={lowFx ? 8 : 24} radius={12} size={0.3} speed={0.02} baseOpacity={1} />

          <NebulaClouds />
          <AuroraRibbons />
          <CosmicDust />
          <Comet />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}