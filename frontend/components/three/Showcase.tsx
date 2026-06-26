"use client";

import dynamic from "next/dynamic";
import type { SceneName } from "./R3FShowcase";
import { cn } from "@/lib/cn";

/** Client-only loader for the 3D showcase — Three.js never runs during SSR. */
const R3FShowcase = dynamic(() => import("./R3FShowcase"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin-slow rounded-full border-2 border-ink border-t-cobalt" />
    </div>
  ),
});

export type { SceneName };

export function Showcase({
  name,
  className,
  controls,
  autoRotate,
  intensity,
}: {
  name: SceneName;
  className?: string;
  controls?: boolean;
  autoRotate?: boolean;
  intensity?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      <R3FShowcase
        name={name}
        className="h-full w-full"
        controls={controls}
        autoRotate={autoRotate}
        intensity={intensity}
      />
    </div>
  );
}
