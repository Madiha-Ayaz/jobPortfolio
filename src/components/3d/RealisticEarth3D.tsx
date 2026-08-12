import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const earthVertex = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uLightDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)), f.x),
                   mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)), f.x),
                   mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPosition) * 2.0;
    float continents = fbm(p * 1.4 + vec3(uTime * 0.01));
    float detail = fbm(p * 4.0);

    float land = smoothstep(0.50, 0.56, continents + detail * 0.18);

    vec3 deepOcean = vec3(0.02, 0.10, 0.32);
    vec3 shallowOcean = vec3(0.10, 0.45, 0.70);
    vec3 ocean = mix(deepOcean, shallowOcean, smoothstep(0.30, 0.55, continents));

    vec3 grass = vec3(0.10, 0.45, 0.18);
    vec3 forest = vec3(0.04, 0.25, 0.10);
    vec3 desert = vec3(0.65, 0.50, 0.25);
    vec3 landColor = mix(grass, forest, fbm(p * 3.0));
    landColor = mix(landColor, desert, smoothstep(0.55, 0.75, fbm(p * 0.8 + 5.0)));

    float lat = vUv.y;
    float ice = smoothstep(0.88, 0.96, lat) + smoothstep(0.12, 0.04, lat);
    vec3 iceColor = vec3(0.92, 0.96, 1.0);
    landColor = mix(landColor, iceColor, ice);
    ocean = mix(ocean, iceColor, ice * 0.7);

    vec3 surface = mix(ocean, landColor, land);

    float NdotL = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
    float dayMix = smoothstep(-0.15, 0.25, NdotL);
    vec3 dayColor = surface * (0.4 + 0.6 * NdotL);
    vec3 nightColor = surface * 0.04;

    float cityMask = smoothstep(0.52, 0.58, continents);
    float cityNoise = fbm(p * 18.0);
    float cities = cityMask * smoothstep(0.55, 0.7, cityNoise) * (1.0 - dayMix);
    nightColor += vec3(1.0, 0.85, 0.45) * cities * 1.4;

    vec3 color = mix(nightColor, dayColor, dayMix);

    float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 2.0);
    color += vec3(0.30, 0.55, 1.0) * rim * 0.6;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const cloudFragment = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv * 4.0 + vec2(uTime * 0.012, 0.0);
    float n = fbm(uv);
    float clouds = smoothstep(0.48, 0.7, n);
    gl_FragColor = vec4(1.0, 1.0, 1.0, clouds * 0.55);
  }
`;

const atmosphereVertex = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1)), 2.0);
    gl_FragColor = vec4(0.35, 0.6, 1.0, 1.0) * intensity;
  }
`;

const auroraVertex = `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragment = `
  varying vec3 vPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMirror;
  void main() {
    vec2 uv = vUv;
    float wave = sin(uv.x * 12.0 + uTime * 1.5) * 0.5 + 0.5;
    float band = smoothstep(0.3, 0.6, uv.y) * (1.0 - smoothstep(0.6, 0.95, uv.y));
    float a = band * wave * 0.7;
    vec3 col = mix(vec3(0.20, 1.0, 0.55), vec3(0.55, 0.30, 1.0), uv.x);
    col = mix(col, vec3(0.10, 0.80, 1.0), sin(uTime * 0.5 + uv.x * 4.0) * 0.5 + 0.5);
    gl_FragColor = vec4(col, a * uMirror);
  }
`;

function Earth({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const auroraNRef = useRef<THREE.Mesh>(null);
  const auroraSRef = useRef<THREE.Mesh>(null);

  const earthMat = useRef(
    new THREE.ShaderMaterial({
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
      uniforms: {
        uTime: { value: 0 },
        uLightDir: { value: new THREE.Vector3(1, 0.3, 0.5).normalize() },
      },
    })
  );
  const cloudMat = useRef(
    new THREE.ShaderMaterial({
      vertexShader: earthVertex,
      fragmentShader: cloudFragment,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
    })
  );
  const atmosphereMat = useRef(
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
  );
  const auroraMatN = useRef(
    new THREE.ShaderMaterial({
      vertexShader: auroraVertex,
      fragmentShader: auroraFragment,
      uniforms: { uTime: { value: 0 }, uMirror: { value: 1.0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  );
  const auroraMatS = useRef(
    new THREE.ShaderMaterial({
      vertexShader: auroraVertex,
      fragmentShader: auroraFragment,
      uniforms: { uTime: { value: 0 }, uMirror: { value: 1.0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.25;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.32;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.04;
    }
    // Animate the sun direction for a visible day/night cycle
    const sunAngle = t * 0.08;
    const sunDir = new THREE.Vector3(Math.cos(sunAngle) * 2, 0.3, Math.sin(sunAngle) * 2).normalize();
    earthMat.current.uniforms.uLightDir.value.copy(sunDir);
    earthMat.current.uniforms.uTime.value = t;
    cloudMat.current.uniforms.uTime.value = t;
    auroraMatN.current.uniforms.uTime.value = t;
    auroraMatS.current.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef} position={position}>
      <directionalLight position={[5, 2, 3]} intensity={1.4} color="#fff5e0" />

      <mesh ref={earthRef}>
        <sphereGeometry args={[1.3, 96, 96]} />
        <primitive object={earthMat.current} attach="material" />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.33, 64, 64]} />
        <primitive object={cloudMat.current} attach="material" />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <primitive object={atmosphereMat.current} attach="material" />
      </mesh>

      <mesh ref={auroraNRef} position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.55, 64]} />
        <primitive object={auroraMatN.current} attach="material" />
      </mesh>

      <mesh ref={auroraSRef} position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.55, 64]} />
        <primitive object={auroraMatS.current} attach="material" />
      </mesh>
    </group>
  );
}

export default function RealisticEarth3D({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return <Earth position={position} />;
}
