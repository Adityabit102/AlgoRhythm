"use client";

import { Component, useMemo, type ReactNode } from "react";
import { useGLTF, Clone, Center, Float } from "@react-three/drei";
import * as THREE from "three";

/** Loads a .glb from /public and auto-fits it to a target size, so any dropped-in
 *  model renders at a sensible scale regardless of how it was authored. Cloned, so
 *  the same model can appear in several scenes at once. */
export function GLBModel({
  url,
  target = 3.4,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  float = true,
}: {
  url: string;
  target?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  float?: boolean;
}) {
  const { scene } = useGLTF(url);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return (target / maxDim) * scale;
  }, [scene, target, scale]);

  const body = (
    <group position={position} rotation={rotation}>
      <Center scale={fit}>
        <Clone object={scene} castShadow receiveShadow />
      </Center>
    </group>
  );

  return float ? (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
      {body}
    </Float>
  ) : (
    body
  );
}

/** Renders the GLB model; if the file is missing or fails to load, falls back to
 *  the hand-built primitive instead of crashing the canvas. */
export class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
