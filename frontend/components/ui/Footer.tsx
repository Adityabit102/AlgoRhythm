import Link from "next/link";
import { MarqueeStrip } from "./MarqueeStrip";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/predict", label: "Predict" },
      { href: "/compare", label: "Compare" },
      { href: "/atlas", label: "Hit Atlas" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/explore", label: "Feature Explorer" },
      { href: "/insights", label: "Insights Report" },
      { href: "/about", label: "Model Card" },
    ],
  },
];

export function Footer({ accent }: { accent?: React.ReactNode }) {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-cobalt text-cream">
      <MarqueeStrip text="ALGORHYTHM · THE SCIENCE BEHIND EVERY HIT" tone="gold" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-2">
          <h3 className="font-display text-3xl font-bold">
            Algo<span className="text-gold">Rhythm</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-cream/85">
            Predicting chart hits from audio DNA, release timing, and artist
            momentum — explained feature by feature.
          </p>
          {accent && <div className="mt-6 h-40">{accent}</div>}
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono text-xs uppercase tracking-widest text-cream/80">
              {c.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-cream/35 px-6 py-5 text-center font-mono text-xs text-cream/80">
        Built by Aditya · XGBoost · SHAP · FastAPI · AWS · Next.js
      </div>
    </footer>
  );
}
