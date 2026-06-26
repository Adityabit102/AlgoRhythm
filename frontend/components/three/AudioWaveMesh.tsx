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

  // low→high ramp through the reference-image palette: blue → mint → yellow
  const ramp = useMemo(() => {
    const stops = ["#1b4de4", "#2d5bff", "#7ad5bd", "#a8e0d0", "#f4d74e", "#ffd23f"].map(
      (h) => new THREE.Color(h),
    );
    return (t: number) => {
      const x = Math.max(0, Math.min(0.999, t)) * (stops.length - 1);
      const i = Math.floor(x);
      return stops[i].clone().lerp(stops[i + 1], x - i);
    };
  }, []);

  // sparse red accents (image's red) so peaks pop without flooding the field
  const coral = useMemo(() => new THREE.Color("#e8473d"), []);

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

        const norm = (h - 0.25) / 2.0;
        const col = norm > 0.92 ? coral.clone() : ramp(norm);
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
