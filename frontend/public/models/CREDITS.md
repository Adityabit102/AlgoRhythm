# 3D Model Credits

The `.glb` music models are sourced from [Poly Pizza](https://poly.pizza) (free low-poly
models). Most are CC-BY — keep this attribution. Verify each model's exact license on its
page before commercial use.

| File | Source page |
|---|---|
| `boombox.glb` | https://poly.pizza/m/2EoVJxENrHT |
| `cassette.glb` | https://poly.pizza/m/4uUIxYk-p4e (Poly by Google) |
| `headphones.glb` | https://poly.pizza/m/PSsWSIAYIL (CreativeTrio) |
| `synth.glb` | https://poly.pizza/m/155LOgjwUy2 |
| `vinyl.glb` | https://poly.pizza/m/0PvHZr0lJp_ |

## How the model pipeline works

`components/three/Model3D.tsx` loads any `.glb`, auto-centers and auto-scales it, and
`components/three/R3FShowcase.tsx` maps each scene name to a model in the `GLB` registry.
If a file is missing or fails to load, the scene falls back to the hand-built primitive
(no crash). To replace or add a model: drop a `.glb` here and point the registry at it.
Tweak per-model `rotation` in that registry if a model faces the wrong way.
