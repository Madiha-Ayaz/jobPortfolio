/**
 * AIDataNetwork3D - A continuously moving 3D scene showing:
 *   - Digital wireframe Earth with glowing grid
 *   - Human silhouette built from connected nodes
 *   - AI brain/orb core mediating between them
 *   - Orbiting computer/server nodes
 *   - Flowing data particles along curved paths
 *   - Neural network connection lines
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Noise GLSL (reused for organic motion) ─── */
const NOISE = /* glsl */ `
float h3(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
return mix(mix(mix(h3(p),h3(p+vec3(1,0,0)),f.x),mix(h3(p+vec3(0,1,0)),h3(p+vec3(1,1,0)),f.x),f.y),
mix(mix(h3(p+vec3(0,0,1)),h3(p+vec3(1,1,1)),f.x),mix(h3(p+vec3(0,1,1)),h3(p+vec3(1,1,1)),f.x),f.y),f.z);}
float fb(vec3 p,int n){float v=0.0;float a=0.5;for(int i=0;i<8;i++){if(i>=n)break;v+=a*n3(p);p=p*2.05+vec3(11.7,5.3,17.1);a*=0.5;}return v;}
`;

/* ═══════════════════════════════════════════════════
   1. DIGITAL EARTH — wireframe globe with data flow
   ═══════════════════════════════════════════════════ */

const digiEarthVert = /* glsl */ `
varying vec3 vN;
varying vec3 vWP;
varying vec2 vUv;
varying vec3 vLocal;
void main(){
  vLocal = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vWP = w.xyz;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const digiEarthFrag = /* glsl */ `
varying vec3 vN;
varying vec3 vWP;
varying vec2 vUv;
varying vec3 vLocal;
uniform float uTime;

${NOISE}

