"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/** A 2D vinyl record that spins clockwise on its own, and that you can grab and
 *  scrub by dragging — release and it keeps the momentum, easing back to its
 *  steady spin. Pure SVG + rAF, so it always renders (no WebGL framing issues). */
export function VinylRecord2D({
  className,
  size = 420,
}: {
  className?: string;
  size?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const rot = useRef(0);
  const vel = useRef(0.55); // deg/frame steady spin (clockwise)
  const dragging = useRef(false);
  const lastAngle = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = reduce ? 0 : 0.55;
    vel.current = base;
    let raf = 0;
    const tick = () => {
      if (!dragging.current) {
        rot.current += vel.current;
        vel.current += (base - vel.current) * 0.04; // ease back to steady spin
      }
      if (disc.current) disc.current.style.transform = `rotate(${rot.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function angleAt(e: PointerEvent | React.PointerEvent) {
    const r = wrap.current!.getBoundingClientRect();
    return (
      (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) *
        180) /
      Math.PI
    );
  }

  function onDown(e: React.PointerEvent) {
    dragging.current = true;
    lastAngle.current = angleAt(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const a = angleAt(e);
    let d = a - lastAngle.current;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    rot.current += d;
    vel.current = d; // carry momentum on release
    lastAngle.current = a;
  }
  function onUp() {
    dragging.current = false;
  }

  const grooves = Array.from({ length: 26 }, (_, i) => 70 + i * 4.4);

  return (
    <div
      ref={wrap}
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
    >
      {/* spinning disc */}
      <div
        ref={disc}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ willChange: "transform" }}
      >
        <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[6px_6px_0_rgba(20,24,31,1)]">
          <defs>
            <radialGradient id="vinylSheen" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#3a3a47" />
              <stop offset="30%" stopColor="#15151c" />
              <stop offset="100%" stopColor="#0a0a0f" />
            </radialGradient>
          </defs>

          {/* body */}
          <circle cx="200" cy="200" r="192" fill="url(#vinylSheen)" stroke="#14181f" strokeWidth="4" />

          {/* grooves */}
          {grooves.map((r, i) => (
            <circle
              key={i}
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke={i % 6 === 0 ? "#2d5bff" : "#26262f"}
              strokeWidth={i % 6 === 0 ? 1.4 : 1}
              opacity={i % 6 === 0 ? 0.7 : 0.5}
            />
          ))}
          {/* one bright catch-light groove */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="#8fe3c8" strokeWidth="2" opacity="0.55" />

          {/* label */}
          <circle cx="200" cy="200" r="66" fill="#ff5a45" stroke="#14181f" strokeWidth="3" />
          <circle cx="200" cy="200" r="40" fill="none" stroke="#ffd23f" strokeWidth="4" />
          {/* label tick so the spin is obvious */}
          <circle cx="200" cy="148" r="6" fill="#ffd23f" />
          <circle cx="200" cy="200" r="9" fill="#fbf7ec" stroke="#14181f" strokeWidth="2" />
        </svg>
      </div>

      {/* tonearm (static, sits over the disc) */}
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g transform="translate(330 70)">
          <circle cx="0" cy="0" r="20" fill="#8fe3c8" stroke="#14181f" strokeWidth="3" />
          <line x1="0" y1="0" x2="-150" y2="150" stroke="#14181f" strokeWidth="10" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-150" y2="150" stroke="#e9e9ee" strokeWidth="6" strokeLinecap="round" />
          <rect x="-162" y="142" width="26" height="16" rx="3" fill="#14181f" transform="rotate(45 -150 150)" />
        </g>
      </svg>

      <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-ink/40">
        drag to scrub
      </span>
    </div>
  );
}
