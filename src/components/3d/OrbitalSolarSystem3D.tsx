/**
 * OrbitalSolarSystem3D - Heliocentric 3D solar system.
 * Sun at centre, all planets orbit it. Cursor parallax. Real NASA colors.
 */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PhotorealisticEarth3D from "./PhotorealisticEarth3D";

/* Shared GLSL noise */
const N = `
float h3(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
return mix(mix(mix(h3(p),h3(p+vec3(1,0,0)),f.x),mix(h3(p+vec3(0,1,0)),h3(p+vec3(1,1,0)),f.x),f.y),
mix(mix(h3(p+vec3(0,0,1)),h3(p+vec3(1,1,1)),f.x),mix(h3(p+vec3(0,1,1)),h3(p+vec3(1,1,1)),f.x),f.y),f.z);}
float fb(vec3 p,int n){float v=0.0;float a=0.5;for(int i=0;i<8;i++){if(i>=n)break;v+=a*n3(p);p=p*2.05+vec3(11.7,5.3,17.1);a*=0.5;}return v;}
`;

/* Shared vertex shader */
const VS = `
varying vec3 vN;varying vec3 vWP;varying vec3 vVD;
void main(){vec4 w=modelMatrix*vec4(position,1.0);
vN=normalize(mat3(modelMatrix)*normal);vWP=w.xyz;vVD=cameraPosition-w.xyz;
gl_Position=projectionMatrix*viewMatrix*w;}
`;

/* Sun fragment - ATTRACTIVE, rich, non-faded core with golden glow */
const SF = `
varying vec3 vN;varying vec3 vWP;uniform float uT;${N}
void main(){vec3 p=normalize(vWP);
float a=fb(p*4.0+uT*0.05,4);float b=fb(p*10.0-uT*0.08,4);
float h=smoothstep(0.3,0.85,a)*0.7+b*0.3;
vec3 core=vec3(1.0,1.0,0.95);
vec3 mid=vec3(1.0,0.95,0.65);
vec3 outer=vec3(1.0,0.65,0.20);
vec3 c=mix(outer,mid,smoothstep(0.0,0.6,h));
c=mix(c,core,smoothstep(0.6,1.0,h));
c=mix(c,vec3(1.0,1.0,1.0),smoothstep(0.85,1.0,h)*0.5);
float v=pow(max(dot(normalize(vN),normalize(vVD)),0.0),0.3);
c*=0.85+0.40*v;
gl_FragColor=vec4(c,1.0);}
`;

/* Sun component - huge, bright, multi-layer corona */
function Sun({ size = 2.2 }: { size?: number }) {
  const m = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: SF,
    uniforms: { uT: { value: 0 } }, toneMapped: false,
  }), []);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const r4 = useRef<THREE.Mesh>(null);
  useFrame(s => {
    const t = s.clock.elapsedTime;
    m.uniforms.uT.value = t;
    if (r1.current) r1.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.02);
    if (r2.current) r2.current.scale.setScalar(1 + Math.sin(t * 0.5 + 1) * 0.08);
    if (r3.current) r3.current.scale.setScalar(1 + Math.sin(t * 0.35 + 2) * 0.15);
    if (r4.current) r4.current.scale.setScalar(1 + Math.sin(t * 0.25 + 3) * 0.20);
  });
  return <group>
    <mesh ref={r1}><sphereGeometry args={[size, 48, 48]} /><primitive object={m} attach="material" /></mesh>
    <mesh ref={r2}><sphereGeometry args={[size * 1.25, 32, 32]} />
      <meshBasicMaterial color="#ffe88a" transparent opacity={0.50} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>
    <mesh ref={r3}><sphereGeometry args={[size * 1.60, 24, 24]} />
      <meshBasicMaterial color="#ffcc60" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>
    <mesh ref={r4}><sphereGeometry args={[size * 2.10, 16, 16]} />
      <meshBasicMaterial color="#ffaa40" transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>
  </group>;
}



