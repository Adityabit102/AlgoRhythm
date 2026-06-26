# AlgoRhythm — Atomic Build Checklist

> Every task is **atomic**: self-contained, no internal dependencies, completable in isolation.
> After each **Phase**, run the phase's "✅ Verify" gate (build / typecheck / lint) and fix
> all errors before moving on. Folder structure follows `TECHSTACK.md §9`.
>
> Legend: `[ ]` todo · `[~]` in progress · `[x]` done · 🧑 = needs you (keys/data/AWS).

---

## PHASE 0 — Repo & Tooling Scaffold

- [ ] 0.1 Create monorepo root folders: `ml/`, `backend/`, `frontend/`, `infra/`
- [ ] 0.2 Add root `README.md` with project summary + run instructions
- [ ] 0.3 Add root `.gitignore` (node_modules, .next, __pycache__, .env, ml/data/raw, *.pkl)
- [ ] 0.4 `git init` + initial commit
- [ ] 0.5 Add root `.editorconfig` (2-space TS, 4-space Python)
- [ ] 0.6 Add `.nvmrc` pinning Node 22
- ✅ **Verify P0:** folders exist, `git status` clean baseline.

---

## PHASE 1 — Frontend Scaffold & Design Foundation

- [ ] 1.1 Scaffold Next.js 14 App Router + TypeScript + Tailwind in `frontend/`
- [ ] 1.2 Install deps: three, @react-three/fiber, @react-three/drei, framer-motion, recharts, d3, react-simple-maps, @tanstack/react-query, zustand, axios, clsx, date-fns, lottie-react, html2canvas, jspdf
- [ ] 1.3 Configure `tailwind.config.ts` design tokens (palette, fonts, shadows) from DESIGN_SYSTEM.md
- [ ] 1.4 Add global CSS: CSS vars for palette, base reset, grain/noise utility, scrollbar
- [ ] 1.5 Wire `next/font` self-hosted fonts (display grotesque + Inter + mono)
- [ ] 1.6 Create `lib/types.ts` — TS types mirroring the `/predict` response schema (PRD §4.7)
- [ ] 1.7 Create `lib/api.ts` — typed axios client pointing at `NEXT_PUBLIC_API_URL`
- [ ] 1.8 Create `lib/store.ts` — Zustand stores (region filter, compare tracks, recent history)
- [ ] 1.9 Create `lib/mock.ts` — mock prediction payloads so frontend works before backend exists
- [ ] 1.10 Add `.env.local` + `.env.example` with `NEXT_PUBLIC_API_URL`
- [ ] 1.11 Set up TanStack Query provider + React root providers in `app/providers.tsx`
- ✅ **Verify P1:** `npm run build` passes, `npm run dev` serves blank styled page.

---

## PHASE 2 — Shared UI Design System Components (`components/ui/`)

- [ ] 2.1 `Button.tsx` — pill + magnetic hover (Memphis hard-shadow variants)
- [ ] 2.2 `Badge.tsx` — verdict badge (HIT/MISS/BORDERLINE color logic)
- [ ] 2.3 `TrackCard.tsx` — album art, name, artist, release, duration
- [ ] 2.4 `StickerShape.tsx` — decorative Memphis SVG shapes (squiggle/star/zigzag/half-circle)
- [ ] 2.5 `MarqueeStrip.tsx` — infinite scrolling text strip (Framer Motion)
- [ ] 2.6 `GrainOverlay.tsx` + `NoiseBg.tsx` — tactile retro overlays
- [ ] 2.7 `SectionHeading.tsx` — editorial heading with kicker + index number
- [ ] 2.8 `StatCallout.tsx` — big number + label callout
- [ ] 2.9 `RegionPill.tsx` — region selector pill group (Global/US/India/Latin/K-Pop/Afrobeats/UK/EDM)
- [ ] 2.10 `Spinner.tsx` — spinning-vinyl loader
- [ ] 2.11 `Tooltip.tsx` — hover tooltip primitive
- [ ] 2.12 `CursorGlow.tsx` — custom cursor glow follower
- [ ] 2.13 `Navbar.tsx` — sticky nav across all routes
- [ ] 2.14 `Footer.tsx` — footer with disco-ball 3D + links
- ✅ **Verify P2:** Storybook-free smoke page renders all UI components; build passes.

