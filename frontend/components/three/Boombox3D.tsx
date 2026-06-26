"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function Speaker({ x }: { x: number }) {
  const cone = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  useFrame((state) => {
    if (cone.current && !reduced) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 8 + x) * 0.06;
      cone.current.scale.set(s, s, 1);
    }
  });
  return (
    <group position={[x, -0.1, 0.46]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.1, 32]} />
        <meshStandardMaterial color="#14181f" />
      </mesh>
      <mesh ref={cone} position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.45, 0.2, 0.16, 32]} />
        <meshStandardMaterial color="#2d5bff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffd23f" />
      </mesh>
    </group>
  );
}

/** Retro ghettoblaster / boombox with pulsing speakers. */
export function Boombox3D() {
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
      <group rotation={[0.1, -0.2, 0]} scale={0.9}>
        {/* body */}
        <RoundedBox args={[4, 2.2, 0.9]} radius={0.14} smoothness={4}>
          <meshStandardMaterial color="#ff5a45" roughness={0.45} />
        </RoundedBox>
        {/* handle */}
        <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.07, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#14181f" />
        </mesh>
        {/* deck / cassette window */}
        <mesh position={[0, 0.55, 0.46]}>
          <boxGeometry args={[1.3, 0.7, 0.04]} />
          <meshStandardMaterial color="#14181f" />
        </mesh>
        {/* buttons */}
        {[-0.4, -0.1, 0.2, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.46]}>
            <boxGeometry args={[0.18, 0.12, 0.06]} />
            <meshStandardMaterial color="#fbf7ec" />
          </mesh>
        ))}
        <Speaker x={-1.2} />
        <Speaker x={1.2} />
      </group>
    </Float>
  );
}
