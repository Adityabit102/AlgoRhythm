"use client";

import { useEffect, useState } from "react";

/** A soft glow that trails the cursor. Inert on touch / reduced-motion
 *  (the listener is simply never attached, so it stays parked off-screen). */
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[60] h-72 w-72 rounded-full opacity-30 blur-3xl transition-transform duration-300 ease-out"
      style={{
        left: pos.x - 144,
        top: pos.y - 144,
        background:
          "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)",
      }}
    />
  );
}
