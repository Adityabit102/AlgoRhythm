"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function Reel({ x, fill }: { x: number; fill: number }) {
  const ref = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  useFrame((_, dt) => {
    if (ref.current && !reduced) ref.current.rotation.z -= dt * 2;
  });
  return (
    <group ref={ref} position={[x, 0.15, 0.17]}>
      {/* spool hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
        <meshStandardMaterial color="#ffd23f" roughness={0.4} />
      </mesh>
      {/* tape wound on the spool */}
      <mesh>
        <cylinderGeometry args={[0.38 * fill + 0.18, 0.38 * fill + 0.18, 0.1, 32]} />
        <meshStandardMaterial color="#3a2a18" roughness={0.7} />
      </mesh>
      {/* sprocket teeth */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 6) * Math.PI * 2]}>
          <boxGeometry args={[0.05, 0.34, 0.05]} />
          <meshStandardMaterial color="#fbf7ec" />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        <meshStandardMaterial color="#14181f" />
      </mesh>
    </group>
  );
}

/** Detailed retro cassette: screws, label strip, tape window, reels and tabs. */
export function Cassette3D() {
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      <group rotation={[0.2, -0.35, 0]} scale={1.05}>
        {/* shell */}
        <RoundedBox args={[3, 1.9, 0.32]} radius={0.1} smoothness={5} castShadow>
          <meshStandardMaterial color="#1a43e0" roughness={0.35} metalness={0.1} />
        </RoundedBox>
        {/* recessed front face */}
        <RoundedBox args={[2.7, 1.62, 0.06]} radius={0.08} position={[0, 0, 0.16]}>
          <meshStandardMaterial color="#244ce8" roughness={0.4} />
        </RoundedBox>

        {/* corner screws */}
        {[
          [-1.32, 0.78],
          [1.32, 0.78],
          [-1.32, -0.78],
          [1.32, -0.78],
        ].map(([sx, sy], i) => (
          <mesh key={i} position={[sx, sy, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
            <meshStandardMaterial color="#0e0e14" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}

        {/* label strip */}
        <mesh position={[0, 0.58, 0.2]}>
          <boxGeometry args={[2.4, 0.66, 0.02]} />
          <meshStandardMaterial color="#fbf7ec" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.74, 0.21]}>
          <boxGeometry args={[2.4, 0.12, 0.02]} />
          <meshStandardMaterial color="#ff5a45" />
        </mesh>
        <mesh position={[0, 0.6, 0.21]}>
          <boxGeometry args={[2.4, 0.04, 0.02]} />
          <meshStandardMaterial color="#8fe3c8" />
        </mesh>

        {/* tape window */}
        <mesh position={[0, 0.12, 0.2]}>
          <boxGeometry args={[1.9, 0.66, 0.02]} />
          <meshStandardMaterial color="#0c0c11" metalness={0.3} roughness={0.5} />
        </mesh>
        <Reel x={-0.55} fill={0.85} />
        <Reel x={0.55} fill={0.35} />

        {/* bottom drive holes + write-protect tabs */}
        {[-0.95, -0.32, 0.32, 0.95].map((x) => (
          <mesh key={x} position={[x, -0.72, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#0c0c11" />
          </mesh>
        ))}
        {[-1.28, 1.28].map((x) => (
          <mesh key={x} position={[x, -0.82, 0.17]}>
            <boxGeometry args={[0.16, 0.12, 0.06]} />
            <meshStandardMaterial color="#0e0e14" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
