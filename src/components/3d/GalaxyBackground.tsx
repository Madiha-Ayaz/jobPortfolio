/**
 * GalaxyBackground — continuous 3D galaxy/space background.
 * Stars, spiral nebula, Earth, distant planet, shooting star, mouse parallax.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function GalaxyNebula() {
  const points = useRef<THREE.Points>(null);
  const count = 4000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const arms = 4;
  const radius = 8;
  const spin = 1.2;
  const randomness = 0.6;
  const colorInside = new THREE.Color("#ff7eb6");
  const colorOutside = new THREE.Color("#3b82f6");
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 0.5) * radius;
    const armAngle = (i % arms / arms) * Math.PI * 2;
    const spinAngle = r * spin;
    const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness;
    const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * 0.4;
    const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness;
    const angle = armAngle + spinAngle;
    positions[i3] = Math.cos(angle) * r + rx;
    positions[i3 + 1] = ry;
    positions[i3 + 2] = Math.sin(angle) * r + rz;
    const c = colorInside.clone().lerp(colorOutside, r / radius);
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }
  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.15;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.2;
    if (glowRef.current) {
      const s = 1.05 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      glowRef.current.scale.set(s, s, s);
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[6, -2, -8]}>
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.55, 64, 64]} />
          <meshBasicMaterial color="#4f9eff" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1.3, 96, 96]} />
          <meshStandardMaterial color="#1e40af" emissive="#0c1e4a" emissiveIntensity={0.3} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.34, 64, 64]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.18} roughness={1} />
        </mesh>
      </group>
    </Float>
  );
}

function DistantPlanet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.1;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.3;
  });
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={[-8, 3, -12]}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[0.7, 64, 64]} />
          <MeshDistortMaterial color="#a855f7" attach="material" distort={0.3} speed={1.5} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[1.0, 1.4, 64]} />
          <meshBasicMaterial color="#f0abfc" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#c4b5fd" transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function MouseParallax() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.3) % 8;
    if (t < 0.5) {
      ref.current.visible = true;
      ref.current.position.set(-8 + t * 8, 4 - t * 6, -3);
    } else {
      ref.current.visible = false;
    }
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

export default function GalaxyBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a1e 40%, #000000 100%)" }} />
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#a78bfa" />
          <pointLight position={[-10, -10, 5]} intensity={1.0} color="#ec4899" />
          <pointLight position={[0, 10, -10]} intensity={0.8} color="#3b82f6" />
          <Stars radius={60} depth={50} count={3500} factor={5} fade speed={1} />
          <GalaxyNebula />
          <CosmicDust />
          <Earth />
          <DistantPlanet />
          <ShootingStar />
          <MouseParallax />
        </Suspense>
      </Canvas>
    </div>
  );
}
