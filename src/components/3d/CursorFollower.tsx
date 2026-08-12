import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function CursorShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetPos] = useState(() => ({ x: 0, y: 0 }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPos.x = x * 3;
      targetPos.y = y * 3;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [targetPos]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += (targetPos.x - meshRef.current.position.x) * 0.08;
      meshRef.current.position.y += (targetPos.y - meshRef.current.position.y) * 0.08;
      meshRef.current.rotation.x += 0.015;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={0.6}
        wireframe
      />
    </mesh>
  );
}

export default function CursorFollower() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <CursorShape />
      </Canvas>
    </div>
  );
}
