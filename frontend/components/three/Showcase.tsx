"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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

/** Each 3D scene mounts its WebGL canvas only once it scrolls near the viewport,
 *  so a page never runs more live contexts than it's actually showing (big perf
 *  win on the 3D-heavy pages). Set `eager` to mount immediately. */
export function Showcase({
  name,
  className,
  controls,
  autoRotate,
  intensity,
  eager = false,
}: {
  name: SceneName;
  className?: string;
  controls?: boolean;
  autoRotate?: boolean;
  intensity?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || visible || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [eager, visible]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {visible && (
        <R3FShowcase
          name={name}
          className="h-full w-full"
          controls={controls}
          autoRotate={autoRotate}
          intensity={intensity}
        />
      )}
    </div>
  );
}