---

## PHASE 3 — 3D Component Library (`components/three/`)

- [ ] 3.1 `Scene.tsx` — reusable Canvas wrapper (lights, Environment, Suspense, dpr clamp)
- [ ] 3.2 `VinylRecord.tsx` — spinning record + tonearm, mouse-reactive
- [ ] 3.3 `AudioWaveMesh.tsx` — sine-driven waveform ribbon/bars
- [ ] 3.4 `FloatingNotes.tsx` — floating music-note glyphs (instanced + Float)
- [ ] 3.5 `Cassette3D.tsx` — cassette with spinning reels
- [ ] 3.6 `Boombox3D.tsx` — ghettoblaster, pulsing speakers
- [ ] 3.7 `Synth3D.tsx` — mini synth keyboard, key-press animation
- [ ] 3.8 `Headphones3D.tsx` — floating headphones
- [ ] 3.9 `EqualizerBars3D.tsx` — 3D EQ bars driven by a value prop
- [ ] 3.10 `GlobeHits3D.tsx` — stylized globe with glowing region hotspots
- [ ] 3.11 `DiscoBall3D.tsx` — faceted reflective sphere
- [ ] 3.12 Add perf guards + reduced-motion fallback (static image) for each scene
- ✅ **Verify P3:** each 3D component mounts on a test route without console errors; build passes.

---

## PHASE 4 — Home / Hero Page (`app/page.tsx`)

- [ ] 4.1 Hero section: 3D `VinylRecord`/`AudioWaveMesh` + editorial headline
- [ ] 4.2 `SearchInput.tsx` — centered Spotify URL input, primary CTA, validation
- [ ] 4.3 Region selector pill row wired to Zustand store
- [ ] 4.4 Three animated "insight teaser" cards (Friday effect / danceability floor / collabs)
- [ ] 4.5 Recent predictions feed (reads from localStorage history store)
- [ ] 4.6 Scroll parallax + Memphis sticker shapes layer
- [ ] 4.7 Marquee strip ("THE SCIENCE BEHIND EVERY HIT")
- [ ] 4.8 Page entry transition (Framer Motion)
- ✅ **Verify P4:** home renders, search routes to `/predict?track=...`, build passes.

---

## PHASE 5 — Prediction Result Page (`app/predict/`)

- [ ] 5.1 Route reads `?track=` param, fetches via TanStack Query (mock fallback)
- [ ] 5.2 `PredictionCard.tsx` — track card + verdict badge composition
- [ ] 5.3 `ProbabilityArc.tsx` — custom animated SVG arc meter 0–100%
- [ ] 5.4 `ShapWaterfall.tsx` — custom animated SHAP waterfall (Recharts/SVG), green/red bars, hover tooltips, grow-from-base animation
- [ ] 5.5 `RegionalScores.tsx` — horizontal bars per region
- [ ] 5.6 Feature spotlight cards — top-3 features with human-readable explanations
- [ ] 5.7 `SimilarHits.tsx` — album-art grid of 5 similar real hits
- [ ] 5.8 `SensitivitySliders.tsx` — "what would change this?" toggles re-scoring locally
- [ ] 5.9 `EqualizerBars3D` accent reacting to probability
- [ ] 5.10 Share card generator (`html2canvas` → downloadable OG image)
- [ ] 5.11 Loading state (vinyl spinner + skeleton), error state
- [ ] 5.12 Persist prediction to localStorage recent history
- ✅ **Verify P5:** full mock prediction renders end-to-end with animations; build passes.

---

## PHASE 6 — Compare Page (`app/compare/`)

