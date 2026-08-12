/**
 * CosmicBackground v2 — Premium 3D space atmosphere.
 *
 * Features:
 *  - 4-layer starfield with per-vertex color variety + twinkle
 *  - Milky Way diagonal band (soft gradient plane)
 *  - 3 organic nebula clouds (violet, cyan, pink)
 *  - Cosmic dust particles (floating close particles)
 *  - Occasional shooting star
 *  - Mouse parallax + subtle camera breathing
 *  - Depth fog via size attenuation
 *  - Low-FX fallback for mobile
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

/* ═══ TWINKLE STARFIELD — per-vertex color + sine twinkle ═══ */
function TwinkleStars({
  count,
  radius,
  size,
  speed,
  baseOpacity = 0.9,
  zOffset = 0,
}: {
  count: number;
  radius: number;
  size: number;
  speed: number;
  baseOpacity?: number;
  zOffset?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, twinklePhases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const palette = [
      new THREE.Color('#f1f5f9'), // bright white
      new THREE.Color('#e2e8f0'), // soft white
      new THREE.Color('#c4b5fd'), // violet tint
      new THREE.Color('#bae6fd'), // cool blue
      new THREE.Color('#fde68a'), // warm gold
      new THREE.Color('#d4f0ff'), // ice blue
      new THREE.Color('#f0abfc'), // pink hint
    ];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.35 + Math.random() * 0.65);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) + zOffset;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const brightness = 0.5 + Math.random() * 0.5;
      col[i * 3] = c.r * brightness;
      col[i * 3 + 1] = c.g * brightness;
      col[i * 3 + 2] = c.b * brightness;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, colors: col, twinklePhases: phases };
  }, [count, radius, zOffset]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.03;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
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

/* ═══ MILKY WAY — diagonal soft gradient band ═══ */
function MilkyWay() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.002;
  });
  return (
    <group>
      <mesh ref={ref} rotation={[Math.PI / 2.6, 0.15, 0.35]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#bfa0e0"
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, -0.1, 0.3]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial
          color="#8090d0"
          transparent
          opacity={0.035}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ═══ NEBULA CLOUDS — organic, multi-sphere clusters ═══ */
function NebulaClouds() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003;
  });

  const clouds = useMemo(
    () => [
      // Violet cluster — top right
      { pos: [9, 6, -16] as [number, number, number], r: 5, color: '#7c3aed', opacity: 0.03 },
      { pos: [11, 4, -18] as [number, number, number], r: 3.5, color: '#8b5cf6', opacity: 0.02 },
      { pos: [7, 8, -20] as [number, number, number], r: 4, color: '#a78bfa', opacity: 0.015 },
      // Cyan cluster — bottom left
      { pos: [-11, -5, -17] as [number, number, number], r: 4.5, color: '#06b6d4', opacity: 0.025 },
      { pos: [-9, -7, -19] as [number, number, number], r: 3, color: '#0891b2', opacity: 0.02 },
      { pos: [-13, -3, -22] as [number, number, number], r: 3.5, color: '#22d3ee', opacity: 0.012 },
      // Pink accent — center deep
      { pos: [2, -3, -28] as [number, number, number], r: 7, color: '#ec4899', opacity: 0.015 },
      { pos: [-1, 1, -30] as [number, number, number], r: 5, color: '#f472b6', opacity: 0.01 },
      // Warm glow — far
      { pos: [5, 10, -35] as [number, number, number], r: 8, color: '#f59e0b', opacity: 0.006 },
    ],
    []
  );

  return (
    <group ref={ref}>
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

/* ═══ COSMIC DUST — small floating particles ═══ */
function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 400;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 30;
      a[i * 3 + 1] = (Math.random() - 0.5) * 30;
      a[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return a;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.008;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#c4b5fd"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ═══ SHOOTING STAR — rare streak across the sky ═══ */
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.15) % 12;
    if (t < 0.6) {
      ref.current.visible = true;
      if (trailRef.current) trailRef.current.visible = true;
      const progress = t / 0.6;
      const x = -10 + progress * 20;
      const y = 5 - progress * 8;
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
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      <mesh ref={trailRef} visible={false}>
        <planeGeometry args={[1.2, 0.02]} />
        <meshBasicMaterial
          color="#e0e7ff"
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
  const { camera, mouse } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Mouse drift
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.02;
    // Subtle breathing
    camera.position.z = 5 + Math.sin(t * 0.08) * 0.15;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══ MAIN EXPORT ═══ */
export default function CosmicBackground() {
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
      {/* CSS fallback — matches #08081a system */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 15%, rgba(124,58,237,0.08) 0%, transparent 45%), ' +
            'radial-gradient(ellipse at 70% 85%, rgba(6,182,212,0.05) 0%, transparent 45%), ' +
            'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.02) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 50% 50%, #0c0c24 0%, #08081a 50%, #040410 100%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={lowFx ? [1, 1] : [1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* Deep stars — dim, slow, violet-tinted */}
          <TwinkleStars
            count={lowFx ? 2500 : 5000}
            radius={65}
            size={0.055}
            speed={0.003}
            baseOpacity={0.65}
          />
          {/* Mid stars — medium brightness */}
          <TwinkleStars
            count={lowFx ? 700 : 1500}
            radius={38}
            size={0.09}
            speed={0.006}
            baseOpacity={0.8}
          />
          {/* Close bright stars — sparse, prominent */}
          <TwinkleStars
            count={lowFx ? 60 : 180}
            radius={22}
            size={0.16}
            speed={0.012}
            baseOpacity={0.92}
          />
          {/* Very close sparkle stars — very few, large */}
          <TwinkleStars
            count={lowFx ? 10 : 30}
            radius={12}
            size={0.3}
            speed={0.02}
            baseOpacity={1.0}
          />

          <MilkyWay />
          <NebulaClouds />
          <CosmicDust />
          <ShootingStar />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
