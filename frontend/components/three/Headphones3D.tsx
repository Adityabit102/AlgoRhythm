"use client";

import { Float } from "@react-three/drei";

function Cup({ x }: { x: number }) {
  return (
    <group position={[x, -0.3, 0]} rotation={[0, x > 0 ? -0.3 : 0.3, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.55, 0.55, 0.5, 32]} />
        <meshStandardMaterial color="#14181f" roughness={0.5} />
      </mesh>
      <mesh position={[x > 0 ? -0.28 : 0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
        <meshStandardMaterial color="#ffd23f" />
      </mesh>
    </group>
  );
}

/** Floating over-ear headphones. */
export function Headphones3D() {
  return (
    <Float speed={1.3} rotationIntensity={0.8} floatIntensity={1.4}>
      <group rotation={[0.1, 0.3, 0]} scale={1.3}>
        {/* head band */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.1, 0.12, 20, 48, Math.PI]} />
          <meshStandardMaterial color="#ff5a45" roughness={0.4} />
        </mesh>
        <Cup x={-1.1} />
        <Cup x={1.1} />
      </group>
    </Float>
  );
}
