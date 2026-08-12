import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitConfig {
  type: string;
  radius: number;
  speed: number;
  yOffset: number;
  size: number;
  phase: number;
  emissive: string;
}

const ORBIT_CONFIGS: OrbitConfig[] = [
  { type: "laptop",     radius: 3.2, speed: 0.18,  yOffset: 0.8,  size: 0.65, phase: 0,    emissive: "#00C8FF" },
  { type: "server",     radius: 3.5, speed: 0.14,  yOffset: -0.6, size: 0.55, phase: 0.8,  emissive: "#8B5CF6" },
  { type: "satellite",  radius: 3.8, speed: 0.22,  yOffset: 1.2,  size: 0.50, phase: 1.6,  emissive: "#5EEAD4" },
  { type: "chip",       radius: 3.0, speed: 0.25,  yOffset: -1.0, size: 0.48, phase: 2.4,  emissive: "#00C8FF" },
  { type: "database",   radius: 3.6, speed: 0.16,  yOffset: 0.4,  size: 0.55, phase: 3.2,  emissive: "#8B5CF6" },
  { type: "phone",      radius: 3.3, speed: 0.20,  yOffset: -1.4, size: 0.50, phase: 4.0,  emissive: "#F472B6" },
  { type: "cloud",      radius: 3.7, speed: 0.12,  yOffset: 1.6,  size: 0.60, phase: 4.8,  emissive: "#00C8FF" },
  { type: "blockchain", radius: 3.1, speed: 0.28,  yOffset: -0.2, size: 0.45, phase: 5.6,  emissive: "#8B5CF6" },
  { type: "document",   radius: 3.4, speed: 0.19,  yOffset: 1.0,  size: 0.48, phase: 0.4,  emissive: "#5EEAD4" },
  { type: "iot",        radius: 3.9, speed: 0.15,  yOffset: -1.2, size: 0.42, phase: 1.2,  emissive: "#FBBF24" },
  { type: "panel",      radius: 3.0, speed: 0.21,  yOffset: 0.2,  size: 0.52, phase: 2.0,  emissive: "#8B5CF6" },
  { type: "chip2",      radius: 3.5, speed: 0.24,  yOffset: -0.8, size: 0.44, phase: 2.8,  emissive: "#5EEAD4" },
];

