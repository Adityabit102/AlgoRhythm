"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import type { ReactNode } from "react";

/** Reusable Canvas wrapper: lights, Suspense, perf-clamped DPR, optional controls.
 *  Self-contained (no external HDR) so it works offline and loads fast.
 *
 *  Always load this via `next/dynamic(..., { ssr: false })` from pages so Three.js
 *  never runs during SSR. */
export function Scene({
  children,
  className,
  cameraPosition = [0, 0, 6],
  fov = 45,
  controls = false,
  autoRotate = false,
}: {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  controls?: boolean;
  autoRotate?: boolean;
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#2d5bff" />
        <pointLight position={[0, 3, 4]} intensity={30} color="#ffd23f" />
        <Suspense fallback={null}>{children}</Suspense>
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
