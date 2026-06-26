"use client";

import { Component, useMemo, useRef, type ReactNode } from "react";
import { useGLTF, Clone, Center, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** Loads a .glb from /public and auto-fits it to a target size, so any dropped-in
 *  model renders at a sensible scale regardless of how it was authored. Cloned, so
 *  the same model can appear in several scenes at once. Spins continuously. */
export function GLBModel({
  url,
  target = 3.4,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  float = true,
  spin = true,
}: {
  url: string;
  target?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  float?: boolean;
  spin?: boolean;
}) {
  const { scene } = useGLTF(url);
  const spinner = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return (target / maxDim) * scale;
  }, [scene, target, scale]);

  useFrame((_, dt) => {
    if (spin && spinner.current) spinner.current.rotation.y += dt * (reduced ? 0.18 : 0.5);
  });

  const body = (
    <group ref={spinner}>
      <group position={position} rotation={rotation}>
        <Center scale={fit}>
          <Clone object={scene} castShadow receiveShadow />
        </Center>
      </group>
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
 *  the hand-built primitive instead of crashing the canvas. Also silences the
 *  thrown load error so it doesn't surface the dev error overlay. */
export class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    // swallow — the fallback primitive is the intended behaviour
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