function OrbitObject({ config }: { config: OrbitConfig }) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const size = config.size;
  const c = config.emissive;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = config.phase + t * config.speed;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(a) * config.radius,
        config.yOffset + Math.sin(t * 0.8 + config.phase) * 0.3,
        Math.sin(a) * config.radius
      );
      ref.current.rotation.y = t * 0.5 + config.phase;
      ref.current.rotation.x = Math.sin(t * 0.3 + config.phase) * 0.2;
    }
    if (glowRef.current) {
      const s = 1.0 + Math.sin(t * 2.5 + config.phase * 3) * 0.2;
      glowRef.current.scale.setScalar(s);
    }
  });

  const renderShape = () => {
    switch (config.type) {
      case "laptop":
        return (
          <group>
            <mesh position={[0, size * 0.15, 0]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[size * 1.0, size * 0.7, size * 0.04]} />
              <meshStandardMaterial color="#111833" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, size * 0.15, size * 0.01]} rotation={[-0.25, 0, 0]}>
              <planeGeometry args={[size * 0.88, size * 0.58]} />
              <meshStandardMaterial
                color={c}
                emissive={c}
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, -size * 0.1, size * 0.12]} rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
              <boxGeometry args={[size * 1.05, size * 0.75, size * 0.03]} />
              <meshStandardMaterial color="#0a1020" emissive={c} emissiveIntensity={1.0} />
            </mesh>
          </group>
        );

      case "server":
        return (
          <group>
            {[0, 1, 2].map((i) => (
              <group key={i} position={[0, (i - 1) * size * 0.28, 0]}>
                <mesh>
                  <boxGeometry args={[size * 0.9, size * 0.22, size * 0.7]} />
                  <meshStandardMaterial color="#111833" metalness={0.5} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0, size * 0.36]}>
                  <planeGeometry args={[size * 0.7, size * 0.15]} />
                  <meshStandardMaterial
                    color={c}
                    emissive={c}
                    emissiveIntensity={2.0}
                    toneMapped={false}
                  />
                </mesh>
                {Array.from({ length: 4 }).map((_, j) => (
                  <mesh key={j} position={[(-0.3 + j * 0.2) * size, 0, size * 0.36]}>
                    <sphereGeometry args={[size * 0.02, 8, 8]} />
                    <meshBasicMaterial color={c} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        );

      case "satellite":
        return (
          <group>
            <mesh>
              <octahedronGeometry args={[size * 0.3, 0]} />
              <meshStandardMaterial color="#182040" emissive={c} emissiveIntensity={2.0} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-size * 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[size * 0.04, size * 0.7, size * 0.4]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.0} toneMapped={false} />
            </mesh>
            <mesh position={[size * 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[size * 0.04, size * 0.7, size * 0.4]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.0} toneMapped={false} />
            </mesh>
          </group>
        );

      case "chip":
      case "chip2":
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[size * 0.7, size * 0.7, size * 0.12]} />
              <meshStandardMaterial color="#0a1428" emissive={c} emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, size * 0.065]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[size * 0.5, size * 0.5]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.0} toneMapped={false} />
            </mesh>
            {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([dx, dz], i) => (
              <mesh key={i} position={[dx * size * 0.4, 0, dz * size * 0.4]}>
                <boxGeometry args={[size * 0.08, size * 0.04, size * 0.08]} />
                <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.0} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );

      case "database":
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[size * 0.4, size * 0.4, size * 0.7, 16]} />
              <meshStandardMaterial color="#111833" emissive={c} emissiveIntensity={1.5} metalness={0.6} roughness={0.3} />
            </mesh>
            {[0.2, 0, -0.2].map((y, i) => (
              <mesh key={i} position={[0, y * size, 0]}>
                <torusGeometry args={[size * 0.38, size * 0.02, 8, 24]} />
                <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.0} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );

      case "phone":
        return (
          <group>
            <mesh>
              <boxGeometry args={[size * 0.45, size * 0.85, size * 0.06]} />
              <meshStandardMaterial color="#111833" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, size * 0.035]}>
              <planeGeometry args={[size * 0.38, size * 0.72]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
          </group>
        );

      case "cloud":
        return (
          <group>
            <mesh>
              <sphereGeometry args={[size * 0.35, 16, 16]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.0} transparent opacity={0.85} toneMapped={false} />
            </mesh>
            <mesh position={[-size * 0.2, -size * 0.05, 0]}>
              <sphereGeometry args={[size * 0.22, 12, 12]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.5} transparent opacity={0.75} toneMapped={false} />
            </mesh>
            <mesh position={[size * 0.18, -size * 0.08, 0]}>
              <sphereGeometry args={[size * 0.2, 12, 12]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.5} transparent opacity={0.75} toneMapped={false} />
            </mesh>
          </group>
        );

      case "blockchain":
        return (
          <group>
            <mesh>
              <boxGeometry args={[size * 0.6, size * 0.6, size * 0.6]} />
              <meshStandardMaterial color="#181030" emissive={c} emissiveIntensity={1.5} metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh>
              <boxGeometry args={[size * 0.72, size * 0.72, size * 0.72]} />
              <meshBasicMaterial color={c} wireframe transparent opacity={0.6} />
            </mesh>
          </group>
        );

      case "document":
        return (
          <group>
            <mesh>
              <boxGeometry args={[size * 0.6, size * 0.8, size * 0.04]} />
              <meshStandardMaterial color="#111833" emissive={c} emissiveIntensity={1.0} />
            </mesh>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[0, (i - 2) * size * 0.12, size * 0.025]}>
                <planeGeometry args={[size * 0.4, size * 0.06]} />
                <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.5} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );

      case "iot":
        return (
          <group>
            <mesh>
              <torusGeometry args={[size * 0.3, size * 0.1, 12, 24]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.5} metalness={0.5} roughness={0.3} toneMapped={false} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[size * 0.15, 1]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
            </mesh>
          </group>
        );

      case "panel":
        return (
          <group>
            <mesh>
              <boxGeometry args={[size * 0.8, size * 0.5, size * 0.03]} />
              <meshStandardMaterial color="#111833" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, size * 0.02]}>
              <planeGeometry args={[size * 0.7, size * 0.4]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <boxGeometry args={[size * 0.5, size * 0.5, size * 0.5]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.0} toneMapped={false} />
          </mesh>
        );
    }
  };

  return (
    <group ref={ref}>
      <group scale={1}>
        {renderShape()}
        {/* Glow halo */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 0.6, 12, 12]} />
          <meshBasicMaterial
            color={c}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Point light for local illumination */}
        <pointLight color={c} intensity={2.5} distance={2.5} />
      </group>
    </group>
  );
}

export default function OrbitingObjects() {
  return (
    <group>
      {ORBIT_CONFIGS.map((config, i) => (
        <OrbitObject key={`orbit-${i}`} config={config} />
      ))}
    </group>
  );
}
