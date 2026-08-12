import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TOTAL = 2000;
const BATCH_SIZE = 500;

interface FlowPath {
  start: THREE.Vector3;
  control1: THREE.Vector3;
  control2: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
  color: number;
}

function cubicBezier(
  t: number, p0: THREE.Vector3, p1: THREE.Vector3,
  p2: THREE.Vector3, p3: THREE.Vector3
): THREE.Vector3 {
  const u = 1 - t;
  return new THREE.Vector3(
    u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
    u*u*u*p0.z + 3*u*u*t*p1.z + 3*u*t*t*p2.z + t*t*t*p3.z,
  );
}

const WAYPOINTS: Record<string, THREE.Vector3> = {
  earth:    new THREE.Vector3(0, 0, 0),
  ai:       new THREE.Vector3(0, 0.3, 0),
  human:    new THREE.Vector3(3.5, 0.2, 0.5),
  satellite:new THREE.Vector3(-1.5, 2.5, 1),
  cloud:    new THREE.Vector3(-2.5, 1.5, -1),
  database: new THREE.Vector3(2, -1.5, -1.5),
  computer: new THREE.Vector3(-3, -0.5, 0.5),
};

const FLOW_ROUTES: [string, string][] = [
  ["human", "ai"], ["ai", "earth"], ["earth", "satellite"],
  ["satellite", "cloud"], ["cloud", "database"], ["database", "computer"],
  ["computer", "ai"], ["ai", "human"],
  ["human", "earth"], ["earth", "ai"], ["ai", "satellite"],
  ["cloud", "ai"], ["database", "human"], ["satellite", "computer"],
];

const PALETTE = [0x00C8FF, 0x8B5CF6, 0x5EEAD4, 0x8ED8FF];

function generatePaths(count: number): FlowPath[] {
  const paths: FlowPath[] = [];
  for (let i = 0; i < count; i++) {
    const [from, to] = FLOW_ROUTES[i % FLOW_ROUTES.length];
    const start = WAYPOINTS[from].clone();
    const end = WAYPOINTS[to].clone();
    const mid = start.clone().lerp(end, 0.5);
    const dist = start.distanceTo(end);
    const offset3D = new THREE.Vector3(
      (Math.random() - 0.5) * dist * 0.5,
      (Math.random() - 0.5) * dist * 0.4 + dist * 0.3,
      (Math.random() - 0.5) * dist * 0.3
    );
    mid.add(offset3D);
    const control1 = start.clone().lerp(mid, 0.5 + Math.random() * 0.3);
    const control2 = mid.clone().lerp(end, 0.5 + Math.random() * 0.3);
    paths.push({
      start, control1, control2, end,
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random(),
      color: PALETTE[i % PALETTE.length],
    });
  }
  return paths;
}

function DataBatch({ paths, timeRef }: { paths: FlowPath[]; timeRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geo, dummy } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(paths.length * 3);
    const col = new Float32Array(paths.length * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geo, dummy: new THREE.Object3D() };
  }, [paths]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const t = timeRef.current;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;
    const c = new THREE.Color();

    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];
      const progress = (p.offset + t * p.speed * 0.12) % 1;
      const pt = cubicBezier(progress, p.start, p.control1, p.control2, p.end);
      posArr[i*3] = pt.x;
      posArr[i*3+1] = pt.y;
      posArr[i*3+2] = pt.z;
      c.setHex(p.color);
      const fade = Math.sin(progress * Math.PI);
      colArr[i*3] = c.r * fade;
      colArr[i*3+1] = c.g * fade;
      colArr[i*3+2] = c.b * fade;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        vertexColors size={0.035} transparent opacity={0.85}
        blending={THREE.AdditiveBlending} depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function DataFlowParticles() {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  const batches = useMemo(() => {
    const allPaths = generatePaths(TOTAL);
    const result: FlowPath[][] = [];
    for (let i = 0; i < allPaths.length; i += BATCH_SIZE) {
      result.push(allPaths.slice(i, i + BATCH_SIZE));
    }
    return result;
  }, []);

  return (
    <group>
      {batches.map((batch, i) => (
        <DataBatch key={`batch-${i}`} paths={batch} timeRef={timeRef} />
      ))}
    </group>
  );
}
