import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════
   CANVAS TEXTURE GENERATORS — VIVID EDITION
   ═══════════════════════════════════════════════ */

function makeEarthTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, 1024);
  ocean.addColorStop(0, "#0044aa");
  ocean.addColorStop(0.3, "#0066dd");
  ocean.addColorStop(0.5, "#0077ff");
  ocean.addColorStop(0.7, "#0055cc");
  ocean.addColorStop(1, "#003388");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 2048, 1024);

  for (let i = 0; i < 5000; i++) {
    const g = ctx.createRadialGradient(
      Math.random() * 2048, Math.random() * 1024, 0,
      Math.random() * 2048, Math.random() * 1024, 30 + Math.random() * 50
    );
    g.addColorStop(0, `rgba(80,180,255,${Math.random() * 0.08})`);
    g.addColorStop(1, "rgba(80,180,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2048, 1024);
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

  const lg1 = "#1faa3a", lg2 = "#0d7a20", lg3 = "#28c444";
  const t1 = "#cc9933", t2 = "#996d1a", t3 = "#e8b84d";

  land(430, 300, [[-90,-140],[10,-160],[80,-100],[100,-20],[60,40],[0,90],[-60,60],[-110,10],[-100,-80]], lg1, lg2);
  land(560, 620, [[-40,-90],[30,-100],[55,-10],[40,90],[0,140],[-30,80],[-45,0]], lg3, lg2);
  land(1020, 260, [[-50,-60],[30,-70],[60,-10],[30,40],[-20,50],[-55,10]], t1, t2);
  land(1060, 480, [[-60,-110],[40,-120],[80,-30],[60,80],[10,160],[-40,130],[-65,20]], t3, lg2);
  land(1420, 260, [[-140,-120],[30,-150],[160,-90],[190,-10],[130,60],[20,90],[-100,40],[-150,-40]], lg1, t2);
  land(1650, 620, [[-70,-50],[40,-60],[75,-5],[40,50],[-50,45],[-80,0]], t1, t2);
  land(680, 130, [[-40,-30],[30,-40],[45,10],[0,35],[-35,10]], "#ddeeff", "#aabbdd");

  ctx.fillStyle = "#f0f8ff";
  ctx.fillRect(0, 0, 2048, 50);
  ctx.fillRect(0, 974, 2048, 50);
  const iceT = ctx.createLinearGradient(0, 0, 0, 100);
  iceT.addColorStop(0, "rgba(240,248,255,1)");
  iceT.addColorStop(1, "rgba(240,248,255,0)");
  ctx.fillStyle = iceT;
  ctx.fillRect(0, 0, 2048, 100);
  const iceB = ctx.createLinearGradient(0, 924, 0, 1024);
  iceB.addColorStop(0, "rgba(240,248,255,0)");
  iceB.addColorStop(1, "rgba(240,248,255,1)");
  ctx.fillStyle = iceB;
  ctx.fillRect(0, 924, 2048, 100);

  return c;
}

function makeCloudsTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 2048, 1024);
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * 2048, y = Math.random() * 1024;
    const r = Math.random() * 80 + 25;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

/* ═══════════════════════════════════════════════
   BOLD NEON ACCENT SYSTEM — 7 UNIQUE IDENTITIES
   ═══════════════════════════════════════════════ */

const ACCENTS = [
  { name: "Neon Cyan",    c1: "#00ffff", c2: "#0066ff", glow: 0x00ffff, ring: 0x00ccff },
  { name: "Electric Lime", c1: "#39ff14", c2: "#00cc44", glow: 0x39ff14, ring: 0x22dd00 },
  { name: "Solar Flare",   c1: "#ff6600", c2: "#ff2200", glow: 0xff6600, ring: 0xff4400 },
  { name: "Hyper Violet",  c1: "#bf00ff", c2: "#7700ff", glow: 0xbf00ff, ring: 0xaa00ff },
  { name: "Hot Magenta",   c1: "#ff0080", c2: "#ff0044", glow: 0xff0080, ring: 0xff0066 },
  { name: "Electric Blue", c1: "#00aaff", c2: "#0044ff", glow: 0x00aaff, ring: 0x0088ff },
  { name: "Laser Gold",    c1: "#ffdd00", c2: "#ff8800", glow: 0xffdd00, ring: 0xffcc00 },
];

