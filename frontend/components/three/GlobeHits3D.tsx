"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** Convert lat/lng to a point on a sphere of the given radius. */
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

const HOTSPOTS: { lat: number; lng: number; color: string }[] = [
  { lat: 40, lng: -100, color: "#ffd23f" }, // US
  { lat: 22, lng: 78, color: "#ff5a45" }, // India
  { lat: 54, lng: -2, color: "#8fe3c8" }, // UK
  { lat: -15, lng: -55, color: "#ff5a45" }, // Latin
  { lat: 37, lng: 127, color: "#2d5bff" }, // K-Pop
  { lat: 9, lng: 8, color: "#ffd23f" }, // Afrobeats
];

/** Stylized wireframe globe with glowing regional hit hotspots. */
export function GlobeHits3D({ radius = 2 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  useFrame((_, dt) => {
    if (group.current && !reduced) group.current.rotation.y += dt * 0.15;
  });
  return (
    <group ref={group} rotation={[0.3, 0, 0]}>
      {/* core */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial color="#1a43e0" roughness={0.6} />
      </mesh>
      {/* wireframe overlay */}
      <mesh scale={1.01}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial color="#2d5bff" wireframe transparent opacity={0.35} />
      </mesh>
      {/* hotspots */}
      {HOTSPOTS.map((h, i) => {
        const p = latLngToVec3(h.lat, h.lng, radius * 1.02);
        return (
          <group key={i} position={p}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={h.color}
                emissive={h.color}
                emissiveIntensity={0.8}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color={h.color} transparent opacity={0.25} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
