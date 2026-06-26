"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "coral" | "mint" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-cobalt text-cream",
  gold: "bg-gold text-ink",
  coral: "bg-coral text-cream",
  mint: "bg-mint text-ink",
  ghost: "bg-transparent text-ink",
};

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

/** Magnetic, Memphis hard-shadow pill button. Renders <a> when href is set. */
export function Button({
  variant = "primary",
  className,
  children,
  href,
  onClick,
  type = "button",
  disabled,
}: BaseProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function magnet(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.25,
    });
  }

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={magnet}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full pop-border px-6 py-3",
        "font-display font-semibold shadow-[var(--shadow-pop-sm)]",
        "transition-shadow hover:shadow-[var(--shadow-pop)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {inner}
    </button>
  );
}
