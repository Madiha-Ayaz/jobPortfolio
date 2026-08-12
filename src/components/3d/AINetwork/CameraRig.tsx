import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.5, 0));
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    smoothMouse.current.x += (pointer.x - smoothMouse.current.x) * 0.03;
    smoothMouse.current.y += (pointer.y - smoothMouse.current.y) * 0.03;

    const baseX = Math.sin(t * 0.08) * 0.3;
    const baseY = 1.5 + Math.sin(t * 0.06) * 0.2;
    const baseZ = 8.5 + Math.sin(t * 0.04) * 0.15;

    camera.position.x = baseX + smoothMouse.current.x * 0.5;
    camera.position.y = baseY + smoothMouse.current.y * 0.3;
    camera.position.z = baseZ;

    target.current.x = smoothMouse.current.x * 0.3;
    target.current.y = 0.5 + smoothMouse.current.y * 0.15;
    target.current.z = 0;
    camera.lookAt(target.current);
  });

  return null;
}
