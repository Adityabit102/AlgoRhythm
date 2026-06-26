import { cn } from "@/lib/cn";

/** Film-grain overlay. Place inside a `relative` container. */
export function GrainOverlay({ className }: { className?: string }) {
  return <div aria-hidden className={cn("grain absolute inset-0", className)} />;
}

/** Soft dotted / Memphis noise background panel. */
export function NoiseBg({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage:
          "radial-gradient(var(--color-ink) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        backgroundPosition: "-11px -11px",
      }}
    >
      {children}
    </div>
  );
}
