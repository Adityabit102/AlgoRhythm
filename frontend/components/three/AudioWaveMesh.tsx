"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** A grid of bars rippling like an audio spectrum / waveform field. */
export function AudioWaveMesh({
  rows = 14,
  cols = 24,
  spacing = 0.42,
}: {
  rows?: number;
  cols?: number;
  spacing?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const reduced = useReducedMotion();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = rows * cols;

  const colorPalette = useMemo(
    () => [
      new THREE.Color("#1a43e0"),
      new THREE.Color("#2d5bff"),
      new THREE.Color("#8fe3c8"),
      new THREE.Color("#ffd23f"),
      new THREE.Color("#ff5a45"),
    ],
    [],
  );

  useFrame((state) => {
    const mref = mesh.current;
    if (!mref) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        const d = Math.sqrt(x * x + z * z);
        const h = 0.4 + (Math.sin(d * 1.6 - t * 2.2) + 1) * 0.9;
        dummy.position.set(x, h / 2 - 0.5, z);
        dummy.scale.set(0.22, h, 0.22);
        dummy.updateMatrix();
        mref.setMatrixAt(i, dummy.matrix);
        const ci = Math.min(
          colorPalette.length - 1,
          Math.floor((h / 2.2) * colorPalette.length),
        );
        mref.setColorAt(i, colorPalette[ci]);
        i++;
      }
    }
    mref.instanceMatrix.needsUpdate = true;
    if (mref.instanceColor) mref.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation={[0.5, 0.3, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}
