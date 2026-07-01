"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/predict", label: "Predict" },
  { href: "/compare", label: "Compare" },
  { href: "/atlas", label: "Atlas" },
  { href: "/explore", label: "Explore" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-ink text-cream transition-transform group-hover:rotate-180">
            <span className="block h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Algo<span className="text-cobalt">Rhythm</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-ink text-cream" : "hover:bg-mint/40",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/predict"
            className="rounded-full border-2 border-ink bg-gold px-3 py-1.5 text-sm font-display font-semibold shadow-[var(--shadow-pop-sm)] transition-shadow hover:shadow-[var(--shadow-pop)] sm:px-4"
          >
            <span className="sm:hidden">Analyze</span>
            <span className="hidden sm:inline">Analyze a track</span>
          </Link>
          {/* mobile menu toggle */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-cream md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-4 bg-ink transition-transform",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-4 bg-ink transition-opacity",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-4 bg-ink transition-transform",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-ink bg-cream md:hidden"
          >
            <div className="flex flex-col p-3">
              {LINKS.map((l) => {
                const active = path === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 font-display font-semibold transition-colors",
                      active ? "bg-ink text-cream" : "hover:bg-mint/40",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
