"use client";

import { Float } from "@react-three/drei";

function Cup({ x }: { x: number }) {
  const sign = x > 0 ? -1 : 1;
  return (
    <group position={[x, -0.35, 0]} rotation={[0, sign * 0.3, 0]}>
      {/* outer shell */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.62, 0.68, 0.45, 36]} />
        <meshStandardMaterial color="#14181f" roughness={0.45} metalness={0.2} />
      </mesh>
      {/* accent rim */}
      <mesh position={[sign * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.05, 16, 40]} />
        <meshStandardMaterial color="#ffd23f" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* ear cushion */}
      <mesh position={[sign * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 36]} />
        <meshStandardMaterial color="#2a2a33" roughness={0.85} />
      </mesh>
      {/* inner driver */}
      <mesh position={[sign * 0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 36]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>
      {/* yoke arm */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <torusGeometry args={[0.5, 0.045, 12, 24, Math.PI / 1.4]} />
        <meshStandardMaterial color="#cfcfd6" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Detailed over-ear headphones: padded band, cushioned cups, yokes, accent rims. */
export function Headphones3D() {
  return (
    <Float speed={1.2} rotationIntensity={0.7} floatIntensity={1.3}>
      <group rotation={[0.1, 0.3, 0]} scale={1.25}>
        {/* headband outer */}
        <mesh castShadow>
          <torusGeometry args={[1.15, 0.1, 20, 48, Math.PI]} />
          <meshStandardMaterial color="#ff5a45" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* headband padding (inner) */}
        <mesh>
          <torusGeometry args={[1.0, 0.08, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#2a2a33" roughness={0.85} />
        </mesh>
        {/* adjustment sliders */}
        {[-1.0, 1.0].map((x) => (
          <mesh key={x} position={[x, 0.15, 0]}>
            <boxGeometry args={[0.16, 0.5, 0.16]} />
            <meshStandardMaterial color="#cfcfd6" metalness={0.7} roughness={0.25} />
          </mesh>
        ))}
        <Cup x={-1.15} />
        <Cup x={1.15} />
      </group>
    </Float>
  );
}
