"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** A record on a turntable: the disc lies flat (face up) and spins around its own
 *  vertical axis — exactly how a real platter turns. The whole rig is tilted back
 *  so the camera sees the top face, and leans subtly toward the cursor. */
export function VinylRecord({ scale = 1 }: { scale?: number }) {
  const spin = useRef<THREE.Group>(null); // rotates around Y = the disc normal
  const tilt = useRef<THREE.Group>(null); // subtle cursor lean
  const reduced = useReducedMotion();

  useFrame((state, dt) => {
    if (spin.current && !reduced) spin.current.rotation.y += dt * 2.0; // ~19 rpm, smooth
    if (tilt.current) {
      const { x, y } = state.pointer;
      tilt.current.rotation.x = THREE.MathUtils.lerp(
        tilt.current.rotation.x,
        -0.62 + y * 0.12,
        0.05,
      );
      tilt.current.rotation.z = THREE.MathUtils.lerp(
        tilt.current.rotation.z,
        x * 0.1,
        0.05,
      );
    }
  });

  const grooves = Array.from({ length: 16 }, (_, i) => 0.82 + i * 0.078);

  return (
    <group ref={tilt} scale={scale * 1.05} rotation={[-0.62, 0, 0]}>
      {/* platter beneath the record */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[2.42, 2.42, 0.14, 72]} />
        <meshStandardMaterial color="#14181f" roughness={0.7} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.16, 2.4, 72]} />
        <meshStandardMaterial color="#2d5bff" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* spinning record */}
      <group ref={spin}>
        {/* vinyl body */}
        <mesh>
          <cylinderGeometry args={[2.1, 2.1, 0.07, 128]} />
          <meshStandardMaterial color="#0c0c11" roughness={0.26} metalness={0.55} />
        </mesh>
        {/* concentric grooves catching light */}
        {grooves.map((r, i) => (
          <mesh key={i} position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.011, 96]} />
            <meshStandardMaterial
              color="#3a3a47"
              metalness={0.7}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        {/* a single bright catch-light groove for a glossy read */}
        <mesh position={[0, 0.038, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.47, 96]} />
          <meshStandardMaterial color="#8fe3c8" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* label */}
        <mesh position={[0, 0.039, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.66, 64]} />
          <meshStandardMaterial color="#ff5a45" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.345, 48]} />
          <meshStandardMaterial color="#ffd23f" side={THREE.DoubleSide} />
        </mesh>
        {/* a couple of label ticks so the spin is legible */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => (
          <mesh
            key={a}
            position={[Math.cos(a) * 0.5, 0.041, Math.sin(a) * 0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#fbf7ec" />
          </mesh>
        ))}
        {/* spindle */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
          <meshStandardMaterial color="#fbf7ec" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* tonearm resting toward the groove */}
      <group position={[1.95, 0.12, -1.15]} rotation={[0, -0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.14, 0.22, 24]} />
          <meshStandardMaterial color="#8fe3c8" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[-1.05, 0.0, 0.85]} rotation={[0, 0.7, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.06]} />
          <meshStandardMaterial color="#e9e9ee" metalness={0.6} roughness={0.25} />
        </mesh>
        {/* headshell */}
        <mesh position={[-2.0, -0.03, 1.5]} rotation={[0, 0.7, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.16]} />
          <meshStandardMaterial color="#14181f" />
        </mesh>
      </group>
    </group>
  );
}
