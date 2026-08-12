import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CORE_PARTICLES = 300;
const NEURAL_LINKS = 60;

export default function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  const coreGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(CORE_PARTICLES * 3);
    const basePos = new Float32Array(CORE_PARTICLES * 3);
    for (let i = 0; i < CORE_PARTICLES; i++) {
      const r = Math.random() * 0.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      basePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      basePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      basePos[i * 3 + 2] = r * Math.cos(phi);
      pos[i * 3] = basePos[i * 3];
      pos[i * 3 + 1] = basePos[i * 3 + 1];
      pos[i * 3 + 2] = basePos[i * 3 + 2];
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo, basePos };
  }, []);

  const linkData = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < NEURAL_LINKS; i++) {
      const a = new THREE.Vector3(
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.7
      );
      const b = new THREE.Vector3(
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.7
      );
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  const ringGeo = useMemo(() => new THREE.TorusGeometry(1, 0.004, 8, 80), []);
  const rings = useMemo(() => [
    { radius: 0.28, rot: [0.5, 0.3, 0] as [number, number, number], color: "#00C8FF" },
    { radius: 0.40, rot: [1.2, 0.8, 0] as [number, number, number], color: "#8B5CF6" },
    { radius: 0.52, rot: [0.2, 1.5, 0] as [number, number, number], color: "#5EEAD4" },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (pointsRef.current) {
      const posAttr = coreGeo.geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const base = coreGeo.basePos;
      for (let i = 0; i < CORE_PARTICLES; i++) {
        const phase = i * 0.7;
        const breathe = 1.0 + Math.sin(t * 0.8 + phase) * 0.12;
        const orbit = t * 0.3 + phase * 3.14159;
        const bx = base[i * 3] * breathe;
        const bz = base[i * 3 + 2] * breathe;
        arr[i * 3] = Math.cos(orbit) * bx;
        arr[i * 3 + 1] = base[i * 3 + 1] * breathe + Math.sin(t * 1.2 + phase) * 0.08;
        arr[i * 3 + 2] = Math.sin(orbit) * bz;
      }
      posAttr.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      const s = 1.0 + Math.sin(t * 1.5) * 0.06;
      groupRef.current.scale.setScalar(s);
    }

    if (innerGlowRef.current) {
      innerGlowRef.current.material.opacity = 0.4 + Math.sin(t * 2.0) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={coreGeo.geo}>
        <pointsMaterial
          color="#00C8FF"
          size={0.035}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <lineSegments geometry={linkData}>
        <lineBasicMaterial color="#5EEAD4" transparent opacity={0.25} />
      </lineSegments>

      <mesh ref={innerGlowRef}>
        <icosahedronGeometry args={[0.18, 2]} />
        <meshBasicMaterial
          color="#8ED8FF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {rings.map((ring, i) => (
        <mesh
          key={`ring-${i}`}
          geometry={ringGeo}
          scale={[ring.radius, ring.radius, ring.radius]}
          rotation={ring.rot}
        >
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      <pointLight color="#00C8FF" intensity={2} distance={3} />
      <pointLight color="#8B5CF6" intensity={1.5} distance={2} />
    </group>
  );
}
