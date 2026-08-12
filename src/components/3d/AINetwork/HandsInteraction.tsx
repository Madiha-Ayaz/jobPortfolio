import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;

function Finger({
  base, length, thickness, angle, phase,
}: {
  base: THREE.Vector3; length: number; thickness: number;
  angle: number; phase: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = angle + Math.sin(t * 1.5 + phase) * 0.06;
  });
  return (
    <group ref={ref} position={base.toArray()}>
      <mesh>
        <capsuleGeometry args={[thickness, length, 4, 8]} />
        <meshStandardMaterial color="#d4d8e0" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  );
}

function RoboticHand() {
  const groupRef = useRef<THREE.Group>(null);
  const jointRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.08 - 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.04;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
    jointRefs.current.forEach((j, i) => {
      if (j) j.rotation.x = Math.sin(t * 2.0 + i * 0.8) * 0.04;
    });
  });

  const palmGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.18, -0.12);
    shape.quadraticCurveTo(-0.22, 0.15, -0.12, 0.22);
    shape.quadraticCurveTo(0.0, 0.28, 0.12, 0.22);
    shape.quadraticCurveTo(0.22, 0.15, 0.18, -0.12);
    shape.quadraticCurveTo(0.0, -0.18, -0.18, -0.12);
    const extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const fingerConfigs = useMemo(() => [
    { base: new THREE.Vector3(-0.14, 0.18, 0.03), length: 0.22, thickness: 0.028, angle: 0.3, phase: 0 },
    { base: new THREE.Vector3(-0.04, 0.24, 0.03), length: 0.26, thickness: 0.030, angle: 0.2, phase: 1 },
    { base: new THREE.Vector3(0.06, 0.24, 0.03), length: 0.26, thickness: 0.030, angle: 0.25, phase: 2 },
    { base: new THREE.Vector3(0.15, 0.18, 0.03), length: 0.20, thickness: 0.026, angle: 0.35, phase: 3 },
    { base: new THREE.Vector3(0.20, 0.04, 0.03), length: 0.14, thickness: 0.024, angle: 1.2, phase: 4 },
  ], []);

  return (
    <group ref={groupRef}>
      <mesh geometry={palmGeo} position={[0, 0, -0.03]} rotation={[0, 0, -Math.PI * 0.4]}>
        <meshStandardMaterial color="#e0e4ec" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <capsuleGeometry args={[0.06, 0.20, 4, 8]} />
        <meshStandardMaterial color="#c8ccd4" metalness={0.85} roughness={0.15} />
      </mesh>
      {[0.04, -0.04].map((z, i) => (
        <mesh key={`joint-${i}`} position={[0, -0.12, z]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#a0a8b8" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, -0.24, 0]}>
        <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.85} roughness={0.15} />
      </mesh>
      {fingerConfigs.map((fc, i) => (
        <group key={`finger-${i}`} ref={(el) => { if (el) jointRefs.current[i] = el; }}>
          <Finger {...fc} />
        </group>
      ))}
      <pointLight position={[0, 0.1, 0.15]} intensity={0.3} color="#8ED8FF" distance={1} />
    </group>
  );
}

function HumanHand() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.06 + 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.25 + 1.0) * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.4 + 0.5) * 0.04;
    }
  });

  const palmGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.16, -0.10);
    shape.quadraticCurveTo(-0.19, 0.14, -0.10, 0.20);
    shape.quadraticCurveTo(0.0, 0.24, 0.10, 0.20);
    shape.quadraticCurveTo(0.19, 0.14, 0.16, -0.10);
    shape.quadraticCurveTo(0.0, -0.15, -0.16, -0.10);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 });
  }, []);

  const skinColor = "#c9a08a";
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: skinColor, roughness: 0.7, metalness: 0.05,
  }), []);

  const fingers = useMemo(() => [
    { base: new THREE.Vector3(-0.12, 0.16, 0.025), length: 0.18, thickness: 0.026, angle: 0.25, phase: 0 },
    { base: new THREE.Vector3(-0.03, 0.21, 0.025), length: 0.22, thickness: 0.028, angle: 0.15, phase: 0.8 },
    { base: new THREE.Vector3(0.05, 0.21, 0.025), length: 0.22, thickness: 0.028, angle: 0.18, phase: 1.6 },
    { base: new THREE.Vector3(0.13, 0.16, 0.025), length: 0.18, thickness: 0.024, angle: 0.30, phase: 2.4 },
    { base: new THREE.Vector3(0.17, 0.04, 0.025), length: 0.12, thickness: 0.022, angle: 1.1, phase: 3.2 },
  ], []);

  return (
    <group ref={groupRef}>
      <mesh geometry={palmGeo} position={[0, 0, -0.025]} rotation={[0, 0, -Math.PI * 0.35]} material={skinMat} />
      <mesh position={[0, -0.04, 0]}>
        <capsuleGeometry args={[0.05, 0.16, 4, 8]} />
        <meshStandardMaterial color="#b89080" roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.04, -0.02]}>
        <boxGeometry args={[0.28, 0.12, 0.06]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.12, -0.02]}>
        <boxGeometry args={[0.24, 0.20, 0.05]} />
        <meshStandardMaterial color="#14142a" roughness={0.6} metalness={0.2} />
      </mesh>
      {fingers.map((fc, i) => (
        <group key={`hf-${i}`}>
          <group rotation={[fc.angle + Math.sin(fc.phase) * 0.05, 0, 0]} position={fc.base.toArray()}>
            <mesh>
              <capsuleGeometry args={[fc.thickness, fc.length, 4, 8]} />
              <primitive object={skinMat} attach="material" />
            </mesh>
          </group>
        </group>
      ))}
      <pointLight position={[0, 0.1, 0.12]} intensity={0.3} color="#ffeedd" distance={1} />
    </group>
  );
}

