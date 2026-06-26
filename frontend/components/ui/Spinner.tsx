import { cn } from "@/lib/cn";

/** Spinning-vinyl loader. */
export function Spinner({
  size = 48,
  className,
  label,
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="animate-spin-slow"
        role="status"
        aria-label={label ?? "Loading"}
      >
        <circle cx="50" cy="50" r="48" fill="#14181f" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#2d5bff" strokeWidth="1" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#2d5bff" strokeWidth="1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#2d5bff" strokeWidth="1" />
        <circle cx="50" cy="50" r="12" fill="#ff5a45" />
        <circle cx="50" cy="50" r="3" fill="#fbf7ec" />
        <rect x="49" y="2" width="2" height="20" fill="#ffd23f" />
      </svg>
      {label && <span className="font-mono text-xs text-ink/60">{label}</span>}
    </div>
  );
}
