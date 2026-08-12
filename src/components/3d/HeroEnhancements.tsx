import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   Shooting stars: streak across the scene every few seconds.
   ============================================================ */
export function ShootingStars({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const trails = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      delay: i * 2.2,
      fromX: -15 + Math.random() * 30,
      fromY: 8 + Math.random() * 6,
      toX: 15,
      toY: -2 - Math.random() * 4,
      duration: 1.4 + Math.random() * 0.8,
    }));
  }, [count]);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const trail = trails[i];
      const cycle = (t + trail.delay) % 4.5;
      if (cycle > trail.duration) {
        child.visible = false;
        return;
      }
      child.visible = true;
      const p = cycle / trail.duration;
      const x = THREE.MathUtils.lerp(trail.fromX, trail.toX, p);
      const y = THREE.MathUtils.lerp(trail.fromY, trail.toY, p);
      const z = -5 + Math.sin(p * Math.PI) * 2;
      child.position.set(x, y, z);
      const opacity = Math.sin(p * Math.PI);
      (child as THREE.Mesh).material && ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });
  return (
    <group ref={groupRef}>
      {trails.map((_, i) => (
        <mesh key={i} visible={false}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   Auto-orbiting tech badges around the Earth.
   Each badge is a small glowing sphere with a different hue.
   ============================================================ */
const BADGE_DATA = [
  { color: '#61dafb', label: 'React' },
  { color: '#ffffff', label: 'Next' },
  { color: '#3178c6', label: 'TS' },
  { color: '#f7df1e', label: 'JS' },
  { color: '#00d8ff', label: 'Three' },
  { color: '#ff6f00', label: 'GSAP' },
  { color: '#10b981', label: 'Node' },
  { color: '#a855f7', label: 'AI' },
];

export function OrbitingBadges() {
  const groupRef = useRef<THREE.Group>(null);
  const badges = useRef(
    BADGE_DATA.map((b, i) => ({
      ...b,
      angle: (i / BADGE_DATA.length) * Math.PI * 2,
      radius: 3.2 + (i % 2) * 0.3,
      yOffset: (i % 3 - 1) * 0.8,
    }))
  ).current;
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const b = badges[i];
      const a = b.angle + t * 0.15;
      child.position.set(Math.cos(a) * b.radius, b.yOffset + Math.sin(t + i) * 0.2, Math.sin(a) * b.radius);
      child.lookAt(state.camera.position);
    });
  });
  return (
    <group ref={groupRef}>
      {badges.map((b, i) => (
        <group key={i}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.8} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={b.color} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}