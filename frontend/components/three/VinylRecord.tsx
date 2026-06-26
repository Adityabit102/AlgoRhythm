"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** Spinning vinyl record on a turntable with a tonearm. Tilts toward the cursor. */
export function VinylRecord({ scale = 1 }: { scale?: number }) {
  const disc = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame((state) => {
    if (disc.current && !reduced) disc.current.rotation.z -= 0.012;
    if (group.current) {
      const { x, y } = state.pointer;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -0.9 + y * 0.25,
        0.06,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        x * 0.4,
        0.06,
      );
    }
  });

  return (
    <group ref={group} scale={scale} rotation={[-0.9, 0, 0]}>
      {/* turntable base */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.6, 0.3, 64]} />
        <meshStandardMaterial color="#14181f" roughness={0.6} />
      </mesh>
      {/* record */}
      <group ref={disc}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[2.1, 2.1, 0.06, 96]} />
          <meshStandardMaterial color="#14181f" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* grooves */}
        {[1.85, 1.55, 1.25, 0.95].map((r) => (
          <mesh key={r} position={[0, -0.118, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.006, 8, 96]} />
            <meshStandardMaterial color="#2d5bff" />
          </mesh>
        ))}
        {/* label */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.02, 64]} />
          <meshStandardMaterial color="#ff5a45" />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 24]} />
          <meshStandardMaterial color="#ffd23f" />
        </mesh>
      </group>
      {/* tonearm */}
      <group position={[1.9, 0, 1.9]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 24]} />
          <meshStandardMaterial color="#8fe3c8" />
        </mesh>
        <mesh position={[-0.9, 0.1, -0.9]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2.4, 0.06, 0.06]} />
          <meshStandardMaterial color="#fbf7ec" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
