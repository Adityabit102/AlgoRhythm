"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function Reel({ x }: { x: number }) {
  const ref = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  useFrame((_, dt) => {
    if (ref.current && !reduced) ref.current.rotation.z -= dt * 2;
  });
  return (
    <group ref={ref} position={[x, 0.15, 0.16]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
        <meshStandardMaterial color="#14181f" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 6) * Math.PI * 2]}>
          <boxGeometry args={[0.06, 0.5, 0.05]} />
          <meshStandardMaterial color="#fbf7ec" />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#ffd23f" />
      </mesh>
    </group>
  );
}

/** Retro cassette tape with spinning reels, gently floating. */
export function Cassette3D() {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <group rotation={[0.2, -0.3, 0]}>
        <RoundedBox args={[3, 1.9, 0.3]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#1a43e0" roughness={0.4} />
        </RoundedBox>
        {/* label */}
        <mesh position={[0, 0.55, 0.16]}>
          <boxGeometry args={[2.4, 0.7, 0.02]} />
          <meshStandardMaterial color="#fbf7ec" />
        </mesh>
        <mesh position={[0, 0.55, 0.17]}>
          <boxGeometry args={[2.4, 0.14, 0.02]} />
          <meshStandardMaterial color="#ff5a45" />
        </mesh>
        {/* window */}
        <mesh position={[0, 0.15, 0.16]}>
          <boxGeometry args={[1.8, 0.7, 0.02]} />
          <meshStandardMaterial color="#14181f" opacity={0.85} transparent />
        </mesh>
        <Reel x={-0.55} />
        <Reel x={0.55} />
        {/* bottom holes */}
        {[-0.9, -0.3, 0.3, 0.9].map((x) => (
          <mesh key={x} position={[x, -0.7, 0.16]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
            <meshStandardMaterial color="#14181f" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
