import { useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════
   PROCEDURAL EARTH TEXTURES
   ═══════════════════════════════════════════════ */

function makeEarthTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, 1024);
  ocean.addColorStop(0, "#0a3d67");
  ocean.addColorStop(0.5, "#0d5a8f");
  ocean.addColorStop(1, "#082e52");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 2048, 1024);

  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(${100 + Math.random() * 40},${180 + Math.random() * 40},${220 + Math.random() * 30},${Math.random() * 0.04})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 40 + 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function land(cx: number, cy: number, pts: number[][], c1: string, c2: string) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    const g = ctx.createLinearGradient(-150, -150, 150, 150);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  const g1 = "#3a7d3f", g2 = "#2b5c30", g3 = "#4d8b4a";
  const t1 = "#a68a5b", t2 = "#7d6640";

  land(430, 300, [[-90,-140],[10,-160],[80,-100],[100,-20],[60,40],[0,90],[-60,60],[-110,10],[-100,-80]], g1, g2);
  land(560, 620, [[-40,-90],[30,-100],[55,-10],[40,90],[0,140],[-30,80],[-45,0]], g3, g2);
  land(1020, 260, [[-50,-60],[30,-70],[60,-10],[30,40],[-20,50],[-55,10]], t1, t2);
  land(1060, 480, [[-60,-110],[40,-120],[80,-30],[60,80],[10,160],[-40,130],[-65,20]], t1, g2);
  land(1420, 260, [[-140,-120],[30,-150],[160,-90],[190,-10],[130,60],[20,90],[-100,40],[-150,-40]], g1, t2);
  land(1650, 620, [[-70,-50],[40,-60],[75,-5],[40,50],[-50,45],[-80,0]], t1, t2);
  land(680, 130, [[-40,-30],[30,-40],[45,10],[0,35],[-35,10]], "#e8f0f5", "#c5d8e0");

  const iceT = ctx.createLinearGradient(0, 0, 0, 90);
  iceT.addColorStop(0, "rgba(240,248,255,0.95)");
  iceT.addColorStop(1, "rgba(240,248,255,0)");
  ctx.fillStyle = iceT;
  ctx.fillRect(0, 0, 2048, 90);
  const iceB = ctx.createLinearGradient(0, 934, 0, 1024);
  iceB.addColorStop(0, "rgba(240,248,255,0)");
  iceB.addColorStop(1, "rgba(240,248,255,0.95)");
  ctx.fillStyle = iceB;
  ctx.fillRect(0, 934, 2048, 90);

  return c;
}

function makeCloudsTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 2048, 1024);
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 2048, y = Math.random() * 1024;
    const r = Math.random() * 70 + 20;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

/* ═══════════════════════════════════════════════
   PERSON NODE TEXTURE
   ═══════════════════════════════════════════════ */

function makePersonNodeTexture(accentHex: string): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = 128;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;

  ctx.clearRect(0, 0, 128, 128);

  ctx.save();
  ctx.shadowColor = accentHex;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(64, 64, 50, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#2a5a7a";
  ctx.beginPath();
  ctx.arc(64, 46, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(36, 92);
  ctx.quadraticCurveTo(64, 60, 92, 92);
  ctx.quadraticCurveTo(92, 96, 86, 96);
  ctx.lineTo(42, 96);
  ctx.quadraticCurveTo(36, 96, 36, 92);
  ctx.fill();

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.stroke();

  return cv;
}

/* ═══════════════════════════════════════════════
   CAMERA CONTROLLER
   ═══════════════════════════════════════════════ */

function CameraController() {
  const { camera, gl, size } = useThree();
  const s = useRef({
    drag: false, px: 0, py: 0,
    trx: 0.12, try_: 0, rx: 0.12, ry: 0,
    dist: 22, td: 22,
  });
  const aspectRef = useRef(1);

  aspectRef.current = size.width / size.height;

  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    const down = (x: number, y: number) => { st.drag = true; st.px = x; st.py = y; };
    const move = (x: number, y: number) => {
      if (!st.drag) return;
      st.try_ += (x - st.px) * 0.005;
      st.trx += (y - st.py) * 0.005;
      st.trx = Math.max(-1.0, Math.min(1.0, st.trx));
      st.px = x;
      st.py = y;
    };
    const up = () => { st.drag = false; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); st.td += e.deltaY * 0.02; st.td = Math.max(12, Math.min(45, st.td)); };

    const md = (e: MouseEvent) => down(e.clientX, e.clientY);
    const mm = (e: MouseEvent) => move(e.clientX, e.clientY);
    const ts = (e: TouchEvent) => { if (e.touches.length === 1) down(e.touches[0].clientX, e.touches[0].clientY); };
    const tm = (e: TouchEvent) => { e.preventDefault(); if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY); };

    el.addEventListener("mousedown", md);
    el.addEventListener("mousemove", mm);
    el.addEventListener("mouseup", up);
    el.addEventListener("mouseleave", up);
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("touchstart", ts, { passive: false });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", up);
    return () => {
      el.removeEventListener("mousedown", md);
      el.removeEventListener("mousemove", mm);
      el.removeEventListener("mouseup", up);
      el.removeEventListener("mouseleave", up);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", up);
    };
  }, [gl]);

  useFrame(() => {
    const st = s.current;
    const aspect = aspectRef.current;
    const fit = Math.max(1, Math.min(2, 1.7 / aspect));
    st.rx += (st.trx - st.rx) * 0.06;
    st.ry += (st.try_ - st.ry) * 0.06;
    st.dist += (st.td * fit - st.dist) * 0.07;
    camera.position.x = Math.sin(st.ry) * st.dist * Math.cos(st.rx);
    camera.position.z = Math.cos(st.ry) * st.dist * Math.cos(st.rx);
    camera.position.y = 3 + Math.sin(st.rx) * st.dist;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══════════════════════════════════════════════
   STARFIELD
   ═══════════════════════════════════════════════ */

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const { geo } = useMemo(() => {
    const n = 3000;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 90 + Math.random() * 160;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo };
  }, []);

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.00008; });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#bfe8ff" size={0.7} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   EARTH
   ═══════════════════════════════════════════════ */

