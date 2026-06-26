import { cn } from "@/lib/cn";

/** Infinite horizontal scrolling text strip. CSS-animated (pauses on reduced-motion). */
export function MarqueeStrip({
  text = "THE SCIENCE BEHIND EVERY HIT",
  className,
  tone = "ink",
  separator = "✦",
}: {
  text?: string;
  className?: string;
  tone?: "ink" | "gold" | "cobalt" | "coral";
  separator?: string;
}) {
  const tones: Record<string, string> = {
    ink: "bg-ink text-cream",
    gold: "bg-gold text-ink",
    cobalt: "bg-cobalt text-cream",
    coral: "bg-coral text-cream",
  };
  const item = (
    <span className="mx-6 inline-flex items-center gap-6 font-display text-lg font-semibold uppercase tracking-[0.2em]">
      {text} <span className="opacity-60">{separator}</span>
    </span>
  );
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden border-y-2 border-ink py-3",
        tones[tone],
        className,
      )}
    >
      <div className="flex shrink-0 animate-marquee whitespace-nowrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
      <div className="flex shrink-0 animate-marquee whitespace-nowrap" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
