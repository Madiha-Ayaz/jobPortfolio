import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════
   INTERACTIVE 3D ICON SCENE
   A small, reusable 3D emblem: glowing core cube with
   orbiting rings + particles. Great for section accents.
   ═══════════════════════════════════════════════ */

function EmblemScene() {
  const mesh = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const points = useRef<THREE.Points>(null);

  const positions = useMemo3D(() => {
    const count = 160;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.5;
      mesh.current.rotation.y += delta * 0.6;
      mesh.current.position.x = Math.sin(t * 0.5) * 0.15;
      mesh.current.position.y = Math.cos(t * 0.5) * 0.12;
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.4;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.3;
    if (points.current) points.current.rotation.y += delta * 0.15;
  });

  return (
    <group>
      <ambientLight intensity={0.6} color={0xc7d2fe} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color={0xffffff} />
      <pointLight position={[-3, -2, -3]} intensity={1.0} color={0x818cf8} />

      <mesh ref={mesh}>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshStandardMaterial
          color={0x6366f1}
          emissive={0x4f46e5}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ringA} rotation={[0.6, 0, 0]}>
        <torusGeometry args={[0.9, 0.025, 12, 64]} />
        <meshBasicMaterial color={0x818cf8} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringB} rotation={[1.2, 0.5, 0]}>
        <torusGeometry args={[1.05, 0.02, 12, 64]} />
        <meshBasicMaterial color={0x38bdf8} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={160} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color="#a5b4fc" transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// Small memo helper local to this file (kept dependency-free)
function useMemo3D<T>(fn: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = fn();
  return ref.current;
}

export default function Emblem3D({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(true);
  }, []);

  if (!enabled) {
    return <div className={`${className} flex items-center justify-center`} aria-hidden="true">
      <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 animate-pulse" />
    </div>;
  }

  return (
    <div className={`${className} pointer-events-none`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <EmblemScene />
      </Canvas>
    </div>
  );
}