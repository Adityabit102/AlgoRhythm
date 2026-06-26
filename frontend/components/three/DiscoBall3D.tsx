"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const FACET_COLORS = ["#8fe3c8", "#ffd23f", "#ff5a45", "#2d5bff", "#fbf7ec"];

/** Faceted reflective disco ball that slowly spins. */
export function DiscoBall3D({ radius = 1.6 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  // Distribute facet tiles over a sphere via a fibonacci lattice.
  const facets = useMemo(() => {
    const n = 180;
    const pts: { pos: THREE.Vector3; color: string }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({
        pos: new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r,
        ).multiplyScalar(radius),
        color: FACET_COLORS[i % FACET_COLORS.length],
      });
    }
    return pts;
  }, [radius]);

  useFrame((_, dt) => {
    if (group.current && !reduced) group.current.rotation.y += dt * 0.4;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[radius * 0.97, 32, 32]} />
        <meshStandardMaterial color="#14181f" metalness={0.9} roughness={0.2} />
      </mesh>
      {facets.map((f, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          f.pos.clone().normalize(),
        );
        return (
          <mesh key={i} position={f.pos} quaternion={q}>
            <planeGeometry args={[0.28, 0.28]} />
            <meshStandardMaterial
              color={f.color}
              metalness={0.8}
              roughness={0.15}
              emissive={f.color}
              emissiveIntensity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
