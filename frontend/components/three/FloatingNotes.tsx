"use client";

import { useMemo } from "react";
import { Float } from "@react-three/drei";

const COLORS = ["#1a43e0", "#ffd23f", "#ff5a45", "#8fe3c8", "#2d5bff"];

/** A single eighth-note built from geometry: a tilted head + a stem + a flag. */
function Note({ color, size }: { color: string; size: number }) {
  return (
    <group scale={size}>
      {/* note head */}
      <mesh rotation={[0, 0, -0.4]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      {/* stem */}
      <mesh position={[0.3, 0.85, 0]}>
        <boxGeometry args={[0.08, 1.5, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      {/* flag */}
      <mesh position={[0.5, 1.35, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.5, 0.18, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** A cloud of floating geometric music notes. No font dependency. */
export function FloatingNotes({ count = 14 }: { count?: number }) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = (n: number) => {
        const x = Math.sin(i * 99.13 + n * 12.7) * 43758.5453;
        return x - Math.floor(x);
      };
      return {
        color: COLORS[Math.floor(seed(2) * COLORS.length)],
        pos: [
          (seed(3) - 0.5) * 9,
          (seed(4) - 0.5) * 6,
          (seed(5) - 0.5) * 5,
        ] as [number, number, number],
        size: 0.4 + seed(6) * 0.6,
        speed: 1 + seed(7) * 2,
        rot: seed(8) * Math.PI,
      };
    });
  }, [count]);

  return (
    <group>
      {items.map((it, i) => (
        <Float key={i} speed={it.speed} rotationIntensity={1.2} floatIntensity={1.6}>
          <group position={it.pos} rotation={[0, 0, it.rot]}>
            <Note color={it.color} size={it.size} />
          </group>
        </Float>
      ))}
    </group>
  );
}
