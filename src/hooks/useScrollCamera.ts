/**
 * useScrollCamera - Drives a Three.js camera between keyframes based on
 * the page's scroll progress. Provides a true 3D "fly-through" transition
 * between the hero, the earth-showcase, and the CTA sections.
 *
 * Pass it an array of {position, lookAt} keyframes. It will interpolate
 * the camera smoothly as the user scrolls.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type CameraKeyframe = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

export function useScrollCamera(keyframes: CameraKeyframe[]) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const p = progress.current;
    const segments = keyframes.length - 1;
    const scaled = p * segments;
    const i = Math.min(segments - 1, Math.floor(scaled));
    const t = scaled - i;
    // Smooth ease-in-out between keyframes
    const e = t * t * (3 - 2 * t);

    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (!a || !b) return;

    desiredPos.current.set(
      a.position[0] + (b.position[0] - a.position[0]) * e,
      a.position[1] + (b.position[1] - a.position[1]) * e,
      a.position[2] + (b.position[2] - a.position[2]) * e
    );
    target.current.set(
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * e,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * e,
      a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * e
    );

    // Damped follow for buttery motion
    const k = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desiredPos.current, k * 0.7);
    camera.lookAt(target.current);
  });
}
