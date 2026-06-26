"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { Suspense } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

/** Reusable Canvas wrapper. A studio Environment (built from Lightformers, so no
 *  network HDR), soft contact shadows and filmic tone mapping give every object a
 *  polished, reflective, "rendered" look rather than flat primitives.
 *
 *  Always load via `next/dynamic(..., {ssr:false})` so Three never runs during SSR. */
export function Scene({
  children,
  className,
  cameraPosition = [0, 0, 6],
  fov = 45,
  controls = false,
  autoRotate = false,
  shadows = true,
}: {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  controls?: boolean;
  autoRotate?: boolean;
  shadows?: boolean;
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 8, 6]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-6, 2, -4]} intensity={0.5} color="#2d5bff" />
        <Suspense fallback={null}>
          {children}
          {shadows && (
            <ContactShadows
              position={[0, -1.7, 0]}
              opacity={0.35}
              scale={12}
              blur={2.6}
              far={4}
            />
          )}
          {/* Studio reflections — pure Lightformers, no external HDR file. */}
          <Environment resolution={256}>
            <Lightformer intensity={3} position={[0, 4, 3]} scale={[8, 4, 1]} />
            <Lightformer intensity={1.4} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#8fe3c8" />
            <Lightformer intensity={1.4} position={[4, 1, 2]} scale={[3, 6, 1]} color="#ffd23f" />
            <Lightformer intensity={1} position={[0, -3, 2]} scale={[8, 3, 1]} color="#2d5bff" />
          </Environment>
        </Suspense>
        {controls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        )}
      </Canvas>
    </div>
  );
}
