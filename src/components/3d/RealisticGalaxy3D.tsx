/**
 * RealisticGalaxy3D - Enhanced prominent galaxy with colorful stars.
 * Multi-layer starfield + colorful nebula + prominent Milky Way.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Colorful starfield with vertex colors for spectrum effect */
function StarLayer({ count, radius, size, speed, opacity = 0.92, zOffset = 0 }: {
  count: number; radius: number; size: number; speed: number; opacity?: number; zOffset?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffd8b0"), new THREE.Color("#ffb0d8"),
      new THREE.Color("#b0d8ff"), new THREE.Color("#d8b0ff"),
      new THREE.Color("#ffffff"), new THREE.Color("#b0ffd8"),
      new THREE.Color("#ffe8b0"),
    ];
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) + zOffset;
      const p = palette[Math.floor(Math.random() * palette.length)];
      const t = 0.6 + Math.random() * 0.4;
      col[i * 3] = p.r * t; col[i * 3 + 1] = p.g * t; col[i * 3 + 2] = p.b * t;
    }
    return { positions: pos, colors: col };
  }, [count, radius, zOffset]);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.06;
    }
  });
  return <points ref={ref}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
    </bufferGeometry>
    <pointsMaterial size={size} sizeAttenuation vertexColors transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
  </points>;
}

/** Bright, colorful Milky Way with 3 colored bands */
function MilkyWayBand() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * 0.003; });
  return <group>
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0.1, 0.3]}>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial color="#bfa0e0" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
    <mesh rotation={[Math.PI / 2.5, -0.05, 0.25]}>
      <planeGeometry args={[70, 70]} />
      <meshBasicMaterial color="#e0c0a0" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
    <mesh rotation={[Math.PI / 2.3, 0.15, 0.35]}>
      <planeGeometry args={[90, 90]} />
      <meshBasicMaterial color="#8090d0" transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  </group>;
}

/** Colorful nebula clouds */
function NebulaClouds() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.002; });
  const clouds = useMemo(() => [
    [8, 3, 2, "#ff5080"], [-6, -2, 5, "#5080ff"], [12, -4, -3, "#80ff50"],
    [-10, 5, -4, "#ffa040"], [0, -6, 7, "#c080ff"], [15, 2, -5, "#ff60a0"],
  ], []);
  return <group ref={ref}>{clouds.map(([x, y, z, c], i) => (
    <mesh key={i} position={[x as number, y as number, z as number]}>
      <sphereGeometry args={[2.5 + Math.random() * 3, 16, 16]} />
      <meshBasicMaterial color={c as string} transparent opacity={0.04} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  ))}</group>;
}

function CameraParallax() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function RealisticGalaxy3D() {
  return <div className="fixed inset-0 -z-10 pointer-events-none">
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 25%, #0f1430 0%, #080a18 40%, #020308 100%)" }} />
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
      <StarLayer count={6000} radius={70} size={0.07} speed={0.008} opacity={0.90} />
      <StarLayer count={3000} radius={45} size={0.12} speed={0.015} opacity={0.92} />
      <StarLayer count={800} radius={25} size={0.22} speed={0.025} opacity={0.95} />
      <StarLayer count={200} radius={16} size={0.35} speed={0.040} opacity={0.98} />
      <StarLayer count={50} radius={10} size={0.55} speed={0.060} opacity={1.0} />
      <NebulaClouds />
      <MilkyWayBand />
      <CameraParallax />
    </Canvas>
  </div>;
}