/* Rocky planet fragment - extra shiny, bright, glossy */
const RF = `
varying vec3 vN;varying vec3 vWP;varying vec3 vVD;
uniform vec3 uSD,uC1,uC2,uC3,uC4;uniform float uIce,uHI;${N}
void main(){vec3 p=normalize(vWP);
float a=fb(p*1.8,4),b=fb(p*5.0+11.0,4),c=fb(p*11.0+23.0,4);
vec3 col=mix(uC1,uC2,smoothstep(0.3,0.65,a));
col=mix(col,uC3,smoothstep(0.5,0.78,b));
col=mix(col,uC4,smoothstep(0.7,0.92,c)*0.55);
col*=0.75+0.60*fb(p*9.0,3);
float pl=smoothstep(0.8,0.96,abs(p.y));
col=mix(col,vec3(.96,.97,.99),pl*uIce*uHI);
vec3 N=normalize(vN);vec3 L=normalize(uSD);vec3 V=normalize(vVD);
float l=max(dot(N,L),0.0);
col*=0.20+0.95*l;
vec3 H=normalize(L+V);
float sp=pow(max(dot(N,H),0.0),40.0);
col+=vec3(0.8,0.75,0.65)*sp*1.5;
float fr=pow(1.0-max(dot(N,V),0.0),3.0);
col+=vec3(.5,.5,.55)*fr*0.45;
gl_FragColor=vec4(col,1.0);}
`;

/* Gas giant fragment - extra bright, shiny, glossy bands */
const GF = `
varying vec3 vN;varying vec3 vWP;varying vec3 vVD;
uniform vec3 uSD,uB1,uB2;uniform float uBn,uSp,uT;uniform vec2 uSpP;${N}
void main(){vec3 p=normalize(vWP);
float bd=sin(p.y*uBn+fb(p*4.0,3)*0.5)*0.5+0.5;
bd=smoothstep(0.2,0.8,bd);
vec3 col=mix(uB1,uB2,bd);
col*=0.80+0.45*fb(p*7.0+uT*0.04,3);
if(uSp>0.0){float d=length(vec2(p.y,atan(p.z,p.x))-uSpP);
float sp=smoothstep(0.32,0.08,d);
vec3 sc=mix(uB1,uB2,0.4)*vec3(1.05,0.8,0.65);
col=mix(col,sc,sp*uSp);}
vec3 N=normalize(vN);vec3 L=normalize(uSD);vec3 V=normalize(vVD);
float l=max(dot(N,L),0.0);
col*=0.25+0.95*l;
vec3 H=normalize(L+V);
float sp2=pow(max(dot(N,H),0.0),60.0);
col+=vec3(0.7,0.7,0.75)*sp2*1.2;
float fr=pow(1.0-max(dot(N,V),0.0),2.2);
col+=vec3(.6,.6,.65)*fr*0.40;
gl_FragColor=vec4(col,1.0);}
`;

/* Planet type */
type PlanetProps = {
  radius: number; orbitRadius: number; speed: number; phase: number;
  inclination: [number, number, number]; selfRotation: number;
  kind: "rocky" | "gas";
  rockyColors?: [string, string, string, string];
  gasColors?: [string, string]; bands?: number;
  spot?: number; spotPos?: [number, number];
  hasRing?: boolean; ringColor?: string; ringInner?: number; ringOuter?: number;
  ringTilt?: [number, number, number]; polarIce?: boolean;
};

