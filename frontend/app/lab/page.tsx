"use client";

import { Showcase, type SceneName } from "@/components/three/Showcase";
import { Navbar } from "@/components/ui/Navbar";

const SCENES: { name: SceneName; label: string }[] = [
  { name: "vinyl", label: "Vinyl Record" },
  { name: "wave", label: "Audio Wave Mesh" },
  { name: "notes", label: "Floating Notes" },
  { name: "cassette", label: "Cassette" },
  { name: "boombox", label: "Boombox" },
  { name: "synth", label: "Synth" },
  { name: "headphones", label: "Headphones" },
  { name: "eq", label: "Equalizer Bars" },
  { name: "globe", label: "Globe Hits" },
  { name: "disco", label: "Disco Ball" },
];

/** Internal 3D smoke-test gallery. */
export default function Lab() {
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((s) => (
          <div key={s.name} className="pop-card overflow-hidden">
            <div className="border-b-2 border-ink bg-cobalt px-4 py-2 font-mono text-sm text-cream">
              {s.label}
            </div>
            <Showcase name={s.name} className="h-64 bg-cream" controls />
          </div>
        ))}
      </main>
    </>
  );
}
