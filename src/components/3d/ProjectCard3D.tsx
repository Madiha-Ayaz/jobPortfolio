import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

function Card3D({ title, description, tech, color, position, rotation = [0, 0, 0] }: ProjectCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle float animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      // Smooth rotation on hover
      const targetRotY = hovered ? 0.2 : 0;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1;
      groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1;
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
    >
      {/* Card body */}
      <RoundedBox args={[3, 4, 0.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Title text on card */}
      <Text
        position={[0, 1.3, 0.11]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        position={[0, 0.3, 0.11]}
        fontSize={0.12}
        color="#e0e0e0"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.6}
        textAlign="center"
      >
        {description.substring(0, 100)}...
      </Text>

      {/* Tech stack badges */}
      {tech.slice(0, 3).map((t, i) => (
        <Text
          key={i}
          position={[-0.9 + i * 0.9, -0.7, 0.11]}
          fontSize={0.1}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          {t}
        </Text>
      ))}

      {/* Glow ring on hover */}
      {hovered && (
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[1.8, 2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

interface ProjectCard3DProps {
  projects: Array<{ title: string; description: string; tech: string[]; color?: string }>;
}

export default function ProjectCard3D({ projects }: ProjectCard3DProps) {
  const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} intensity={1.2} color="#ec4899" />
        <pointLight position={[0, 5, -5]} intensity={1} color="#8b5cf6" />

        {projects.slice(0, 6).map((p, i) => {
          const angle = (i / Math.min(projects.length, 6)) * Math.PI * 2;
          const radius = 4;
          return (
            <Card3D
              key={i}
              title={p.title}
              description={p.description}
              tech={p.tech}
              color={p.color || colors[i % colors.length]}
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 2]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
