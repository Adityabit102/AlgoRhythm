# AlgoRhythm — Design System

> Aesthetic: **Retro-90s / Y2K Memphis** meets editorial music-tech. Bright, nostalgic,
> tactile, and unmistakably about *music*. Reference DNA: Decathlon Yestalgia (vibrant
> nostalgia, ghettoblasters/cassettes/vinyl), Voyeur Verite (cinematic 3D motion),
> ElevenLabs Store (clean product-grade 3D), Collusion (bold editorial commerce).

---

## 1. Color Palette

Derived from the attached retro-computer illustration + Decathlon Yestalgia.

| Token | Hex | Role |
|---|---|---|
| `ink` | `#14181F` | Primary text, outlines (the "marker" black) |
| `cobalt` | `#1A43E0` | Primary brand blue — backgrounds, hero |
| `electric` | `#2D5BFF` | Interactive / hover blue, glows |
| `gold` | `#FFD23F` | Highlight, CTA accents, "HIT" verdict |
| `coral` | `#FF5A45` | Energy accent, "MISS" verdict, alerts |
| `mint` | `#8FE3C8` | Secondary surfaces, calm panels |
| `mintDeep` | `#5FC9AB` | Mint hover/active |
| `cream` | `#FBF7EC` | Default light background / paper |
| `cloud` | `#FFFFFF` | Card surfaces |

### Semantic mapping
- **HIT verdict:** `gold` fill on `ink` text
- **MISS verdict:** `coral`
- **BORDERLINE:** `mint`
- **SHAP positive bars:** `mint` → `mintDeep`
- **SHAP negative bars:** `coral`
- **Probability arc:** `cobalt` → `electric` → `gold` gradient

### Surfaces
- App default: `cream`. Hero & immersive sections: `cobalt`. Cards: `cloud` with 2px `ink` border + hard offset shadow (Memphis style).

---

## 2. Typography

- **Display / Headlines:** a heavy grotesque (e.g. `Clash Display` / `General Sans` / `Space Grotesk`). Tight tracking, huge editorial sizes.
- **Body:** `Inter` or `General Sans` regular.
- **Mono / data:** `Space Mono` / `JetBrains Mono` for feature values, SHAP numbers, model version.
- Loaded via `next/font` (self-hosted, zero layout shift).

Scale (rem): `12, 14, 16, 18, 20, 24, 32, 44, 64, 88, 120`.

---

## 3. Motion & Shape Language

- **Borders:** 2px solid `ink` on cards/buttons. Memphis hard-offset shadow (`6px 6px 0 ink`).
- **Radii:** mix — pill buttons (`9999px`), soft cards (`20px`), some sharp blocks (`0`).
- **Stickers/shapes:** floating Memphis squiggles, half-circles, zigzags, stars as decorative SVG.
- **Framer Motion:** page transitions (curtain wipe), card reveals (spring up + slight rotate), magnetic buttons, scroll-linked parallax.
- **Grain/noise** overlay on immersive sections for tactile retro feel.

---

## 4. 3D Component Library (React Three Fiber)

Every page gets at least one signature 3D element. Built reusable in `components/three/`.

| Component | Where | Description |
|---|---|---|
| `VinylRecord` | Home hero | Spinning record on a turntable, tonearm, reacts to mouse |
| `AudioWaveMesh` | Home hero / loading | Bars/ribbon driven by a sine field, animated |
| `FloatingNotes` | Global ambient | Music note glyphs floating with `Float` |
| `Cassette3D` | Compare / about | Rotating cassette tape, reels spin |
| `Boombox3D` | Insights / atlas | Retro ghettoblaster, speakers pulse |
| `Synth3D` / `Keys3D` | Explore | Mini synthesizer keyboard, keys depress |
| `Headphones3D` | About / loading | Floating headphones |
| `EqualizerBars3D` | Prediction | 3D EQ bars that animate to probability |
| `GlobeHits3D` | Atlas | Stylized globe with glowing region hot-spots |
| `DiscoBall3D` | Footer / CTA | Faceted reflective sphere |

Shared: `Scene` wrapper (Canvas + lights + Environment), `Stage` controls, perf guards (`<Suspense>`, `dpr` clamp, `frameloop` on-demand where static).

---

## 5. Component Inventory (UI)

Buttons (pill + magnetic), Badge (verdict), TrackCard, StickerShape, MarqueeStrip,
GrainOverlay, SectionHeading, StatCallout, InsightTeaserCard, RegionPill, Spinner
(vinyl-spin), Tooltip, NoiseBg, CursorGlow.

---

*DESIGN_SYSTEM version 1.0 — palette locked from reference image + Yestalgia.*