function makeLaptopScreenTex(c1: string, c2: string, idx: number): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 320;
  const ctx = cv.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 512, 320);
  bg.addColorStop(0, c1);
  bg.addColorStop(0.5, c2);
  bg.addColorStop(1, c1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 320);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < 320; y += 4) {
    ctx.fillRect(0, y, 512, 2);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 6; i++) {
    const w = 60 + Math.random() * 200;
    ctx.beginPath();
    ctx.moveTo(20, 28 + i * 42);
    ctx.lineTo(20 + w, 28 + i * 42);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(460, 40, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(15, 265, 482, 36);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 16px monospace";
  ctx.fillText(`NODE ${idx + 1} // ACTIVE`, 25, 290);

  return cv;
}

/* ═══════════════════════════════════════════════
   CAMERA ORBIT CONTROLLER
   ═══════════════════════════════════════════════ */

function CameraController() {
  const { camera, gl } = useThree();
  const s = useRef({
    dragging: false, px: 0, py: 0,
    trx: 0.18, try_: 0, rx: 0.18, ry: 0,
    dist: 28, td: 28,
  });

  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    const down = (x: number, y: number) => { st.dragging = true; st.px = x; st.py = y; };
    const move = (x: number, y: number) => {
      if (!st.dragging) return;
      st.try_ += (x - st.px) * 0.005;
      st.trx += (y - st.py) * 0.005;
      st.trx = Math.max(-1.1, Math.min(1.1, st.trx));
      st.px = x; st.py = y;
    };
    const up = () => { st.dragging = false; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); st.td += e.deltaY * 0.025; st.td = Math.max(16, Math.min(55, st.td)); };

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
    st.rx += (st.trx - st.rx) * 0.06;
    st.ry += (st.try_ - st.ry) * 0.06;
    st.dist += (st.td - st.dist) * 0.07;
    camera.position.x = Math.sin(st.ry) * st.dist * Math.cos(st.rx);
    camera.position.z = Math.cos(st.ry) * st.dist * Math.cos(st.rx);
    camera.position.y = 5 + Math.sin(st.rx) * st.dist;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══════════════════════════════════════════════
   STARFIELD — RAINBOW NEBULA
   ═══════════════════════════════════════════════ */

function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const { geo, colors } = useMemo(() => {
    const n = 6000;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const palette = [
      [1, 1, 1], [0.5, 0.85, 1], [1, 0.5, 0.8], [0.5, 1, 0.6],
      [1, 0.85, 0.4], [0.7, 0.6, 1], [0.3, 0.9, 1],
    ];
    for (let i = 0; i < n; i++) {
      const r = 95 + Math.random() * 170;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
      const p = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = p[0]; col[i * 3 + 1] = p[1]; col[i * 3 + 2] = p[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geo, colors: true };
  }, []);

  const { bGeo } = useMemo(() => {
    const n = 80;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const bright = [[1,1,1],[0.4,0.9,1],[1,0.5,0.9],[1,0.9,0.3]];
    for (let i = 0; i < n; i++) {
      const r = 100 + Math.random() * 150;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
      const p = bright[Math.floor(Math.random() * bright.length)];
      col[i * 3] = p[0]; col[i * 3 + 1] = p[1]; col[i * 3 + 2] = p[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { bGeo: geo };
  }, []);

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0001; });

  return (
    <>
      <points ref={ref} geometry={geo}>
        <pointsMaterial size={0.8} transparent opacity={0.9} sizeAttenuation vertexColors />
      </points>
      <points geometry={bGeo}>
        <pointsMaterial size={2.2} transparent opacity={1} vertexColors />
      </points>
    </>
  );
}

/* ═══════════════════════════════════════════════
   EARTH — VIVID + ENERGY RINGS + GLOW
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
uniform float intensity;
void main() {
  float i = pow(intensity - dot(vNormal, normalize(-vPosition)), 3.0);
  gl_FragColor = vec4(glowColor, i * 1.0);
}`;

function Earth() {
  const gRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const earthTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeEarthTexture());
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const cloudTex = useMemo(() => new THREE.CanvasTexture(makeCloudsTexture()), []);

  const atmoMat1 = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0x00eeff) }, intensity: { value: 0.72 } },
    vertexShader: atmoVS, fragmentShader: atmoFS,
    side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }), []);
  const atmoMat2 = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0xff0088) }, intensity: { value: 0.82 } },
    vertexShader: atmoVS, fragmentShader: atmoFS,
    side: THREE.FrontSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }), []);

  const ringMat = useMemo((color: number) => new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.25, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame((_, dt) => {
    if (gRef.current) gRef.current.rotation.y += 0.002;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.001;
    if (ring1Ref.current) { ring1Ref.current.rotation.x += 0.004; ring1Ref.current.rotation.z += 0.002; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x -= 0.003; ring2Ref.current.rotation.z += 0.005; }
    if (ring3Ref.current) { ring3Ref.current.rotation.y += 0.006; ring3Ref.current.rotation.x += 0.001; }
  });

  return (
    <group ref={gRef} rotation={[0, 0, 0.41]}>
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[7, 96, 96]} />
        <meshStandardMaterial map={earthTex} roughness={0.65} metalness={0.08} emissive={0x0044aa} emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[7.08, 64, 64]} />
        <meshStandardMaterial map={cloudTex} transparent opacity={0.55} roughness={1} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[7.12, 40, 30]} />
        <meshBasicMaterial color={0x00ccff} wireframe transparent opacity={0.18} />
      </mesh>
      <mesh material={atmoMat1}>
        <sphereGeometry args={[7.5, 64, 64]} />
      </mesh>
      <mesh material={atmoMat2}>
        <sphereGeometry args={[7.8, 64, 64]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial color={0x0088cc} transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ring1Ref} rotation={[Math.PI * 0.35, 0, 0]}>
        <torusGeometry args={[9, 0.04, 16, 128]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI * 0.55, 0.3, 0]}>
        <torusGeometry args={[10, 0.035, 16, 128]} />
        <meshBasicMaterial color={0xff0088} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI * 0.15, 0.6, 0]}>
        <torusGeometry args={[8.2, 0.03, 16, 128]} />
        <meshBasicMaterial color={0xbf00ff} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING ENERGY PARTICLES AROUND EARTH
   ═══════════════════════════════════════════════ */

function EnergyParticles() {
  const ref = useRef<THREE.Points>(null);

  const { geo } = useMemo(() => {
    const n = 800;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const palette = [
      [0, 1, 1], [1, 0, 0.5], [0.75, 0, 1], [0.2, 1, 0.1], [1, 0.85, 0], [0, 0.7, 1],
    ];
    for (let i = 0; i < n; i++) {
      const r = 8 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
      const p = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = p[0]; col[i * 3 + 1] = p[1]; col[i * 3 + 2] = p[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geo };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x += 0.001;
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05);
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.18} transparent opacity={0.85} sizeAttenuation vertexColors blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   GRID FLOOR — NEON GRID
   ═══════════════════════════════════════════════ */

function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0008; });

  return (
    <>
      <gridHelper ref={ref} args={[100, 50, 0x00aaff, 0x003366]} position={[0, -10, 0]}>
        <meshBasicMaterial attach="material" transparent opacity={0.35} />
      </gridHelper>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10.05, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color={0x000a14} roughness={0.85} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10.1, 0]}>
        <ringGeometry args={[48, 50, 64]} />
        <meshBasicMaterial color={0x0088ff} transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SINGLE LAPTOP — BOLD + GLOW HALO + PULSE TRAIL
   ═══════════════════════════════════════════════ */