void main(){
  vec3 p = normalize(vLocal);

  /* Latitude / longitude grid lines */
  float lat = asin(p.y);
  float lon = atan(p.z, p.x);
  float latLine = smoothstep(0.02, 0.0, abs(fract(lat * 4.0 / 3.14159) - 0.5) - 0.48);
  float lonLine = smoothstep(0.02, 0.0, abs(fract(lon * 6.0 / 6.28318) - 0.5) - 0.48);
  float grid = max(latLine, lonLine);

  /* Continental outlines via noise */
  float cont = fb(p * 1.3 + 5.0, 5);
  float edge = smoothstep(0.50, 0.52, cont) - smoothstep(0.54, 0.56, cont);
  edge *= 0.8;

  /* Data pulse rings that travel along meridians */
  float pulse = sin(lon * 8.0 - uTime * 2.5) * 0.5 + 0.5;
  pulse *= smoothstep(0.46, 0.50, cont) * smoothstep(0.58, 0.54, cont);

  /* Hotspot nodes on continents */
  float node1 = smoothstep(0.12, 0.0, length(p - normalize(vec3(0.8, 0.4, 0.5))) );
  float node2 = smoothstep(0.10, 0.0, length(p - normalize(vec3(-0.3, 0.5, 0.7))) );
  float node3 = smoothstep(0.09, 0.0, length(p - normalize(vec3(-0.6, 0.2, -0.6))) );
  float node4 = smoothstep(0.08, 0.0, length(p - normalize(vec3(0.2, -0.3, 0.8))) );
  float nodes = max(max(node1, node2), max(node3, node4));
  float nodePulse = (sin(uTime * 3.0) * 0.3 + 0.7) * nodes;

  /* Fresnel glow */
  vec3 V = normalize(cameraPosition - vWP);
  float fres = pow(1.0 - max(dot(vN, V), 0.0), 3.0);

  /* Colors */
  vec3 baseCol = vec3(0.02, 0.08, 0.18);
  vec3 gridCol = vec3(0.0, 0.65, 1.0) * grid * 0.7;
  vec3 contCol = vec3(0.0, 0.85, 0.95) * edge * 1.2;
  vec3 pulseCol = vec3(0.2, 1.0, 0.8) * pulse * 0.6;
  vec3 nodeCol = vec3(1.0, 0.85, 0.3) * nodePulse * 2.0;
  vec3 fresCol = vec3(0.0, 0.5, 1.0) * fres * 0.5;

  vec3 col = baseCol + gridCol + contCol + pulseCol + nodeCol + fresCol;

  gl_FragColor = vec4(col, 0.92);
}
`;

/* ═══════════════════════════════════════════════════
   2. HUMAN SILHOUETTE — built from glowing nodes
   ═══════════════════════════════════════════════════ */

// Human body point positions (normalized around origin, ~unit scale)
function humanNodes(): THREE.Vector3[] {
  const pts: [number, number, number][] = [
    // Head
    [0, 2.1, 0], [0, 2.3, 0], [-0.08, 2.2, 0.05], [0.08, 2.2, 0.05],
    [0, 2.15, 0.08], [0, 2.15, -0.06],
    // Neck
    [0, 1.95, 0], [0, 1.88, 0],
    // Shoulders
    [-0.35, 1.78, 0], [0.35, 1.78, 0],
    // Upper arms
    [-0.5, 1.55, 0.05], [0.5, 1.55, 0.05],
    [-0.55, 1.35, 0.08], [0.55, 1.35, 0.08],
    // Elbows
    [-0.58, 1.15, 0.1], [0.58, 1.15, 0.1],
    // Forearms
    [-0.52, 0.95, 0.12], [0.52, 0.95, 0.12],
    [-0.45, 0.78, 0.1], [0.45, 0.78, 0.1],
    // Hands
    [-0.42, 0.62, 0.08], [0.42, 0.62, 0.08],
    // Torso core
    [0, 1.7, 0], [0, 1.5, 0], [0, 1.3, 0], [0, 1.1, 0], [0, 0.9, 0],
    // Torso sides
    [-0.2, 1.6, 0.06], [0.2, 1.6, 0.06],
    [-0.22, 1.3, 0.08], [0.22, 1.3, 0.08],
    [-0.2, 1.05, 0.06], [0.2, 1.05, 0.06],
    // Hips
    [-0.15, 0.85, 0], [0.15, 0.85, 0],
    // Upper legs
    [-0.18, 0.6, 0.02], [0.18, 0.6, 0.02],
    [-0.17, 0.35, 0.03], [0.17, 0.35, 0.03],
    // Knees
    [-0.16, 0.15, 0.05], [0.16, 0.15, 0.05],
    // Lower legs
    [-0.15, -0.1, 0.04], [0.15, -0.1, 0.04],
    [-0.14, -0.35, 0.03], [0.14, -0.35, 0.03],
    // Ankles / feet
    [-0.13, -0.55, 0.02], [0.13, -0.55, 0.02],
    [-0.13, -0.6, 0.08], [0.13, -0.6, 0.08],
  ];
  return pts.map(([x, y, z]) => new THREE.Vector3(x, y, z));
}

// Connections between human body nodes (index pairs)
function humanEdges(): [number, number][] {
  return [
    // Spine
    [0,1],[1,2],[1,3],[1,4],[1,5],[1,6],[6,7],
    // Shoulders + arms
    [7,8],[7,9],[8,10],[9,11],[10,12],[11,13],[12,14],[13,14],
    [14,15],[14,16],[15,17],[16,17],[17,18],[18,19],[19,20],[20,21],
    // Torso
    [7,22],[22,23],[23,24],[24,25],[25,26],
    [22,27],[22,28],[24,29],[24,30],[26,31],[26,32],
    // Hips + legs
    [26,33],[26,34],[33,35],[34,36],[35,37],[36,38],
    [37,39],[38,40],[39,41],[40,42],[41,43],[42,44],[43,45],[44,46],
  ];
}

/* ═══════════════════════════════════════════════════
   3. AI BRAIN CORE — central glowing orb with rings
   ═══════════════════════════════════════════════════ */

const aiBrainVert = /* glsl */ `
varying vec3 vN;
varying vec3 vWP;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vWP = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const aiBrainFrag = /* glsl */ `
varying vec3 vN;
varying vec3 vWP;
uniform float uTime;

${NOISE}

void main(){
  vec3 p = normalize(position);
  float fres = pow(1.0 - max(dot(vN, normalize(cameraPosition - vWP)), 0.0), 2.5);

  float n1 = fb(p * 3.0 + uTime * 0.3, 4);
  float n2 = fb(p * 6.0 - uTime * 0.5, 3);

  float pulse = sin(uTime * 2.0) * 0.15 + 0.85;

  vec3 inner = vec3(0.15, 0.4, 1.0) * n1 * 1.5;
  vec3 mid   = vec3(0.0, 0.8, 1.0) * n2 * 0.8;
  vec3 outer = vec3(0.4, 0.7, 1.0) * fres * 1.2;
  vec3 core  = vec3(1.0, 0.95, 0.8) * pulse * 0.6;

  vec3 col = inner + mid + outer + core + vec3(0.02, 0.06, 0.18);
  gl_FragColor = vec4(col, 0.95);
}
`;

