"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
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

        <Link
          href="/predict"
          className="rounded-full border-2 border-ink bg-gold px-4 py-1.5 text-sm font-display font-semibold shadow-[var(--shadow-pop-sm)] transition-shadow hover:shadow-[var(--shadow-pop)]"
        >
          Analyze a track
        </Link>
      </nav>
    </header>
  );
}
