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
      const s = 1 + Math.sin(state.clock.elapsedTime * 8 + x) * 0.05;
      cone.current.scale.set(s, s, 1);
    }
  });
  return (
    <group position={[x, -0.1, 0.47]}>
      {/* outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.66, 0.07, 16, 40]} />
        <meshStandardMaterial color="#0e0e14" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* grille recesses */}
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 36]} />
        <meshStandardMaterial color="#161620" />
      </mesh>
      {/* concentric grille rings */}
      {[0.5, 0.36, 0.22].map((r) => (
        <mesh key={r} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.012, 8, 36]} />
          <meshStandardMaterial color="#2a2a33" />
        </mesh>
      ))}
      {/* cone */}
      <mesh ref={cone} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.42, 0.18, 36]} />
        <meshStandardMaterial color="#2d5bff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#ffd23f" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Detailed ghettoblaster: antenna, handle, cassette deck, dials, EQ LEDs, speakers. */
export function Boombox3D() {
  return (
    <Float speed={1} rotationIntensity={0.35} floatIntensity={0.85}>
      <group rotation={[0.12, -0.22, 0]} scale={0.82}>
        {/* body */}
        <RoundedBox args={[4.1, 2.3, 0.95]} radius={0.12} smoothness={5} castShadow>
          <meshStandardMaterial color="#ff5a45" roughness={0.4} metalness={0.05} />
        </RoundedBox>
        {/* front recessed panel */}
        <RoundedBox args={[3.85, 2.05, 0.06]} radius={0.1} position={[0, 0, 0.47]}>
          <meshStandardMaterial color="#e84d3d" roughness={0.45} />
        </RoundedBox>

        {/* handle */}
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.72, 0.08, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#0e0e14" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* antenna */}
        <mesh position={[1.7, 1.5, -0.2]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.025, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#cfcfd6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.05, 2.2, -0.2]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#cfcfd6" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* cassette deck door */}
        <RoundedBox args={[1.4, 0.8, 0.05]} radius={0.05} position={[0, 0.55, 0.5]}>
          <meshStandardMaterial color="#14181f" roughness={0.3} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.55, 0.53]}>
          <boxGeometry args={[1.0, 0.45, 0.02]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>

        {/* dials */}
        {[-1.3, 1.3].map((x, i) => (
          <mesh key={x} position={[x, 0.62, 0.5]} rotation={[Math.PI / 2, i, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.1, 24]} />
            <meshStandardMaterial color="#ffd23f" metalness={0.2} roughness={0.5} />
          </mesh>
        ))}

        {/* EQ LED row */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[-0.66 + i * 0.22, 0.05, 0.5]}>
            <boxGeometry args={[0.1, 0.16 + (i % 3) * 0.06, 0.04]} />
            <meshStandardMaterial
              color={i < 3 ? "#8fe3c8" : i < 5 ? "#ffd23f" : "#ff5a45"}
              emissive={i < 3 ? "#8fe3c8" : i < 5 ? "#ffd23f" : "#ff5a45"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        {/* transport buttons */}
        {[-0.5, -0.2, 0.1, 0.4].map((x) => (
          <mesh key={x} position={[x, -0.32, 0.5]}>
            <boxGeometry args={[0.2, 0.12, 0.06]} />
            <meshStandardMaterial color="#fbf7ec" />
          </mesh>
        ))}

        <Speaker x={-1.25} />
        <Speaker x={1.25} />
      </group>
    </Float>
  );
}