/* Planet component - orbits origin at orbitRadius, tilted plane, self-rotates */
function Planet({
  radius, orbitRadius, speed, phase, inclination, selfRotation, kind,
  rockyColors, gasColors, bands = 6, spot = 0, spotPos = [0, 0],
  hasRing = false, ringColor = "#d9b87a", ringInner, ringOuter,
  ringTilt = [Math.PI / 2, 0, 0], polarIce = false,
}: PlanetProps) {
  const pivot = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const sd = useRef(new THREE.Vector3(1, 0, 0));

  const mat = useMemo(() => {
    if (kind === "rocky") {
      const [c1, c2, c3, c4] = rockyColors ?? ["#aaa", "#888", "#666", "#444"];
      return new THREE.ShaderMaterial({
        vertexShader: VS, fragmentShader: RF,
        uniforms: { uSD: { value: sd.current }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) }, uC3: { value: new THREE.Color(c3) }, uC4: { value: new THREE.Color(c4) }, uIce: { value: 1 }, uHI: { value: polarIce ? 1 : 0 } },
      });
    }
    const [g1, g2] = gasColors ?? ["#ddd", "#888"];
    return new THREE.ShaderMaterial({
      vertexShader: VS, fragmentShader: GF,
      uniforms: { uSD: { value: sd.current }, uB1: { value: new THREE.Color(g1) }, uB2: { value: new THREE.Color(g2) }, uBn: { value: bands }, uSp: { value: spot }, uSpP: { value: new THREE.Vector2(spotPos[0], spotPos[1]) }, uT: { value: 0 } },
    });
  }, [kind, rockyColors, gasColors, bands, spot, polarIce]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (pivot.current) {
      pivot.current.position.set(Math.cos(t) * orbitRadius, 0, Math.sin(t) * orbitRadius);
      sd.current.copy(pivot.current.position).multiplyScalar(-1).normalize();
    }
    if (meshRef.current) meshRef.current.rotation.y += selfRotation;
    if (kind === "gas" && mat.uniforms.uT) mat.uniforms.uT.value = state.clock.elapsedTime;
  });

  return (
    <group rotation={inclination}>
      <group ref={pivot}>
        <group rotation={ringTilt as [number, number, number]}>
          <mesh ref={meshRef}>
            <sphereGeometry args={[radius, 64, 64]} />
            <primitive object={mat} attach="material" />
          </mesh>
          {hasRing && (
            <mesh>
              <ringGeometry args={[ringInner ?? radius * 1.3, ringOuter ?? radius * 1.9, 128]} />
              <meshBasicMaterial color={ringColor} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

/* Orbit line - visible circular path for each planet */
function OrbitLine({ radius, color = "#ffffff", opacity = 0.15 }: { radius: number; color?: string; opacity?: number }) {
  const geo = useMemo(() => {
    const segments = 128;
    const points: number[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, [radius]);
  return <line geometry={geo}>
    <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  </line>;
}

/* Asteroid belt - HUGE realistic stones with visible size */
function AsteroidBelt({ innerR = 7.4, outerR = 8.8, count = 60 }: { innerR?: number; outerR?: number; count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (groupRef.current) groupRef.current.rotation.y += d * 0.025; });
  const stones = useMemo(() => {
    const arr: { r: number; ang: number; y: number; size: number; colorA: string; colorB: string }[] = [];
    for (let i = 0; i < count; i++) {
      const r = innerR + Math.random() * (outerR - innerR);
      const ang = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.8;
      const size = 0.08 + Math.random() * 0.18;
      const gray = 0.4 + Math.random() * 0.4;
      const colorA = `#${Math.floor(gray * 160 + 80).toString(16)}${Math.floor(gray * 140 + 60).toString(16)}${Math.floor(gray * 120 + 50).toString(16)}`;
      const colorB = `#${Math.floor(gray * 80 + 30).toString(16)}${Math.floor(gray * 70 + 20).toString(16)}${Math.floor(gray * 60 + 20).toString(16)}`;
      arr.push({ r, ang, y, size, colorA, colorB });
    }
    return arr;
  }, [innerR, outerR, count]);

  return <group ref={groupRef}>
    {stones.map((s, i) => (
      <group key={i} position={[Math.cos(s.ang) * s.r, s.y, Math.sin(s.ang) * s.r]}>
        <mesh rotation={[Math.random() * 6, Math.random() * 6, Math.random() * 6]}>
          <dodecahedronGeometry args={[s.size, 0]} />
          <meshStandardMaterial color={s.colorA} roughness={0.8} metalness={0.2} />
        </mesh>
      </group>
    ))}
  </group>;
}

/* Moon - orbits Earth (inside EarthSystem) */
function Moon() {
  const pivot = useRef<THREE.Group>(null);
  const mr = useRef<THREE.Mesh>(null);
  const sd = useRef(new THREE.Vector3(1, 0, 0));
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: RF,
    uniforms: { uSD: { value: sd.current }, uC1: { value: new THREE.Color("#d4cfc2") }, uC2: { value: new THREE.Color("#a39d8e") }, uC3: { value: new THREE.Color("#5e574a") }, uC4: { value: new THREE.Color("#3a352c") }, uIce: { value: 0 }, uHI: { value: 0 } },
  }), []);
  useFrame((s) => {
    const t = s.clock.elapsedTime * 1.2;
    if (pivot.current) pivot.current.position.set(Math.cos(t) * 0.55, 0, Math.sin(t) * 0.55);
    if (mr.current) mr.current.rotation.y += 0.004;
  });
  return <group ref={pivot}>
    <mesh ref={mr}><sphereGeometry args={[0.14, 32, 32]} /><primitive object={mat} attach="material" /></mesh>
  </group>;
}

/* Earth system - Earth + Moon orbiting the Sun */
function EarthSystem() {
  const orbit = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime * 0.21;
    if (orbit.current) orbit.current.position.set(Math.cos(t) * 5.0, 0, Math.sin(t) * 5.0);
  });
  return <group rotation={[0, 0, 0.02]}>
    <group ref={orbit}>
      <PhotorealisticEarth3D position={[0, 0, 0]} scale={0.48} />
      <group rotation={[0.1, 0, 0.1]}><Moon /></group>
    </group>
  </group>;
}

