/**
 * PhotorealisticEarth3D - A NASA-quality procedural Earth.
 * Realistic features: procedural continents, specular ocean, atmospheric
 * Rayleigh-style rim glow, day/night terminator, city lights, clouds, axial tilt.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const noiseGLSL = /* glsl */ `
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise3(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(p + vec3(0,0,0)), hash3(p + vec3(1,0,0)), f.x),
          mix(hash3(p + vec3(0,1,0)), hash3(p + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(p + vec3(0,0,1)), hash3(p + vec3(1,1,1)), f.x),
          mix(hash3(p + vec3(0,1,1)), hash3(p + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
  float fbm3(vec3 p, int oct) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 8; i++) {
      if (i >= oct) break;
      v += a * noise3(p);
      p = p * 2.03 + vec3(11.7, 5.3, 17.1);
      a *= 0.5;
    }
    return v;
  }
`;


// ----- Earth surface shader -----
const earthVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;


const earthFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3  uSunDir;

  ${noiseGLSL}

  // Ocean — enhanced vivid blue with rich Caribbean teal and deep abyssal
  vec3 oceanColor(float depth) {
    vec3 trench  = vec3(0.002, 0.008, 0.035);  // deeper, richer abyssal
    vec3 deep    = vec3(0.008, 0.045, 0.190);  // deep vivid blue
    vec3 mid     = vec3(0.015, 0.130, 0.380);  // richer open ocean
    vec3 tropic  = vec3(0.010, 0.380, 0.580);  // punchy Caribbean blue
    vec3 shallow = vec3(0.180, 0.620, 0.720);  // bright coastline turquoise
    vec3 c = mix(trench,  deep,    smoothstep(0.00, 0.20, depth));
    c     = mix(c,        mid,     smoothstep(0.20, 0.45, depth));
    c     = mix(c,        tropic,  smoothstep(0.45, 0.65, depth));
    c     = mix(c,        shallow, smoothstep(0.65, 0.85, depth));
    // Boost saturation
    c = mix(c, c * 1.12, 0.6);
    return c;
  }

  // Land — enhanced saturation, deeper greens, warmer sands
  vec3 landBiome(vec3 p, float h, float moisture) {
    vec3 sand   = vec3(0.92, 0.78, 0.48);  // warmer Sahara sand
    vec3 grass  = vec3(0.35, 0.55, 0.14);  // richer savanna green
    vec3 forest = vec3(0.04, 0.34, 0.08);  // deeper Amazon green
    vec3 jungle = vec3(0.03, 0.32, 0.06);  // lush tropical
    vec3 rock   = vec3(0.46, 0.36, 0.28);  // warmer Tibetan rock
    vec3 snow   = vec3(0.98, 0.99, 1.00);  // brighter alpine snow
    vec3 tundra = vec3(0.48, 0.42, 0.32);  // warmer tundra
    vec3 redrock= vec3(0.68, 0.28, 0.12);  // deeper red outback

    vec3 c = sand;
    c = mix(c, grass,  smoothstep(0.05, 0.18, h));
    c = mix(c, forest, smoothstep(0.20, 0.50, h) * moisture);
    c = mix(c, jungle, smoothstep(0.15, 0.32, h) * (1.0 - moisture) * 0.7);
    c = mix(c, rock,   smoothstep(0.50, 0.75, h));
    c = mix(c, snow,   smoothstep(0.78, 0.94, h));

    float arid = smoothstep(0.50, 0.82, fbm3(p * 0.9 + 13.0, 3));
    c = mix(c, vec3(0.82, 0.64, 0.30), arid * 0.6 * (1.0 - moisture));

    float red = smoothstep(0.65, 0.85, fbm3(p * 1.4 + 71.0, 3));
    c = mix(c, redrock, red * 0.45 * (1.0 - moisture) * (1.0 - arid));

    float tund = smoothstep(0.55, 0.78, abs(p.y)) * (1.0 - moisture) * 0.35;
    c = mix(c, tundra, tund);

    // Slight saturation boost for land
    c = mix(c, c * 1.08, 0.3);
    return c;
  }

  void main() {
    vec3 p = normalize(vWorldPos);
    float lat = p.y;

    float continents = fbm3(p * 1.25, 5);
    float land = smoothstep(0.52, 0.555, continents);
    float elev  = fbm3(p * 2.4, 6);
    float mountains = smoothstep(0.45, 0.75, elev);
    float elevation = elev * 0.55 + mountains * 0.45;
    float moisture = fbm3(p * 1.8 + 31.0, 4);

    vec3 oceanCol = oceanColor(1.0 - continents);
    vec3 landCol  = landBiome(p, elevation, moisture);

    float ice = smoothstep(0.78, 0.92, abs(lat));
    vec3 surface = mix(oceanCol, landCol, land);
    vec3 iceCol  = vec3(0.93, 0.97, 1.00);
    surface = mix(surface, iceCol, ice * 0.92);

    vec3 N = normalize(vNormal);
    vec3 L = normalize(uSunDir);
    float NdotL = dot(N, L);
    float lit = smoothstep(-0.18, 0.30, NdotL);

    float waterMask = 1.0 - land;
    vec3 H = normalize(L + normalize(vViewDir));
    float spec = pow(max(dot(N, H), 0.0), 80.0) * waterMask * lit;

    vec3 dayColor = surface * (0.30 + 0.70 * max(NdotL, 0.0));
    dayColor += vec3(1.0, 0.95, 0.85) * spec * 1.2;

    float night = 1.0 - lit;
    float cityMask = land * smoothstep(0.30, 0.65, fbm3(p * 24.0, 3));
    float cityGlow  = cityMask * smoothstep(0.55, 0.85, fbm3(p * 80.0, 2));
    vec3 cityColor  = vec3(1.00, 0.72, 0.35) * cityGlow * 1.6 * night;
    vec3 moonAmbient = surface * 0.03 * night;

    vec3 color = dayColor + cityColor + moonAmbient;

    float fres = pow(1.0 - max(dot(N, normalize(vViewDir)), 0.0), 2.5);
    color += vec3(0.18, 0.42, 0.85) * fres * 0.55 * lit;

    color = pow(color, vec3(0.95));
    gl_FragColor = vec4(color, 1.0);
  }