/* ═══════════════════════════════════════════════════
   4. DATA PARTICLES — flowing along curved paths
   ═══════════════════════════════════════════════════ */

const PARTICLE_COUNT = 600;

const particleVert = /* glsl */ `
attribute float aOffset;
attribute float aSpeed;
attribute float aSide;
uniform float uTime;
varying float vAlpha;
varying float vSide;

void main(){
  float t = fract(aOffset + uTime * aSpeed * 0.15);
  vSide = aSide;

  /* Compute position along a curved path from Earth side to Human side */
  float side = aSide;
  vec3 earthPos = vec3(-3.2, 0.0, 0.0);
  vec3 humanPos = vec3(3.2, 0.3, 0.0);

  float angle = aOffset * 6.28318 + side * 3.14159;
  vec3 curveOffset = vec3(
    sin(angle + uTime * 0.5) * 1.2,
    cos(angle * 0.7 + uTime * 0.3) * 0.8 + sin(t * 3.14159) * 0.5,
    sin(angle * 1.3) * 0.6
  );

  vec3 start = mix(earthPos, humanPos, t);
  vec3 pos = start + curveOffset * sin(t * 3.14159);

  /* Pulsing alpha */
  float pulse = sin(t * 6.28318) * 0.3 + 0.7;
  vAlpha = pulse * (1.0 - abs(t - 0.5) * 1.2);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (3.0 + pulse * 2.0) * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const particleFrag = /* glsl */ `
