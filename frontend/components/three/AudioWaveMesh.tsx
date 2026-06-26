"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** A dense grid of slim bars rippling like a 3D spectrum analyser. Two combined
 *  wave fields give it an organic, detailed motion rather than a single ripple. */
export function AudioWaveMesh({
  rows = 26,
  cols = 46,
  spacing = 0.3,
}: {
  rows?: number;
  cols?: number;
  spacing?: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const reduced = useReducedMotion();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = rows * cols;

  // the full reference-palette — olive, red, mint, gold, pale yellow — every
  // colour appears as flowing regions across the field
  const palette = useMemo(
    () =>
      ["#63634a", "#f72b00", "#6fc9a6", "#fbde8e", "#fbfbae"].map(
        (h) => new THREE.Color(h),
      ),
    [],
  );
  const white = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        const d = Math.sqrt(x * x + z * z);
        // two interfering waves + a slow swell = organic detail
        const h =
          0.25 +
          (Math.sin(d * 1.5 - t * 2.0) + 1) * 0.5 +
          (Math.sin(x * 0.9 + t * 1.3) * Math.cos(z * 0.9 - t * 0.9) + 1) * 0.35;
        dummy.position.set(x, h / 2 - 0.6, z);
        dummy.scale.set(0.17, h, 0.17);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);

        // colour by a slow-moving position field so all palette hues coexist as
        // drifting regions, then brighten toward cream at the peaks
        const region =
          (Math.sin(x * 0.45 + t * 0.3) + Math.cos(z * 0.4 - t * 0.25) + 2) / 4;
        const idx = Math.min(
          palette.length - 1,
          Math.floor(region * palette.length),
        );
        const norm = (h - 0.25) / 2.0;
        const col = palette[idx].clone().lerp(white, Math.max(0, norm - 0.6) * 0.6);
        m.setColorAt(i, col);
        i++;
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation={[0.62, 0.25, 0]} position={[0, -0.4, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.35} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}
