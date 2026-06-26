"use client";

import { Scene } from "./Scene";
import { VinylRecord } from "./VinylRecord";
import { AudioWaveMesh } from "./AudioWaveMesh";
import { FloatingNotes } from "./FloatingNotes";
import { Cassette3D } from "./Cassette3D";
import { Boombox3D } from "./Boombox3D";
import { Synth3D } from "./Synth3D";
import { Headphones3D } from "./Headphones3D";
import { EqualizerBars3D } from "./EqualizerBars3D";
import { GlobeHits3D } from "./GlobeHits3D";
import { DiscoBall3D } from "./DiscoBall3D";

export type SceneName =
  | "vinyl"
  | "wave"
  | "notes"
  | "cassette"
  | "boombox"
  | "synth"
  | "headphones"
  | "eq"
  | "globe"
  | "disco";

const CAMERA: Partial<Record<SceneName, [number, number, number]>> = {
  wave: [0, 4, 9],
  notes: [0, 0, 10],
  eq: [0, 1, 8],
  globe: [0, 0, 6],
};

const FOV: Partial<Record<SceneName, number>> = { notes: 50 };

function SceneBody({ name, intensity }: { name: SceneName; intensity?: number }) {
  switch (name) {
    case "vinyl":
      return <VinylRecord />;
    case "wave":
      return <AudioWaveMesh />;
    case "notes":
      return <FloatingNotes />;
    case "cassette":
      return <Cassette3D />;
    case "boombox":
      return <Boombox3D />;
    case "synth":
      return <Synth3D />;
    case "headphones":
      return <Headphones3D />;
    case "eq":
      return <EqualizerBars3D intensity={intensity ?? 0.5} />;
    case "globe":
      return <GlobeHits3D />;
    case "disco":
      return <DiscoBall3D />;
  }
}

/** Renders a named scene inside the shared Canvas. Import via Showcase (ssr:false). */
export default function R3FShowcase({
  name,
  className,
  controls = false,
  autoRotate = false,
  intensity,
}: {
  name: SceneName;
  className?: string;
  controls?: boolean;
  autoRotate?: boolean;
  intensity?: number;
}) {
  return (
    <Scene
      className={className}
      controls={controls}
      autoRotate={autoRotate}
      cameraPosition={CAMERA[name]}
      fov={FOV[name]}
    >
      <SceneBody name={name} intensity={intensity} />
    </Scene>
  );
}
