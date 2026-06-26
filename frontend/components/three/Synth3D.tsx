"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function Key({ x, delay }: { x: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  useFrame((state) => {
    if (!ref.current) return;
    const press = reduced
      ? 0
      : Math.max(0, Math.sin(state.clock.elapsedTime * 3 + delay)) * 0.12;
    ref.current.position.y = -press;
    ref.current.rotation.x = press * 1.2;
  });
  return (
    <mesh ref={ref} position={[x, 0, 0.5]}>
      <boxGeometry args={[0.22, 0.12, 1]} />
      <meshStandardMaterial color="#fbf7ec" />
    </mesh>
  );
}

/** Mini synthesizer keyboard with auto-playing keys + knobs. */
export function Synth3D() {
  const keys = Array.from({ length: 12 });
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.8}>
      <group rotation={[0.5, -0.3, 0]} scale={1.1}>
        {/* chassis */}
        <RoundedBox args={[3.6, 0.5, 2.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#1a43e0" roughness={0.4} />
        </RoundedBox>
        {/* control panel */}
        <mesh position={[0, 0.26, -0.7]}>
          <boxGeometry args={[3.4, 0.04, 0.7]} />
          <meshStandardMaterial color="#14181f" />
        </mesh>
        {/* knobs */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
          <mesh key={x} position={[x, 0.34, -0.7]} rotation={[Math.PI / 2, i, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
            <meshStandardMaterial color={i % 2 ? "#ffd23f" : "#ff5a45"} />
          </mesh>
        ))}
        {/* keys */}
        <group position={[0, 0.28, 0]}>
          {keys.map((_, i) => (
            <Key key={i} x={(i - keys.length / 2) * 0.26 + 0.13} delay={i * 0.5} />
          ))}
        </group>
      </group>
    </Float>
  );
}