function EnergyInteraction() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh[]>([]);

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const life = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3] = (Math.random()-0.5)*0.3;
      pos[i*3+1] = (Math.random()-0.5)*0.3;
      pos[i*3+2] = (Math.random()-0.5)*0.2;
      vel[i*3] = (Math.random()-0.5)*0.02;
      vel[i*3+1] = (Math.random()-0.5)*0.02;
      vel[i*3+2] = (Math.random()-0.5)*0.02;
      life[i] = Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo, vel, life };
  }, []);

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.05, 0.06, 32), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const posAttr = particleGeo.geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleGeo.life[i] += 0.008;
      if (particleGeo.life[i] > 1) {
        particleGeo.life[i] = 0;
        arr[i*3] = (Math.random()-0.5)*0.15;
        arr[i*3+1] = (Math.random()-0.5)*0.15;
        arr[i*3+2] = (Math.random()-0.5)*0.1;
      }
      arr[i*3] += particleGeo.vel[i*3] * Math.sin(t * 3 + i);
      arr[i*3+1] += particleGeo.vel[i*3+1] * Math.cos(t * 2.5 + i * 0.5);
      arr[i*3+2] += particleGeo.vel[i*3+2] * Math.sin(t * 2 + i * 0.3);
    }
    posAttr.needsUpdate = true;

    ringRef.current.forEach((ring, i) => {
      const phase = (t * 0.6 + i * 0.33) % 1;
      ring.scale.setScalar(0.5 + phase * 2.5);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      <points geometry={particleGeo.geo}>
        <pointsMaterial color="#5EEAD4" size={0.02} transparent opacity={0.8}
          blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      {[0, 1, 2].map((i) => (
        <mesh key={`ering-${i}`} ref={(el) => { if (el) ringRef.current[i] = el; }}
          geometry={ringGeo} rotation={[Math.PI/2, 0, i * 0.5]}>
          <meshBasicMaterial color="#00C8FF" transparent opacity={0.3}
            side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <pointLight color="#5EEAD4" intensity={3} distance={2} />
      <pointLight color="#00C8FF" intensity={2} distance={1.5} />
    </group>
  );
}

export default function HandsInteraction() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[-3.8, 0.2, 0.5]} rotation={[0, 0.3, 0]}>
        <RoboticHand />
      </group>
      <group position={[3.8, 0.2, 0.5]} rotation={[0, -0.3, 0]}>
        <HumanHand />
      </group>
      <group position={[0, 0.4, 1.2]}>
        <EnergyInteraction />
      </group>
    </group>
  );
}
