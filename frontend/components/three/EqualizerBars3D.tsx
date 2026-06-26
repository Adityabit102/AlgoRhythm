"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function Bar({
  x,
  baseHeight,
  speed,
  color,
}: {
  x: number;
  baseHeight: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  useFrame((state) => {
    if (!ref.current) return;
    const h = reduced
      ? baseHeight
      : baseHeight + (Math.sin(state.clock.elapsedTime * speed + x) + 1) * 0.8;
    ref.current.scale.y = h;
    ref.current.position.y = h / 2 - 1;
  });
  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <boxGeometry args={[0.4, 1, 0.4]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

const COLORS = ["#1a43e0", "#2d5bff", "#8fe3c8", "#ffd23f", "#ff5a45"];

/** A row of equalizer bars. `intensity` (0..1) scales the base heights — wire it
 *  to a track's hit probability for a reactive accent. */
export function EqualizerBars3D({
  bars = 9,
  intensity = 0.5,
}: {
  bars?: number;
  intensity?: number;
}) {
  return (
    <group rotation={[0.2, 0, 0]}>
      {Array.from({ length: bars }).map((_, i) => (
        <Bar
          key={i}
          x={(i - bars / 2) * 0.55 + 0.27}
          baseHeight={0.4 + intensity * 1.5 + (i % 3) * 0.2}
          speed={3 + (i % 4)}
          color={COLORS[i % COLORS.length]}
        />
      ))}
    </group>
  );
}