varying float vAlpha;
varying float vSide;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float alpha = smoothstep(1.0, 0.3, d) * vAlpha;
  vec3 col = mix(
    vec3(0.0, 0.8, 1.0),
    vec3(1.0, 0.6, 0.2),
    vSide
  );
  gl_FragColor = vec4(col, alpha * 0.85);
}
`;

/* ═══════════════════════════════════════════════════
   5. CONNECTION ARCS — curved lines between nodes
   ═══════════════════════════════════════════════════ */

function createArc(
  from: THREE.Vector3,
  to: THREE.Vector3,
  segments = 48,
  bulge = 1.2
): THREE.Vector3[] {
  const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
  const dir = new THREE.Vector3().subVectors(to, from).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const perp = new THREE.Vector3().crossVectors(dir, up).normalize();
  if (perp.length() < 0.01) perp.set(1, 0, 0);
  const dist = from.distanceTo(to);
  mid.add(perp.multiplyScalar(dist * bulge));

  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3();
    p.lerpVectors(from, mid, t).lerp(
      new THREE.Vector3().lerpVectors(mid, to, t),
      t
    );
    pts.push(p);
  }
  return pts;
}

/* ═══════════════════════════════════════════════════
   6. ORBITING COMPUTER NODES
   ═══════════════════════════════════════════════════ */

function ComputerNode({
  angle,
  radius,
  speed,
  yOffset,
  size,
}: {
  angle: number;
  radius: number;
  speed: number;
  yOffset: number;
  size: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    const a = angle + t * speed;
    ref.current.position.set(
      Math.cos(a) * radius,
      yOffset + Math.sin(t * 1.5 + angle) * 0.2,
      Math.sin(a) * radius
    );
    ref.current.rotation.y = t * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.3 + angle) * 0.2;
  });

  return (
    <group ref={ref}>
      {/* Monitor body */}
      <mesh>
        <boxGeometry args={[size * 1.4, size, size * 0.15]} />
        <meshStandardMaterial
          color="#1a2a44"
          emissive="#0066cc"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Screen glow */}
      <mesh position={[0, 0, size * 0.08]}>
        <planeGeometry args={[size * 1.2, size * 0.8]} />
        <meshStandardMaterial
          color="#00ddff"
          emissive="#00aaff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, -size * 0.6, 0]}>
        <cylinderGeometry args={[size * 0.06, size * 0.06, size * 0.3, 8]} />
        <meshStandardMaterial color="#334" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -size * 0.75, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[size * 0.25, size * 0.3, size * 0.06, 12]} />
        <meshStandardMaterial color="#223" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPOSITION
   ═══════════════════════════════════════════════════ */

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const humanGroupRef = useRef<THREE.Group>(null);
  const brainGroupRef = useRef<THREE.Group>(null);

  /* ── Digital Earth material ── */
  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: digiEarthVert,
        fragmentShader: digiEarthFrag,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  /* ── AI Brain material ── */
  const brainMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: aiBrainVert,
        fragmentShader: aiBrainFrag,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
      }),
    []
  );

  /* ── Human silhouette ── */
  const hNodes = useMemo(() => humanNodes(), []);
  const hEdges = useMemo(() => humanEdges(), []);
  const humanGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(hNodes.length * 3);
    hNodes.forEach((v, i) => {
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y - 0.7;
      positions[i * 3 + 2] = v.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [hNodes]);

  const humanEdgesGeo = useMemo(() => {
    const pts: number[] = [];
    hEdges.forEach(([a, b]) => {
      pts.push(hNodes[a].x, hNodes[a].y - 0.7, hNodes[a].z);
      pts.push(hNodes[b].x, hNodes[b].y - 0.7, hNodes[b].z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pts, 3)
    );
    return geo;
  }, [hNodes, hEdges]);

  /* ── Connection arcs ── */
  const arcGeos = useMemo(() => {
    const earthCenter = new THREE.Vector3(-3.2, 0, 0);
    const brainCenter = new THREE.Vector3(0, 0.3, 0);
    const humanCenter = new THREE.Vector3(3.2, 0.3, 0);

    const arcs: THREE.BufferGeometry[] = [];
    // Earth → Brain arcs (3)
    for (let i = 0; i < 3; i++) {
      const offset = new THREE.Vector3(
        Math.sin(i * 2.1) * 0.8,
        Math.cos(i * 1.7) * 0.6,
        Math.sin(i * 3.3) * 0.5
      );
      const from = earthCenter.clone().add(offset);
      const to = brainCenter.clone().add(offset.multiplyScalar(0.3));
      const pts = createArc(from, to, 48, 1.0 + i * 0.3);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      arcs.push(geo);
    }
    // Brain → Human arcs (3)
    for (let i = 0; i < 3; i++) {
      const offset = new THREE.Vector3(
        Math.cos(i * 2.5) * 0.5,
        Math.sin(i * 1.9) * 0.6 + 0.3,
        Math.cos(i * 3.7) * 0.4
      );
      const from = brainCenter.clone().add(offset.multiplyScalar(0.3));
      const to = humanCenter.clone().add(offset);
      const pts = createArc(from, to, 48, 0.8 + i * 0.25);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      arcs.push(geo);
    }
    return arcs;
  }, []);

  /* ── Data particles ── */
  const particleData = useMemo(() => {
    const offsets = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const sides = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      offsets[i] = Math.random();
      speeds[i] = 0.5 + Math.random() * 1.5;
      sides[i] = i < PARTICLE_COUNT / 2 ? 0 : 1;
    }
    return { offsets, speeds, sides };
  }, []);

  const particleMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVert,
        fragmentShader: particleFrag,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const dummy = new Float32Array(PARTICLE_COUNT * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(dummy, 3));
    geo.setAttribute(
      "aOffset",
      new THREE.BufferAttribute(particleData.offsets, 1)
    );
    geo.setAttribute(
      "aSpeed",
      new THREE.BufferAttribute(particleData.speeds, 1)
    );
    geo.setAttribute(
      "aSide",
      new THREE.BufferAttribute(particleData.sides, 1)
    );
    return geo;
  }, [particleData]);

  /* ── Ring orbits around brain ── */
  const ringGeo = useMemo(() => {
    return new THREE.TorusGeometry(1.0, 0.008, 8, 128);
  }, []);

  /* ── Animation ── */
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Update shader uniforms
    earthMat.uniforms.uTime.value = t;
    brainMat.uniforms.uTime.value = t;
    particleMat.uniforms.uTime.value = t;

    // Earth rotation
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = t * 0.15;
      earthGroupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    // Human gentle sway
    if (humanGroupRef.current) {
      humanGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
      humanGroupRef.current.position.y = Math.sin(t * 0.6) * 0.1;
    }

    // Brain pulse / orbit rings
    if (brainGroupRef.current) {
      const s = 1.0 + Math.sin(t * 2.0) * 0.05;
      brainGroupRef.current.scale.set(s, s, s);
      brainGroupRef.current.rotation.y = t * 0.3;
      brainGroupRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
    }

    // Whole scene gentle float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;
    }
  });

  const computers = useMemo(
    () => [
      { angle: 0, radius: 3.8, speed: 0.25, yOffset: 1.5, size: 0.35 },
      { angle: 2.1, radius: 4.0, speed: 0.2, yOffset: -1.2, size: 0.3 },
      { angle: 4.2, radius: 3.5, speed: 0.3, yOffset: 0.8, size: 0.28 },
      { angle: 1.0, radius: 4.2, speed: -0.18, yOffset: -0.6, size: 0.32 },
      { angle: 3.5, radius: 3.6, speed: 0.22, yOffset: 1.8, size: 0.25 },
      { angle: 5.0, radius: 3.9, speed: -0.28, yOffset: -1.8, size: 0.3 },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#4488cc" />
      <pointLight position={[0, 3, 4]} intensity={1.2} color="#66aaff" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#ff6633" />
      <pointLight position={[4, 1, -3]} intensity={0.6} color="#33ccff" />

      {/* ── DIGITAL EARTH (left side) ── */}
      <group ref={earthGroupRef} position={[-3.2, 0, 0]}>
        <mesh material={earthMat}>
          <sphereGeometry args={[1.3, 96, 96]} />
        </mesh>
        {/* Inner glow sphere */}
        <mesh scale={0.98}>
          <sphereGeometry args={[1.3, 64, 64]} />
          <meshStandardMaterial
            color="#001133"
            emissive="#0044aa"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* ── AI BRAIN CORE (center) ── */}
      <group ref={brainGroupRef} position={[0, 0.3, 0]}>
        <mesh material={brainMat}>
          <sphereGeometry args={[0.7, 64, 64]} />
        </mesh>
        {/* Orbit rings */}
        <mesh geometry={ringGeo} rotation={[Math.PI * 0.35, 0, 0]}>
          <meshStandardMaterial
            color="#00ccff"
            emissive="#0088ff"
            emissiveIntensity={2}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh geometry={ringGeo} rotation={[Math.PI * 0.6, Math.PI * 0.4, 0]}>
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff4400"
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh geometry={ringGeo} rotation={[Math.PI * 0.15, Math.PI * 0.7, 0]}>
          <meshStandardMaterial
            color="#aa44ff"
            emissive="#8822ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* "AI" text glow sphere */}
        <mesh scale={0.35}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#66ccff"
            emissiveIntensity={3}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* ── HUMAN SILHOUETTE (right side) ── */}
      <group ref={humanGroupRef} position={[3.2, 0.3, 0]}>
        {/* Body nodes */}
        <points geometry={humanGeo}>
          <pointsMaterial
            color="#ff8844"
            size={0.08}
            sizeAttenuation
            transparent
            opacity={0.95}
          />
        </points>
        {/* Node edges */}
        <lineSegments geometry={humanEdgesGeo}>
          <lineBasicMaterial
            color="#ff6622"
            transparent
            opacity={0.45}
          />
        </lineSegments>
        {/* Head glow */}
        <pointLight
          position={[0, 1.4, 0]}
          intensity={0.8}
          color="#ff8844"
          distance={1.5}
        />
      </group>

      {/* ── CONNECTION ARCS ── */}
      {arcGeos.map((geo, i) => (
        <line key={`arc-${i}`} geometry={geo}>
          <lineBasicMaterial
            color={i < 3 ? "#00aaff" : "#ff8833"}
            transparent
            opacity={0.35}
          />
        </line>
      ))}

      {/* ── DATA PARTICLES ── */}
      <points geometry={particleGeo} material={particleMat} />

      {/* ── ORBITING COMPUTERS ── */}
      {computers.map((c, i) => (
        <ComputerNode key={`pc-${i}`} {...c} />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   EXPORTED COMPONENT
   ═══════════════════════════════════════════════════ */

export default function AIDataNetwork3D({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <NetworkScene />
    </group>
  );
}