/* Cursor parallax - tilts everything smoothly with the mouse */
function CursorParallax({ children, intensity = 0.3 }: { children: React.ReactNode; intensity?: number }) {
  const { mouse } = useThree();
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    const tx = mouse.y * intensity, ty = mouse.x * intensity;
    const k = 1 - Math.pow(0.001, d);
    ref.current.rotation.x += (tx - ref.current.rotation.x) * k * 0.8;
    ref.current.rotation.y += (ty - ref.current.rotation.y) * k * 0.8;
  });
  return <group ref={ref}>{children}</group>;
}

/* Main export - the full heliocentric solar system */
export default function OrbitalSolarSystem3D({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <CursorParallax intensity={0.3}>
      <Sun size={2.4} />
      {/* White orbit lines for all planets */}
      <OrbitLine radius={1.6} color="#ffffff" opacity={0.12} />
      <OrbitLine radius={2.4} color="#ffffff" opacity={0.12} />
      <OrbitLine radius={5.0} color="#ffffff" opacity={0.12} />
      <OrbitLine radius={6.2} color="#ffffff" opacity={0.12} />
      <OrbitLine radius={9.6} color="#ffffff" opacity={0.10} />
      <OrbitLine radius={12.2} color="#ffffff" opacity={0.10} />
      <OrbitLine radius={14.5} color="#ffffff" opacity={0.08} />
      <OrbitLine radius={16.5} color="#ffffff" opacity={0.08} />
      {/* Planets - bigger sizes, more vibrant colors */}
      <Planet radius={0.30} orbitRadius={1.6} speed={0.85} phase={0} inclination={[0.06, 0, 0.02]} selfRotation={0.018} kind="rocky" rockyColors={["#eedcc0", "#c8b090", "#887460", "#443830"]} />
      <Planet radius={0.44} orbitRadius={2.4} speed={0.55} phase={1.1} inclination={[-0.03, 0, 0.05]} selfRotation={-0.005} kind="rocky" rockyColors={["#fffce0", "#fee8a8", "#e8c068", "#b08028"]} />
      <EarthSystem />
      <Planet radius={0.40} orbitRadius={6.2} speed={0.16} phase={3} inclination={[0.03, 0, -0.04]} selfRotation={0.012} kind="rocky" rockyColors={["#ff9955", "#e86028", "#a83a10", "#602008"]} polarIce />
      {/* 4 HUGE GIANT STONES - free floating, NOT orbiting */}
      <group position={[10, 0.5, 4]}><mesh rotation={[0.3, 0.8, 0.2]}><dodecahedronGeometry args={[0.35, 0]} /><meshStandardMaterial color="#8a7a6a" roughness={0.7} metalness={0.3} /></mesh></group>
      <group position={[-8, -0.8, 7]}><mesh rotation={[1.2, 0.4, 0.6]}><dodecahedronGeometry args={[0.42, 0]} /><meshStandardMaterial color="#6a5a4a" roughness={0.8} metalness={0.2} /></mesh></group>
      <group position={[5, 1.2, -10]}><mesh rotation={[0.5, 1.5, 0.1]}><dodecahedronGeometry args={[0.50, 0]} /><meshStandardMaterial color="#9a8a7a" roughness={0.6} metalness={0.4} /></mesh></group>
      <group position={[-12, -0.3, -5]}><mesh rotation={[0.8, 0.2, 1.1]}><dodecahedronGeometry args={[0.38, 0]} /><meshStandardMaterial color="#7a6a5a" roughness={0.9} metalness={0.2} /></mesh></group>
      <Planet radius={1.05} orbitRadius={9.6} speed={0.08} phase={2} inclination={[0.02, 0, 0.04]} selfRotation={0.030} kind="gas" gasColors={["#feecc0", "#d8a260"]} bands={11} spot={0.95} spotPos={[-0.25, 0]} />
      <Planet radius={0.86} orbitRadius={12.2} speed={0.05} phase={4.5} inclination={[0.05, 0, -0.08]} selfRotation={0.025} kind="gas" gasColors={["#fff4c8", "#e8b868"]} bands={8} hasRing ringColor="#fae0a8" ringInner={1.1} ringOuter={1.8} />
      <Planet radius={0.60} orbitRadius={14.5} speed={0.03} phase={5.5} inclination={[0, 0, 0.3]} selfRotation={0.020} kind="gas" gasColors={["#e0ffff", "#88d8d8"]} bands={4} hasRing ringColor="#c0e8e8" ringInner={0.78} ringOuter={1.0} />
      <Planet radius={0.58} orbitRadius={16.5} speed={0.022} phase={1.8} inclination={[-0.02, 0, -0.2]} selfRotation={0.022} kind="gas" gasColors={["#80c0ff", "#2050b0"]} bands={5} />
    </CursorParallax>
  </group>;
}