const atmoVS = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`;

const atmoFS = `
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 glowColor;
void main() {
  float intensity = pow(0.65 - dot(vNormal, normalize(-vPosition)), 3.0);
  gl_FragColor = vec4(glowColor, intensity * 0.9);
}`;

function Earth() {
  const gRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  const earthTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeEarthTexture());
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const cloudTex = useMemo(() => new THREE.CanvasTexture(makeCloudsTexture()), []);

  const atmoMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0x4fc3ff) } },
    vertexShader: atmoVS,
    fragmentShader: atmoFS,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  }), []);

  useFrame(() => {
    if (gRef.current) gRef.current.rotation.y += 0.0018;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.0009;
    if (ring1.current) { ring1.current.rotation.x += 0.003; ring1.current.rotation.z += 0.001; }
    if (ring2.current) { ring2.current.rotation.x -= 0.002; ring2.current.rotation.z += 0.004; }
  });

  return (
    <group ref={gRef} rotation={[0, 0, 0.41]}>
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[6, 96, 96]} />
        <meshStandardMaterial map={earthTex} roughness={0.75} metalness={0.05} emissive={0x0a2a4a} emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[6.06, 64, 64]} />
        <meshStandardMaterial map={cloudTex} transparent opacity={0.5} roughness={1} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[6.08, 32, 20]} />
        <meshBasicMaterial color={0x66ccff} wireframe transparent opacity={0.14} />
      </mesh>
      <mesh material={atmoMat}>
        <sphereGeometry args={[6.4, 64, 64]} />
      </mesh>
      <mesh material={atmoMat}>
        <sphereGeometry args={[6.7, 64, 64]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[7.2, 32, 32]} />
        <meshBasicMaterial color={0x1a5fa8} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI * 0.35, 0, 0]}>
        <torusGeometry args={[7.5, 0.03, 16, 128]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI * 0.55, 0.3, 0]}>
        <torusGeometry args={[8.2, 0.025, 16, 128]} />
        <meshBasicMaterial color={0xff0088} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   CENTRAL GLOW
   ═══════════════════════════════════════════════ */

function CentralGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 1.8) * 0.03;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshBasicMaterial color={0x00ccff} transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   NODE GLOW SPRITE
   ═══════════════════════════════════════════════ */

function GlowHalo({ color }: { color: number }) {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 128;
    cv.height = 128;
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.1, "rgba(255,255,255,0.5)");
    g.addColorStop(0.35, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const ref = useRef<THREE.Sprite>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const s = 3.2 + Math.sin(t * 2) * 0.4;
      ref.current.scale.set(s, s, 1);
    }
  });

  return (
    <sprite ref={ref} scale={[3.2, 3.2, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

/* ═══════════════════════════════════════════════
   FIBONACCI SPHERE DISTRIBUTION
   ═══════════════════════════════════════════════ */

function fibonacciSphere(samples: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const offset = 2 / samples;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = (i * offset - 1) + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    pts.push(new THREE.Vector3(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius));
  }
  return pts;
}

/* ═══════════════════════════════════════════════
   NODE + MESH CONNECTIONS + PULSES
   ═══════════════════════════════════════════════ */

const NODE_COLORS = [
  0x00ffff, 0xff0080, 0x39ff14, 0xffdd00,
  0xbf00ff, 0x00aaff, 0xff6600, 0x00ff88,
  0xff4466, 0x88ff00, 0xcc00ff, 0x00ccff,
  0xffaa00, 0x55ffcc, 0xff0044, 0x0088ff,
  0xddff00, 0xff00aa,
];

interface NodeData {
  dir: THREE.Vector3;
  radius: number;
  phase: number;
  speedTheta: number;
  wobble: number;
  wobbleSpeed: number;
  currentPos: THREE.Vector3;
  sprite: THREE.Sprite | null;
  color: number;
}

function PeopleNetwork() {
  const nodeGroupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<NodeData[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const pulsesRef = useRef<THREE.Mesh[]>([]);
  const pulseTRef = useRef<number[]>([]);

  const nodeCount = 18;
  const orbitRadius = 10.5;

  const nodeTexs = useMemo(() =>
    NODE_COLORS.map(c => {
      const hex = "#" + c.toString(16).padStart(6, "0");
      const t = new THREE.CanvasTexture(makePersonNodeTexture(hex));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }), []);

  const spherePts = useMemo(() => fibonacciSphere(nodeCount, 1), []);

  // Initialize nodes
  useMemo(() => {
    nodesRef.current = spherePts.map((dir, i) => ({
      dir: dir.clone().normalize(),
      radius: orbitRadius + (Math.random() * 2 - 1),
      phase: Math.random() * Math.PI * 2,
      speedTheta: 0.06 + Math.random() * 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.4 + Math.random() * 0.4,
      currentPos: new THREE.Vector3(),
      sprite: null,
      color: NODE_COLORS[i % NODE_COLORS.length],
    }));
  }, []);

  // Build mesh connections (each node connects to 2-3 nearest neighbors)
  useMemo(() => {
    const n = nodesRef.current;
    const seen = new Set<string>();
    const lines: THREE.Line[] = [];
    const pulses: THREE.Mesh[] = [];
    const pulseTs: number[] = [];

    for (let i = 0; i < n.length; i++) {
      const dists = n
        .map((_, j) => ({ j, d: n[i].dir.distanceTo(n[j].dir) }))
        .filter(d => d.j !== i)
        .sort((a, b) => a.d - b.d);

      const count = 2 + (i % 2);
      for (let k = 0; k < count; k++) {
        const j = dists[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
        const mat = new THREE.LineBasicMaterial({ color: 0x8fd6ff, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(geo, mat);
        lines.push(line);

        const pGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.9 });
        const pulse = new THREE.Mesh(pGeo, pMat);
        pulses.push(pulse);
        pulseTs.push(Math.random());
      }
    }

    linesRef.current = lines;
    pulsesRef.current = pulses;
    pulseTRef.current = pulseTs;
  }, []);

  // Create sprites in group
  useEffect(() => {
    if (!nodeGroupRef.current) return;
    const group = nodeGroupRef.current;

    // Clear existing children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    nodesRef.current.forEach((node, i) => {
      const spriteMat = new THREE.SpriteMaterial({
        map: nodeTexs[i % nodeTexs.length],
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      const scale = 1.3 + Math.random() * 0.4;
      sprite.scale.set(scale, scale, scale);
      node.sprite = sprite;
      group.add(sprite);
    });

    // Add lines and pulses to group
    linesRef.current.forEach(line => group.add(line));
    pulsesRef.current.forEach(pulse => group.add(pulse));

    return () => {
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }
    };
  }, [nodeTexs]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const nodes = nodesRef.current;

    // Update node positions
    nodes.forEach(node => {
      const angle = node.phase + t * node.speedTheta;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const d = node.dir;
      const x = d.x * cosA - d.z * sinA;
      const z = d.x * sinA + d.z * cosA;
      const y = d.y + Math.sin(t * node.wobbleSpeed + node.wobble) * 0.12;

      const pos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(node.radius);
      node.currentPos.copy(pos);
      if (node.sprite) node.sprite.position.copy(pos);
    });

    // Update connections and pulses
    const lines = linesRef.current;
    const pulses = pulsesRef.current;
    const pulseTs = pulseTRef.current;

    let lineIdx = 0;
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((_, j) => ({ j, d: nodes[i].dir.distanceTo(nodes[j].dir) }))
        .filter(d => d.j !== i)
        .sort((a, b) => a.d - b.d);

      const count = 2 + (i % 2);
      for (let k = 0; k < count; k++) {
        const j = dists[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        // Only process each unique connection once (when i < j or when i is the lower index)
        if (i > j) continue;

        if (lineIdx >= lines.length) break;
        const posA = nodes[i].currentPos;
        const posB = nodes[j].currentPos;

        const posAttr = lines[lineIdx].geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        arr[0] = posA.x; arr[1] = posA.y; arr[2] = posA.z;
        arr[3] = posB.x; arr[4] = posB.y; arr[5] = posB.z;
        posAttr.needsUpdate = true;

        (lines[lineIdx].material as THREE.LineBasicMaterial).opacity =
          0.3 + Math.sin(t * 1.5 + i * 3.7) * 0.2;

        pulseTs[lineIdx] += dt * (0.25 + (i % 5) * 0.04);
        if (pulseTs[lineIdx] > 1) pulseTs[lineIdx] -= 1;
        if (pulseTs[lineIdx] < 0) pulseTs[lineIdx] += 1;

        const tt = pulseTs[lineIdx];
        pulses[lineIdx].position.lerpVectors(posA, posB, tt);
        (pulses[lineIdx].material as THREE.MeshBasicMaterial).opacity =
          Math.sin(tt * Math.PI) * 0.9 + 0.1;

        lineIdx++;
      }
    }
  });

  return (
    <group ref={nodeGroupRef}>
      {/* Glow halos are added here via the same group */}
    </group>
  );
}

/* ═══════════════════════════════════════════════
   NODE GLOW HALOS (separate component for perf)
   ═══════════════════════════════════════════════ */

function NodeHalos() {
  const ref = useRef<THREE.Group>(null);

  const spherePts = useMemo(() => fibonacciSphere(18, 10.5), []);

  useEffect(() => {
    if (!ref.current) return;
    const group = ref.current;
    while (group.children.length > 0) group.remove(group.children[0]);

    spherePts.forEach((pos, i) => {
      const tex = document.createElement("canvas");
      tex.width = 128;
      tex.height = 128;
      const ctx = tex.getContext("2d")!;
      const hex = "#" + NODE_COLORS[i % NODE_COLORS.length].toString(16).padStart(6, "0");
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(0.15, "rgba(255,255,255,0.3)");
      g.addColorStop(0.5, "rgba(255,255,255,0.05)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);

      const canvasTex = new THREE.CanvasTexture(tex);
      canvasTex.colorSpace = THREE.SRGBColorSpace;

      const spriteMat = new THREE.SpriteMaterial({
        map: canvasTex,
        color: NODE_COLORS[i % NODE_COLORS.length],
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      const s = 3 + Math.random() * 0.5;
      sprite.scale.set(s, s, 1);
      group.add(sprite);
    });

    return () => { while (group.children.length > 0) group.remove(group.children[0]); };
  }, [spherePts]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += 0.0006;
    ref.current.children.forEach((child, i) => {
      const sprite = child as THREE.Sprite;
      const s = 3 + Math.sin(t * 1.5 + i * 0.7) * 0.4;
      sprite.scale.set(s, s, 1);
    });
  });

  return <group ref={ref} />;
}

/* ═══════════════════════════════════════════════
   RESPONSIVE SCALE — shrinks the whole scene on
   narrow (mobile) viewports so nothing is cut off
   ═══════════════════════════════════════════════ */

function ResponsiveScale({ children }: { children: ReactNode }) {
  const { size } = useThree();
  const scale = Math.max(0.42, Math.min(1, (size.width / size.height) / 1.6));
  return <group scale={scale}>{children}</group>;
}

/* ═══════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════ */

function Scene() {
  return (
    <ResponsiveScale>
      <fog attach="fog" args={[0x00050c, 80, 220]} />

      <ambientLight intensity={0.6} color={0x3355aa} />
      <directionalLight
        position={[25, 18, 22]}
        intensity={2.2}
        color={0xfff2dd}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0015}
      />
      <pointLight position={[-16, -6, -12]} intensity={1.5} color={0x2288ff} distance={60} />
      <pointLight position={[0, 10, -18]} intensity={1.1} color={0x00e5ff} distance={50} />
      <pointLight position={[12, 5, 10]} intensity={1.0} color={0xff0088} distance={40} />
      <pointLight position={[-10, 3, 12]} intensity={0.8} color={0xbf00ff} distance={35} />

      <Starfield />
      <CentralGlow />
      <Earth />
      <PeopleNetwork />
      <NodeHalos />

      <CameraController />
    </ResponsiveScale>
  );
}

/* ═══════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════ */

export default function GlobalPeopleNetwork3D() {
  return (
    <div className="relative w-full" style={{ height: "100%" }}>
      <Canvas
        camera={{ position: [0, 5, 22], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
