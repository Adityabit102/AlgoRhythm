"use client";

import Link from "next/link";
import { useHistory } from "@/lib/store";
import { VerdictBadge } from "@/components/ui/Badge";
import type { Verdict } from "@/lib/types";

/** Recent predictions, read from localStorage. Shows seed examples when empty. */
const SEED = [
  { id: "seed1", name: "Neon Gravity", artist: "Lumen Drift", verdict: "hit", probability: 0.87 },
  { id: "seed2", name: "Paper Hearts", artist: "Marisol Vega", verdict: "borderline", probability: 0.58 },
  { id: "seed3", name: "Midnight Algorithm", artist: "The Hex Collective", verdict: "miss", probability: 0.34 },
];

export function RecentFeed() {
  const items = useHistory((s) => s.items);
  const rows = items.length ? items : SEED;

  return (
    <div className="pop-card divide-y-2 divide-ink overflow-hidden">
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-cream">
        <span className="font-mono text-xs uppercase tracking-widest">
          Recent predictions
        </span>
        {!items.length && (
          <span className="font-mono text-[10px] text-cream/50">examples</span>
        )}
      </div>
      {rows.slice(0, 6).map((r) => (
        <Link
          key={r.id}
          href={`/predict?track=${r.id}`}
          className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-mint/30"
        >
          <div className="min-w-0">
            <div className="truncate font-display font-semibold">{r.name}</div>
            <div className="truncate text-sm text-ink/60">{r.artist}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">
              {Math.round(r.probability * 100)}%
            </span>
            <VerdictBadge verdict={r.verdict as Verdict} className="scale-75" />
          </div>
        </Link>
      ))}
    </div>
  );
}
