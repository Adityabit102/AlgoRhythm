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
import { GLBModel, ModelBoundary } from "./Model3D";

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

/** Optional .glb override per scene. When a file exists in /public/models it is
 *  used (studio-quality); otherwise the hand-built primitive renders instead.
 *  Drop in vinyl.glb / cassette.glb / synth.glb / headphones.glb to upgrade those. */
const GLB: Partial<
  Record<SceneName, { url: string; rotation?: [number, number, number] }>
> = {
  boombox: { url: "/models/boombox.glb", rotation: [0.1, -0.5, 0] },
  cassette: { url: "/models/cassette.glb", rotation: [0.2, -0.4, 0] },
  headphones: { url: "/models/headphones.glb", rotation: [0.1, 0.4, 0] },
  synth: { url: "/models/synth.glb", rotation: [0.3, -0.4, 0] },
  vinyl: { url: "/models/vinyl.glb", rotation: [0.2, -0.3, 0] },
};

function Primitive({ name, intensity }: { name: SceneName; intensity?: number }) {
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

function SceneBody({ name, intensity }: { name: SceneName; intensity?: number }) {
  const glb = GLB[name];
  const primitive = <Primitive name={name} intensity={intensity} />;
  if (!glb) return primitive;
  // Try the GLB; if the file is missing/broken, fall back to the primitive.
  return (
    <ModelBoundary fallback={primitive}>
      <GLBModel url={glb.url} rotation={glb.rotation} />
    </ModelBoundary>
  );
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
