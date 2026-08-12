import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 40;
const MAX_EDGES = 80;
const AMBIENT_COUNT = 1500;

/* ═══════════════════════════════════════
   NEURAL NETWORK - Dynamic pulsing lines
   ═══════════════════════════════════════ */

function NeuralNetwork() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  const nodeData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ));
    }
    return positions;
  }, []);

  const edgeData = useMemo(() => {
    const edges: [number, number][] = [];
    const nodeEdges = new Map<number, number[]>();
    for (let i = 0; i < NODE_COUNT; i++) nodeEdges.set(i, []);

    for (let i = 0; i < MAX_EDGES; i++) {
      const a = Math.floor(Math.random() * NODE_COUNT);
      let b = Math.floor(Math.random() * NODE_COUNT);
      if (a === b) b = (a + 1) % NODE_COUNT;
      const existing = nodeEdges.get(a) || [];
      if (existing.includes(b)) continue;
      if (existing.length >= 3) continue;
      existing.push(b);
      nodeEdges.set(a, existing);
      const dist = nodeData[a].distanceTo(nodeData[b]);
      if (dist < 5) edges.push([a, b]);
    }
    return edges;
  }, [nodeData]);

  const lineGeo = useMemo(() => {
    const pts = new Float32Array(edgeData.length * 6);
    edgeData.forEach(([a, b], i) => {
      pts[i*6] = nodeData[a].x; pts[i*6+1] = nodeData[a].y; pts[i*6+2] = nodeData[a].z;
      pts[i*6+3] = nodeData[b].x; pts[i*6+4] = nodeData[b].y; pts[i*6+5] = nodeData[b].z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, [edgeData, nodeData]);

  const nodeDummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (nodesRef.current) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = nodeData[i];
        nodeDummy.position.set(
          p.x + Math.sin(t * 0.5 + i * 0.7) * 0.15,
          p.y + Math.cos(t * 0.4 + i * 0.9) * 0.1,
          p.z + Math.sin(t * 0.3 + i * 1.1) * 0.12,
        );
        const pulse = Math.sin(t * 1.5 + i * 1.2) * 0.5 + 0.5;
        nodeDummy.scale.setScalar(0.03 + pulse * 0.03);
        nodeDummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, nodeDummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      edgeData.forEach(([a, b], i) => {
        const na = nodeData[a];
        const nb = nodeData[b];
        arr[i*6] = na.x + Math.sin(t*0.5+a*0.7)*0.15;
        arr[i*6+1] = na.y + Math.cos(t*0.4+a*0.9)*0.1;
        arr[i*6+2] = na.z + Math.sin(t*0.3+a*1.1)*0.12;
        arr[i*6+3] = nb.x + Math.sin(t*0.5+b*0.7)*0.15;
        arr[i*6+4] = nb.y + Math.cos(t*0.4+b*0.9)*0.1;
        arr[i*6+5] = nb.z + Math.sin(t*0.3+b*1.1)*0.12;
      });
      posAttr.needsUpdate = true;

      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#00C8FF" transparent opacity={0.18} />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#5EEAD4" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  );
}

/* ═══════════════════════════════════════
   AMBIENT PARTICLES - floating dust, sparks
   ═══════════════════════════════════════ */

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const { geo, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(AMBIENT_COUNT * 3);
    const vel = new Float32Array(AMBIENT_COUNT * 3);
    const sz = new Float32Array(AMBIENT_COUNT);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      pos[i*3] = (Math.random()-0.5) * 16;
      pos[i*3+1] = (Math.random()-0.5) * 8;
      pos[i*3+2] = (Math.random()-0.5) * 8;
      vel[i*3] = (Math.random()-0.5) * 0.003;
      vel[i*3+1] = (Math.random()-0.5) * 0.002;
      vel[i*3+2] = (Math.random()-0.5) * 0.003;
      sz[i] = 0.5 + Math.random() * 1.5;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sz, 1));
    return { geo, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      arr[i*3] += velocities[i*3] + Math.sin(t * 0.2 + i) * 0.0005;
      arr[i*3+1] += velocities[i*3+1] + Math.cos(t * 0.15 + i * 0.5) * 0.0003;
      arr[i*3+2] += velocities[i*3+2];
      if (Math.abs(arr[i*3]) > 8) arr[i*3] *= -0.9;
      if (Math.abs(arr[i*3+1]) > 4) arr[i*3+1] *= -0.9;
      if (Math.abs(arr[i*3+2]) > 4) arr[i*3+2] *= -0.9;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#8ED8FF" size={0.015} transparent opacity={0.4}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export { NeuralNetwork, AmbientParticles };