function GlowSprite({ color }: { color: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.15, `rgba(255,255,255,0.5)`);
    g.addColorStop(0.4, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <sprite scale={[4, 4, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

function Laptop({ accent, index }: { accent: typeof ACCENTS[0]; index: number }) {
  const gRef = useRef<THREE.Group>(null);
  const dispRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  const dotsRef = useRef<THREE.Group>(null);

  const screenTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeLaptopScreenTex(accent.c1, accent.c2, index));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [accent, index]);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xd0d0d8, roughness: 0.3, metalness: 0.7 }), []);
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.45, metalness: 0.5 }), []);
  const keyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.55, metalness: 0.35 }), []);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    return geo;
  }, []);

  const trailDots = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    meshRef: { current: null } as React.MutableRefObject<THREE.Mesh | null>,
    offset: i * 0.18,
  })), []);

  const d = useRef({
    angle: (index / 7) * Math.PI * 2,
    radius: 14 + Math.sin(index * 2.1) * 1.8,
    tilt: 0.35 + Math.sin(index * 1.7) * 0.2,
    speed: 0.12 + (index % 3) * 0.022,
    bobOff: index * 1.13,
    bobSpd: 0.55 + (index % 4) * 0.15,
    pulseT: Math.random(),
  });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const v = d.current;
    v.angle += v.speed * dt;
    const x = Math.cos(v.angle) * v.radius;
    const z = Math.sin(v.angle) * v.radius;
    const y = Math.sin(v.angle * 1.3 + v.bobOff) * 2.5 * v.tilt + Math.sin(t * v.bobSpd) * 0.4;

    if (gRef.current) {
      gRef.current.position.set(x, y, z);
      gRef.current.lookAt(0, 0, 0);
      gRef.current.rotateY(Math.PI);
    }

    if (dispRef.current) {
      (dispRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.2 + Math.sin(t * 2.5 + v.bobOff) * 0.5;
    }

    if (lineRef.current) {
      const pos = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      arr[0] = 0; arr[1] = 0; arr[2] = 0;
      arr[3] = x; arr[4] = y; arr[5] = z;
      pos.needsUpdate = true;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity =
        0.3 + Math.sin(t * 3 + v.bobOff) * 0.15;
    }

    v.pulseT += dt * 0.4;
    if (v.pulseT > 1) v.pulseT = 0;

    trailDots.forEach((td, i) => {
      const tp = v.pulseT + td.offset;
      const tt = tp > 1 ? tp - 1 : tp;
      if (td.meshRef.current) {
        td.meshRef.current.position.set(x * (1 - tt), y * (1 - tt), z * (1 - tt));
        const s = 0.08 + (1 - Math.abs(tt - 0.5) * 2) * 0.12;
        td.meshRef.current.scale.setScalar(s / 0.08);
        (td.meshRef.current.material as THREE.MeshBasicMaterial).opacity =
          (1 - tt) * 0.95;
      }
    });
  });

  return (
    <>
      <group ref={gRef} scale={[1.6, 1.6, 1.6]}>
        <GlowSprite color={accent.glow} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.12, 1.6]} />
          <primitive object={bodyMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.07, 0.06]}>
          <boxGeometry args={[2.05, 0.02, 1.25]} />
          <primitive object={keyMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.075, 0.55]}>
          <boxGeometry args={[0.6, 0.015, 0.4]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.87, -0.81]} castShadow>
          <boxGeometry args={[2.4, 1.6, 0.1]} />
          <primitive object={bodyMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.87, -0.76]}>
          <boxGeometry args={[2.25, 1.45, 0.02]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
        <mesh ref={dispRef} position={[0, 0.87, -0.74]}>
          <planeGeometry args={[2.1, 1.28]} />
          <meshStandardMaterial
            map={screenTex}
            emissive={new THREE.Color(accent.glow)}
            emissiveIntensity={1.4}
            emissiveMap={screenTex}
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>
      </group>

      <line ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={accent.glow} transparent opacity={0.45} linewidth={2} />
      </line>

      <group ref={dotsRef}>
        {trailDots.map((td, i) => (
          <mesh key={i} ref={(el) => { td.meshRef.current = el; }}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={accent.ring} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CENTRAL GLOW ORB — ENERGY CORE
   ═══════════════════════════════════════════════ */

function CentralGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 2) * 0.04;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[9, 32, 32]} />
      <meshBasicMaterial color={0x00ccff} transparent opacity={0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   SCENE COMPOSITION
   ═══════════════════════════════════════════════ */

function Scene() {
  return (
    <>
      <fog attach="fog" args={[0x000810, 90, 250]} />

      <ambientLight intensity={0.8} color={0x4466cc} />
      <directionalLight
        position={[30, 20, 25]}
        intensity={2.8}
        color={0xfff5ee}
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
      <pointLight position={[-20, -6, -14]} intensity={2.2} color={0x0088ff} distance={65} />
      <pointLight position={[0, 12, -22]} intensity={2.0} color={0x00ffff} distance={55} />
      <pointLight position={[18, 8, 10]} intensity={1.8} color={0xff0088} distance={50} />
      <pointLight position={[-15, 5, 18]} intensity={1.5} color={0xbf00ff} distance={45} />
      <pointLight position={[10, -8, 15]} intensity={1.2} color={0x39ff14} distance={40} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color={0x00ccff} distance={18} />

      <Starfield />
      <CentralGlow />
      <EnergyParticles />
      <Earth />
      <GridFloor />

      {ACCENTS.map((accent, i) => (
        <Laptop key={i} accent={accent} index={i} />
      ))}

      <CameraController />
    </>
  );
}

/* ═══════════════════════════════════════════════
   EXPORTED COMPONENT
   ═══════════════════════════════════════════════ */

export default function AIDataNetwork3D() {
  return (
    <div className="relative w-full" style={{ height: "min(80vh, 720px)" }}>
      <Canvas
        camera={{ position: [0, 7, 28], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
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