`;


// ----- Realistic clouds (translucent, sun-shadowed) -----
const cloudVertex = earthVertex;

const cloudFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3  uSunDir;

  ${noiseGLSL}

  void main() {
    vec3 p = normalize(vWorldPos);
    float n = fbm3(p * 3.5 + vec3(uTime * 0.018, 0.0, uTime * 0.006), 6);
    float density = smoothstep(0.46, 0.78, n);

    vec3 L = normalize(uSunDir);
    float NdotL = dot(normalize(vNormal), L);
    float lit = smoothstep(-0.10, 0.35, NdotL);

    vec3 sunlit  = vec3(1.00, 0.99, 0.97);
    vec3 shadow  = vec3(0.20, 0.26, 0.36);
    vec3 cloudCol = mix(shadow, sunlit, lit);

    float alpha = density * (0.30 + 0.55 * lit);
    gl_FragColor = vec4(cloudCol, alpha);
  }
`;

// ----- Atmospheric scattering (Fresnel-driven) -----
const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform vec3 uSunDir;
  uniform vec3 uCameraPos;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);
    vec3 L = normalize(uSunDir);

    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);

    float sunDot = max(dot(N, L), 0.0);
    vec3 warm = vec3(1.00, 0.55, 0.25);
    vec3 cool = vec3(0.25, 0.50, 1.00);
    vec3 atmoCol = mix(cool, warm, sunDot * 0.85);

    gl_FragColor = vec4(atmoCol, fres * 0.85);
  }
`;


function EarthMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);
  const sunDir = useRef(new THREE.Vector3(1.0, 0.18, 0.6).normalize());

  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
        uniforms: {
          uTime: { value: 0 },
          uSunDir: { value: sunDir.current.clone() },
        },
      }),
    []
  );

  const cloudMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudVertex,
        fragmentShader: cloudFragment,
        uniforms: {
          uTime: { value: 0 },
          uSunDir: { value: sunDir.current.clone() },
        },
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uSunDir: { value: sunDir.current.clone() },
          uCameraPos: { value: new THREE.Vector3() },
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Continuous, clearly visible rotation
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.18;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.22;

    // The sun orbits slowly around the Earth (so the day/night terminator
    // is always moving and is easy to see).
    const sunAngle = t * 0.12;
    sunDir.current
      .set(Math.cos(sunAngle) * 2.0, 0.25, Math.sin(sunAngle) * 2.0)
      .normalize();

    earthMat.uniforms.uSunDir.value.copy(sunDir.current);
    cloudMat.uniforms.uSunDir.value.copy(sunDir.current);
    cloudMat.uniforms.uTime.value = t;
    earthMat.uniforms.uTime.value = t;
    atmoMat.uniforms.uSunDir.value.copy(sunDir.current);

    if (groupRef.current) {
      // Continuous, organic wobble (Lissajous-style) so the planet
      // never looks frozen, even on a static frame.
      groupRef.current.rotation.y = Math.sin(t * 0.10) * 0.18;
      groupRef.current.rotation.x = Math.cos(t * 0.08) * 0.06;
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={earthRef} rotation={[0.0, 0.0, 0.4091]}>
        <sphereGeometry args={[1.4, 192, 192]} />
        <primitive object={earthMat} attach="material" />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]} rotation={[0.0, 0.0, 0.4091]}>
        <sphereGeometry args={[1.4, 128, 128]} />
        <primitive object={cloudMat} attach="material" />
      </mesh>

      <mesh ref={atmoRef} scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <primitive object={atmoMat} attach="material" />
      </mesh>
    </group>
  );
}

export default function PhotorealisticEarth3D({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <EarthMesh />
    </group>
  );
}
