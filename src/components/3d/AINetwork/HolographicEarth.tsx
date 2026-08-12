import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 200;

export default function HolographicEarth() {
  const gridRef = useRef<THREE.Mesh>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  const nodeRef = useRef<THREE.InstancedMesh>(null);
  const pulseRef = useRef<THREE.Group>(null);

  const nodeDummy = useMemo(() => new THREE.Object3D(), []);

  const nodePositions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.52 + Math.random() * 0.06;
      pts.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }
    return pts;
  }, []);

  const arcGeos = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 8; i++) {
      const phi1 = Math.random() * Math.PI;
      const theta1 = Math.random() * Math.PI * 2;
      const phi2 = Math.random() * Math.PI;
      const theta2 = Math.random() * Math.PI * 2;
      const r = 1.52;
      const a = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      );
      const b = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      );
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dist = a.distanceTo(b);
      mid.normalize().multiplyScalar(r + dist * 0.4);
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 40; j++) {
        const t = j / 40;
        const mt = 1 - t;
        const pt = new THREE.Vector3()
          .addScaledVector(a, mt * mt)
          .addScaledVector(mid, 2 * mt * t)
          .addScaledVector(b, t * t);
        pts.push(pt);
      }
      geos.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return geos;
  }, []);

  const ringGeos = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const pts: THREE.Vector3[] = [];
      const r = 1.55 + i * 0.08;
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 0.05, Math.sin(a) * r));
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (gridRef.current) gridRef.current.rotation.y = t * 0.08;
    if (surfaceRef.current) surfaceRef.current.rotation.y = t * 0.08;

    if (nodeRef.current) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const base = nodePositions[i];
        const pulse = Math.sin(t * 2.0 + i * 0.5) * 0.5 + 0.5;
        const scale = 0.015 + pulse * 0.02;
        nodeDummy.position.copy(base);
        nodeDummy.scale.setScalar(scale);
        nodeDummy.updateMatrix();
        nodeRef.current.setMatrixAt(i, nodeDummy.matrix);
      }
      nodeRef.current.instanceMatrix.needsUpdate = true;
    }

    if (pulseRef.current) {
      pulseRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const phase = t * 0.8 + i * 1.2;
          const scale = 1.52 + (phase % 3) * 0.5;
          child.scale.setScalar(scale);
          const opacity = 1.0 - ((phase % 3) / 3);
          (child.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity * 0.25);
        }
      });
    }
  });

  return (
    <group>
      {/* Transparent glass surface */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[1.5, 96, 96]} />
        <meshPhysicalMaterial
          color="#050a1a"
          emissive="#003366"
          emissiveIntensity={0.3}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.9}
          envMapIntensity={1}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe grid */}
      <mesh ref={gridRef}>
        <sphereGeometry args={[1.51, 48, 48]} />
        <meshBasicMaterial
          color="#00C8FF"
          wireframe
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Additional fine grid overlay */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <sphereGeometry args={[1.52, 32, 32]} />
        <meshBasicMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing nodes on surface */}
      <instancedMesh ref={nodeRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#00C8FF" transparent opacity={0.9} />
      </instancedMesh>

      {/* Expanding pulse rings */}
      <group ref={pulseRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={`pulse-${i}`}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color="#8B5CF6"
              transparent
              side={THREE.BackSide}
              depthWrite={false}
              opacity={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Connection arcs across continents */}
      <group>
        {arcGeos.map((geo, i) => (
          <line key={`arc-${i}`} geometry={geo}>
            <lineBasicMaterial color="#00C8FF" transparent opacity={0.3} />
          </line>
        ))}
      </group>

      {/* Latitude/longitude ring lines */}
      {ringGeos.map((geo, i) => (
        <line key={`ring-${i}`} geometry={geo}>
          <lineBasicMaterial
            color={i % 2 === 0 ? "#8B5CF6" : "#00C8FF"}
            transparent
            opacity={0.2}
          />
        </line>
      ))}
    </group>
  );
}
