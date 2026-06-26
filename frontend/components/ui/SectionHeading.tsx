import { cn } from "@/lib/cn";

/** Editorial section heading with an index number + kicker. */
export function SectionHeading({
  kicker,
  title,
  index,
  className,
  align = "left",
}: {
  kicker?: string;
  title: React.ReactNode;
  index?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="font-mono text-sm text-cobalt">{index}</span>
        )}
        {kicker && (
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink/60">
            {kicker}
          </span>
        )}
      </div>
      <h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
