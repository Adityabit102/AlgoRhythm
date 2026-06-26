import { cn } from "@/lib/cn";
import type { Verdict } from "@/lib/types";

const VERDICT_STYLES: Record<Verdict, { bg: string; label: string }> = {
  hit: { bg: "bg-gold text-ink", label: "HIT" },
  borderline: { bg: "bg-mint text-ink", label: "BORDERLINE" },
  miss: { bg: "bg-coral text-cream", label: "MISS" },
};

export function VerdictBadge({
  verdict,
  className,
}: {
  verdict: Verdict;
  className?: string;
}) {
  const s = VERDICT_STYLES[verdict];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full pop-border px-5 py-2",
        "font-display text-lg font-bold tracking-wide shadow-[var(--shadow-pop-sm)]",
        s.bg,
        className,
      )}
    >
      {s.label}
    </span>
  );
}

export function Badge({
  children,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "cobalt" | "gold" | "coral" | "mint";
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink text-cream",
    cobalt: "bg-cobalt text-cream",
    gold: "bg-gold text-ink",
    coral: "bg-coral text-cream",
    mint: "bg-mint text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