- [ ] 6.1 Up to 3 `TrackInput.tsx` side-by-side
- [ ] 6.2 `RadarComparison.tsx` — radar chart of audio feature profiles
- [ ] 6.3 Side-by-side probability bars
- [ ] 6.4 SHAP delta view (what B has that A doesn't)
- [ ] 6.5 "Hit gap" feature-distance analysis
- [ ] 6.6 `Cassette3D` decorative accent
- ✅ **Verify P6:** compare renders with 3 mock tracks; build passes.

---

## PHASE 7 — Global Hit Atlas Page (`app/atlas/`)

- [ ] 7.1 `WorldMap.tsx` — react-simple-maps base with region highlighting
- [ ] 7.2 `GlobeHits3D` hero accent
- [ ] 7.3 `RegionPanel.tsx` — click region → top features, hit rate by genre, tempo range
- [ ] 7.4 Regional feature-fingerprint radar
- [ ] 7.5 "Regional divergence" highlight callouts
- ✅ **Verify P7:** map renders, region click updates panel; build passes.

---

## PHASE 8 — Feature Explorer Page (`app/explore/`)

- [ ] 8.1 `FeatureCharts.tsx` — danceability dist, tempo histogram, valence-vs-hit scatter, genre-era heatmap (Recharts/D3)
- [ ] 8.2 Filters: era / genre / region (animated on change)
- [ ] 8.3 `Synth3D` decorative accent
- [ ] 8.4 Mock EDA dataset in `lib/edaMock.ts`
- ✅ **Verify P8:** charts render + filter live; build passes.

---

## PHASE 9 — Insights Report Page (`app/insights/`)

- [ ] 9.1 Long-form editorial layout (magazine style)
- [ ] 9.2 12 EDA story-beat sections (PRD §4.5) — finding + chart + stat callout each
- [ ] 9.3 `Boombox3D` section accent + scroll-reveal animations
- [ ] 9.4 Sticky section nav / progress
- ✅ **Verify P9:** all 12 sections render; build passes.

---

## PHASE 10 — About / Model Card Page (`app/about/`)

- [ ] 10.1 Model card: data range, sources, features, biases, limitations, metrics, version history
- [ ] 10.2 Methodology narrative + data-flow diagram
- [ ] 10.3 `Headphones3D` accent
- [ ] 10.4 Link to EDA notebook HTML artifact
- ✅ **Verify P10:** about renders; full `npm run build` of all routes passes; lint clean.

---

## PHASE 11 — Backend Scaffold (`backend/`, FastAPI)

- [ ] 11.1 `requirements.txt` (fastapi, uvicorn, gunicorn, pydantic, spotipy, httpx, boto3, python-dotenv, slowapi, xgboost, shap, scikit-learn, joblib, pandas, numpy)
- [ ] 11.2 `core/config.py` — pydantic-settings reading env vars
- [ ] 11.3 `core/middleware.py` — CORS + slowapi rate limiting
- [ ] 11.4 `main.py` — app entrypoint + router registration + lifespan model load
- [ ] 11.5 `schemas/predict.py` + `schemas/track.py` — Pydantic request/response (match PRD schema)
- [ ] 11.6 `services/spotify.py` — Spotipy client (audio features, metadata, artist) 🧑 needs Spotify keys
- [ ] 11.7 `services/s3.py` — boto3 artifact download + in-memory cache 🧑 needs AWS
- [ ] 11.8 `services/model.py` — load XGBoost+SHAP+pipeline, run inference, compute SHAP
- [ ] 11.9 `routers/health.py` — `/health` (model version, uptime, artifact timestamp)
- [ ] 11.10 `routers/predict.py` — `/predict`, `/batch-predict`
- [ ] 11.11 `routers/track.py` — `/track/{id}`
- [ ] 11.12 `routers/insights.py` — `/insights/region/{r}`, `/insights/era/{e}`, `/features/importance`, `/similar-hits`, `/regions`, `/genres`
- [ ] 11.13 Stub model service to return mock data until artifacts exist (env flag `USE_MOCK_MODEL=1`)
- ✅ **Verify P11:** `uvicorn main:app` boots, `/health` + `/predict` (mock) return valid JSON, `/docs` loads.

---

## PHASE 12 — Frontend ↔ Backend Integration

- [ ] 12.1 Point `NEXT_PUBLIC_API_URL` at local backend; swap mock for live calls
- [ ] 12.2 Verify `/predict` round-trip with mock backend renders real waterfall
- [ ] 12.3 Wire `/compare` to `/batch-predict`
- [ ] 12.4 Wire `/atlas` + `/explore` + `/insights` to insight endpoints
- [ ] 12.5 Error/loading/empty states for all live calls
- ✅ **Verify P12:** end-to-end flow works against local backend; both build/boot clean.

---

## PHASE 13 — ML Pipeline (`ml/`) 🧑 guided

- [ ] 13.1 `ml/requirements.txt` + Python 3.11 venv note (XGBoost/SHAP wheels) 🧑
- [ ] 13.2 Data acquisition scripts/notes for Kaggle + Spotify datasets 🧑 needs data
- [ ] 13.3 `notebooks/01_eda.ipynb` — 12 story beats + visualizations
- [ ] 13.4 `notebooks/02_feature_engineering.ipynb`
- [ ] 13.5 `src/features.py` — sklearn-compatible feature pipeline (all 35+ engineered features)
- [ ] 13.6 `notebooks/03_training.ipynb` — XGBoost baseline
- [ ] 13.7 `src/train.py` — training script + Optuna HPO (100+ trials) 🧑 compute
- [ ] 13.8 `src/evaluate.py` — AUC, F1, confusion matrix, calibration, ROC
- [ ] 13.9 `src/shap_analysis.py` — TreeExplainer, summary/beeswarm/bar, export feature_importance.json
- [ ] 13.10 `src/upload_artifacts.py` — boto3 versioned S3 upload 🧑 needs AWS
- [ ] 13.11 Export trained artifacts (model.json, shap_explainer.pkl, feature_pipeline.pkl, encoders, metadata)
- ✅ **Verify P13:** notebooks run top-to-bottom on sample data; artifacts produced locally.

---

## PHASE 14 — AWS Infrastructure (`infra/`) 🧑

- [ ] 14.1 `infra/ec2_setup.sh` — EC2 bootstrap (python, gunicorn, S3 pull on boot)
- [ ] 14.2 `infra/nginx.conf` — reverse proxy + SSL termination
- [ ] 14.3 `infra/algorhythm.service` — systemd unit
- [ ] 14.4 S3 bucket + lifecycle policy doc 🧑 needs AWS account
- [ ] 14.5 IAM role/policy (least privilege, scoped to bucket) 🧑
- [ ] 14.6 Certbot/Let's Encrypt HTTPS steps doc 🧑
- ✅ **Verify P14:** scripts lint (`bash -n`), infra docs complete.

---

## PHASE 15 — Deployment & Polish 🧑

- [ ] 15.1 Deploy frontend to Vercel (env vars set) 🧑
- [ ] 15.2 Deploy backend to EC2 (systemd + nginx + elastic IP) 🧑
- [ ] 15.3 Upload artifacts to S3, point EC2 at them 🧑
- [ ] 15.4 Lighthouse pass ≥ 90 (perf/a11y); fix regressions
- [ ] 15.5 OG/social share meta tags per route
- [ ] 15.6 Final cross-page QA, reduced-motion + mobile responsiveness
- ✅ **Verify P15:** live demo works end-to-end, no localhost, Lighthouse ≥ 90.

---

### Cross-cutting "do once per phase" gate
After **every** phase: run frontend `npm run build` + `tsc --noEmit` + `eslint`, and
backend `python -c "import main"` / `uvicorn` boot, fix all errors before advancing.
