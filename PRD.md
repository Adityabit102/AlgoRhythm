# AlgoRhythm — Product Requirements Document

> **Tagline:** *The science behind every hit.*
> **Scope:** Global music hit prediction using audio features, cultural signals, and release timing — powered by XGBoost + SHAP, served live.

---

## 1. Project Overview

AlgoRhythm is a full-stack ML-powered web application that predicts whether any song on Spotify has the DNA of a global or regional chart hit. Users paste a Spotify track URL, and AlgoRhythm returns a hit probability score alongside a SHAP-powered explanation of *exactly* which audio and contextual features drove that prediction — danceability, energy, release timing, artist momentum, genre era signals, and more.

The project is deliberately engineered to read as a production system: model artifacts versioned on AWS S3, inference served via FastAPI on AWS EC2, frontend on Vercel, with a full EDA + feature engineering notebook as a public research artifact.

---

## 2. Goals

### Primary Goals
- Build and deploy a production-grade XGBoost classifier that predicts hit probability for any Spotify track with interpretable output (SHAP)
- Create a live, custom-designed frontend demo that is visually distinctive and portfolio-ready
- Cover the full ML lifecycle: EDA → feature engineering → model training → hyperparameter optimization → explainability → deployment
- Use AWS S3 + EC2 in a real capacity (artifact storage + inference hosting), not as decoration

### Secondary Goals
- Generate a story-driven insight report from the EDA ("What does the data say actually makes a hit?") that can be shared as a standalone write-up
- Make the SHAP waterfall chart a custom-built frontend component, not a matplotlib screenshot
- Support regional filtering (global, India, US, UK, Latin, K-Pop, Afrobeats) so the model can surface culture-specific hit patterns

---

## 3. Target Audience

| Audience | Use Case |
|---|---|
| Recruiters / Hiring Managers | Portfolio review — demonstrates end-to-end ML + deployment + frontend |
| Music producers / indie artists | Curiosity — "does my track have hit DNA?" |
| Data enthusiasts | Exploration — comparing what makes hits in different regions |
| Interview interviewers | Live demo during technical interviews |

---

## 4. Feature Specifications

### 4.1 Core Feature: Hit Prediction Engine

**Input:** Spotify track URL or track ID
**Output:** Hit probability score (0–100%), confidence band, SHAP feature contribution breakdown

**Prediction pipeline:**
1. User pastes Spotify URL into frontend
2. Frontend sends URL to FastAPI `/predict` endpoint on EC2
3. FastAPI extracts track ID → calls Spotify Web API for audio features + metadata
4. Feature engineering pipeline runs (same transformations as training)
5. XGBoost model (loaded from S3) runs inference
6. SHAP explainer (loaded from S3) computes per-feature contributions
7. Response JSON returned: `{ hit_probability, confidence, shap_values, feature_values, track_metadata }`
8. Frontend renders prediction card + animated SHAP waterfall

**What counts as a "hit":**
- Binary label derived from: peak Billboard Hot 100 position ≤ 40, OR peak Spotify Global Charts position ≤ 50, OR peak regional chart position ≤ 30
- Labeling methodology documented and transparent in EDA notebook

---

### 4.2 Audio Feature Set (from Spotify API)

All 13 Spotify audio features used as base features:

| Feature | Description |
|---|---|
| `danceability` | Rhythmic suitability for dancing (0–1) |
| `energy` | Perceptual intensity and activity (0–1) |
| `loudness` | Overall loudness in dB |
| `speechiness` | Presence of spoken words (0–1) |
| `acousticness` | Confidence of acoustic origin (0–1) |
| `instrumentalness` | Predicts absence of vocals (0–1) |
| `liveness` | Presence of live audience (0–1) |
| `valence` | Musical positiveness (0–1) |
| `tempo` | Estimated BPM |
| `duration_ms` | Track duration in milliseconds |
| `key` | Key the track is in (0–11) |
| `mode` | Major (1) or minor (0) |
| `time_signature` | Estimated time signature |

---

### 4.3 Engineered Features (the real ML work)

This is what separates AlgoRhythm from a raw Kaggle model. These are computed features that don't come directly from the API:

**Temporal / Release Timing Features**
- `release_month` — extracted from release date
- `release_quarter` — Q1/Q2/Q3/Q4 (Q4 = holiday season uplift)
- `release_day_of_week` — Friday = industry standard drop day
- `days_since_release_at_charting` — lag between release and first chart entry
- `release_era` — binned decade (pre-2000, 2000s, 2010s, streaming era 2015+, post-2020)
- `is_streaming_era` — binary flag for post-2015 releases

**Artist Momentum Features**
- `artist_prior_hits` — count of prior charting tracks by same artist
- `artist_hit_rate` — fraction of their discography that charted
- `artist_avg_popularity` — rolling average Spotify popularity score at time of release
- `is_debut_track` — binary flag for artist's first-ever release
- `artist_genre_diversity` — how many genres the artist spans (niche vs crossover)
- `collaborator_count` — number of featured artists (solo vs collab)
- `has_featured_artist` — binary flag

**Cultural / Genre Signals**
- `primary_genre` — genre tag from Spotify artist data
- `genre_era_hit_rate` — historical hit rate for this genre in this era
- `genre_danceability_deviation` — how much this track deviates from genre danceability norm
- `is_crossover` — flagged when track spans multiple distinct genre clusters
- `region_affinity_score` — per-region feature derived from genre + language metadata
- `language` — detected from lyrics metadata where available

**Audio Interaction Features**
- `energy_valence_ratio` — high energy + low valence = dark banger pattern
- `dance_energy_product` — combined danceability × energy score
- `loudness_normalized` — loudness adjusted for era (mastering loudness war correction)
- `tempo_bucket` — binned BPM: slow (<90), mid (90–120), uptempo (120–140), fast (>140)
- `acoustic_vs_electric` — acousticness vs instrumentalness contrast score

**Popularity Proxy Features**
- `spotify_popularity_at_release` — Spotify's own popularity metric at dataset snapshot
- `playlist_inclusion_count` — number of Spotify editorial playlists featuring the track
- `stream_velocity_30d` — estimated streams in first 30 days (where available from chart data)

---

### 4.4 Dataset Strategy

**Primary dataset sources:**
- `Spotify Charts` historical data (Kaggle: Spotify Charts 2017–2023) — provides chart positions and dates
- `Spotify Web API` — audio features fetched per track ID
- `Billboard Hot 100 historical` (Kaggle dataset) — US chart labels
- `Spotify Million Song Dataset` (supplemental, for non-hit negatives)
- Manual negative sampling from Spotify catalog (tracks with <1000 streams = clear non-hits)

**Dataset construction:**
- Positive class: tracks appearing on Spotify Global Top 200 or Billboard Hot 100 ≤ position 40
- Negative class: tracks from same era/genre with no chart presence and low popularity scores
- Class balance: targeted 40/60 hit/non-hit split (hits are rare; don't oversample into unrealism)
- Final dataset target: ~150,000–300,000 tracks across global regions

**Regional subsets for filter feature:**
- Global (default), India (Bollywood + regional), US, UK, Latin America, K-Pop, Afrobeats, EDM/Electronic

---

### 4.5 EDA Module (Research Layer)

The EDA notebook is a public artifact — it tells the story of what makes hits. Every finding gets a clean visualization.

**EDA story beats to surface:**

1. **The Danceability Threshold** — Is there a danceability floor below which hits almost never happen? (Hypothesis: ~0.55+)
2. **The Friday Effect** — Quantify the Friday release advantage vs other days
3. **Loudness Wars vs Streaming Era** — Did normalized loudness change what makes a hit post-2015?
4. **Genre Hit Rates by Era** — Which genres dominated each decade? How has that shifted?
5. **The Featured Artist Effect** — Do collabs statistically outperform solo tracks in charting rate?
6. **Tempo Distribution of Hits** — Is there a sweet spot BPM range globally?
7. **Key & Mode Patterns** — Do major-key tracks chart more? Which keys dominate?
8. **Duration Compression** — How has ideal track length changed from 4:00 → 2:30 in streaming era?
9. **Regional Divergence** — Which audio features predict hits in India vs US vs Latin vs K-Pop?
10. **Valence Paradox** — Are sad songs actually more likely to chart than happy ones in recent years?
11. **Artist Momentum Effect** — How much does prior hit count predict next hit? At what point does it plateau?
12. **Cold Start Problem** — What features best predict debut artist hits (no momentum signal)?

**Visualizations per EDA section:**
- Distribution plots (Seaborn histplot / kdeplot) per feature
- Correlation heatmap (hits vs non-hits feature means)
- Genre era heatmap (genre × decade × hit rate)
- Regional radar charts (feature profiles per region)
- Temporal trend lines (feature means over time)
- SHAP summary plot (global feature importance post-training)
- Confusion matrix and ROC curve
- Calibration curve (predicted probability vs actual hit rate)

---

### 4.6 Model Training Pipeline

**Algorithm:** XGBoost (XGBClassifier)

**Training steps:**
1. Data ingestion and cleaning (Pandas)
2. Feature engineering pipeline (custom transformer classes, sklearn Pipeline-compatible)
3. Train/validation/test split (70/15/15), stratified by era and region
4. Baseline model (default XGBoost params) — establish AUC floor
5. Hyperparameter optimization via **Optuna** (100+ trials, early stopping)
   - Tuned params: `n_estimators`, `max_depth`, `learning_rate`, `subsample`, `colsample_bytree`, `min_child_weight`, `gamma`, `reg_alpha`, `reg_lambda`
6. Cross-validation (5-fold stratified) on optimized params
7. Final model trained on train+val, evaluated on held-out test set
8. **Target metric:** AUC-ROC (primary), F1 @ 0.5 threshold (secondary), Precision@K (top predicted hits)

**Explainability:**
- `shap.TreeExplainer` fitted on final XGBoost model
- Global SHAP: summary plot, beeswarm, bar chart of mean |SHAP|
- Local SHAP: per-prediction waterfall plot (rendered as custom frontend component)
- SHAP interaction values for top 5 feature pairs
- Partial dependence plots for top 10 features

**Model artifacts saved to AWS S3:**
- `model.json` — XGBoost model in JSON format
- `shap_explainer.pkl` — fitted TreeExplainer object
- `feature_pipeline.pkl` — sklearn feature transformation pipeline
- `label_encoder.pkl` — genre/region encoders
- `training_metadata.json` — dataset stats, feature list, training date, AUC scores
- `feature_importance.json` — ranked feature importances for frontend display
- All artifacts versioned with timestamp prefix: `artifacts/v{timestamp}/`

---

### 4.7 FastAPI Backend (on AWS EC2)

**Base URL:** `https://api.algorhythm.com` (or EC2 public IP during dev)

**Endpoints:**

| Method | Route | Description |
|---|---|---|
| `POST` | `/predict` | Main prediction endpoint — takes Spotify URL, returns full prediction + SHAP |
| `GET` | `/track/{spotify_id}` | Fetch track metadata + audio features without running prediction |
| `GET` | `/health` | Health check — returns model version, uptime, S3 artifact timestamp |
| `GET` | `/features/importance` | Returns global feature importance rankings |
| `GET` | `/insights/region/{region}` | Returns EDA-derived hit pattern summary for a region |
| `GET` | `/insights/era/{era}` | Returns era-specific hit pattern summary |
| `POST` | `/batch-predict` | Takes up to 10 Spotify URLs, returns prediction for each (for comparison feature) |
| `GET` | `/similar-hits` | Given a track, returns top-5 actual hits with similar feature profiles |
| `GET` | `/regions` | Returns list of supported regions with metadata |
| `GET` | `/genres` | Returns list of supported genres with hit rates |

**Response schema for `/predict`:**
```json
{
  "track": {
    "id": "spotify_track_id",
    "name": "Track Name",
    "artist": "Artist Name",
    "album": "Album Name",
    "release_date": "2024-01-12",
    "duration_ms": 198000,
    "cover_url": "https://...",
    "spotify_url": "https://open.spotify.com/track/..."
  },
  "prediction": {
    "hit_probability": 0.847,
    "confidence": "high",
    "verdict": "hit",
    "percentile": 91,
    "regional_scores": {
      "global": 0.847,
      "us": 0.791,
      "india": 0.623,
      "latin": 0.412
    }
  },
  "features": {
    "danceability": 0.82,
    "energy": 0.74,
    "tempo": 128.4,
    "release_day_of_week": "Friday",
    "artist_prior_hits": 12,
    "... all features": "..."
  },
  "shap": {
    "base_value": 0.41,
    "values": {
      "danceability": 0.142,
      "artist_prior_hits": 0.098,
      "energy": 0.071,
      "release_day_of_week_friday": 0.063,
      "...": "..."
    },
    "top_positive": ["danceability", "artist_prior_hits", "energy"],
    "top_negative": ["acousticness", "speechiness"]
  },
  "similar_hits": [
    { "name": "...", "artist": "...", "similarity_score": 0.94, "spotify_url": "..." }
  ],
  "model_version": "v20250115",
  "inference_time_ms": 187
}
```

**EC2 configuration:**
- Instance: t3.medium (2 vCPU, 4GB RAM — sufficient for XGBoost inference)
- OS: Ubuntu 22.04 LTS
- Process manager: `systemd` service or `gunicorn` with `uvicorn` workers
- CORS configured to allow Vercel frontend domain
- Model artifacts loaded from S3 at startup and cached in memory
- Artifact refresh endpoint for hot model updates without restart
- Environment variables: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`

---

### 4.8 Frontend Application (React + Vercel)

**Pages / Routes:**

| Route | Page | Description |
|---|---|---|
| `/` | **Home / Hero** | 3D animated hero, search input, quick insight teasers |
| `/predict` | **Prediction Result** | Full prediction output for a track |
| `/compare` | **Track Comparison** | Side-by-side comparison of up to 3 tracks |
| `/atlas` | **Global Hit Atlas** | World map visualization of regional hit patterns |
| `/explore` | **Feature Explorer** | Interactive charts from EDA — the "research" layer |
| `/insights` | **Insights Report** | Long-form written + visual breakdown of what makes hits |
| `/about` | **About** | Project methodology, dataset, model card |

**Home Page Components:**
- 3D hero element (React Three Fiber): floating audio waveform mesh or vinyl record that reacts to mouse movement
- Large editorial headline: *"What makes a song a hit? The data has an answer."*
- Single Spotify URL input (centered, clean) — primary CTA
- Region selector pill (Global / US / India / Latin / K-Pop / Afrobeats / UK / EDM)
- Three animated "insight teaser" cards below fold: e.g. "Friday releases chart 2.3× more often", "The danceability floor is 0.55", "Collabs outperform solos by 31%"
- Recent predictions feed (last 10 public predictions, live-updating)

**Prediction Result Page Components:**
- Track card: album art, name, artist, release date, duration
- Hit verdict badge: large typographic display "HIT" or "MISS" or "BORDERLINE"
- Probability dial / arc meter (custom SVG animation) showing 0–100%
- Regional score breakdown: horizontal bar for each region
- **Custom SHAP Waterfall Chart** (built in React, not matplotlib):
  - Horizontal bars sorted by absolute SHAP value
  - Green bars = positive contribution toward hit
  - Red bars = negative contribution
  - Hover tooltip shows exact feature value + contribution
  - Animated entry (bars grow from base value outward)
- Feature spotlight cards: top 3 most influential features with human-readable explanations
  - e.g. "High danceability (0.82) — tracks above 0.75 chart 3.1× more often"
- Similar hits section: 5 real charting songs with similar feature profiles (album art grid)
- "What would change this?" section: toggle individual features to see how hit probability shifts (sensitivity analysis)
- Share card: generates a shareable image (OG card) with track + hit verdict for Twitter/LinkedIn

**Compare Page Components:**
- Up to 3 track inputs side-by-side
- Radar chart comparison (Chart.js or D3) of audio feature profiles
- Side-by-side probability bars
- SHAP delta view: what does Track B have that Track A doesn't?
- "Hit gap" analysis: what's the feature distance between the two tracks?

**Global Hit Atlas Page:**
- World map (D3 geo / react-simple-maps) with region highlighting
- Click a region → shows that region's top hit features, hit rate by genre, most common tempo range
- Feature fingerprint per region: radar chart of avg feature values for regional hits
- "Regional divergence" highlights: biggest differences between regions

**Feature Explorer Page:**
- Interactive recreation of key EDA charts using Recharts/D3
- Filters: by era, genre, region
- Charts: danceability distribution, tempo histogram, valence vs hit rate scatter, genre era heatmap
- Fully filterable, animated on filter change

**Insights Report Page:**
- Long-form editorial article format
- Sections matching the 12 EDA story beats
- Each section: written finding + embedded chart + key stat callout
- Designed to be read like a magazine piece, not a dashboard

---

### 4.9 AWS Infrastructure

**S3:**
- Bucket: `algorhythm-artifacts`
- Folders:
  - `artifacts/` — versioned model artifacts
  - `datasets/` — processed training CSVs (not raw, those stay local)
  - `eda-exports/` — exported chart PNGs/SVGs for potential use
  - `logs/` — inference request logs (anonymized, no PII)
- Lifecycle policy: keep last 5 artifact versions, archive older ones to S3 Glacier

**EC2:**
- Instance: `t3.medium`
- AMI: Ubuntu 22.04 LTS
- Security group: HTTP (80), HTTPS (443), SSH (22 from your IP only)
- Elastic IP attached (stable URL)
- IAM role with S3 read access attached to instance
- FastAPI served via `gunicorn -k uvicorn.workers.UvicornWorker`
- Nginx reverse proxy (handles SSL termination via Let's Encrypt / Certbot)
- Startup script pulls latest model artifacts from S3 on boot

**IAM:**
- EC2 instance role: `AmazonS3ReadOnlyAccess` scoped to `algorhythm-artifacts` bucket
- Local dev: separate IAM user with S3 read/write for training uploads
- Principle of least privilege throughout

---

### 4.10 Additional Features

**Model Card (Transparency)**
- Public `/about` page with full model card:
  - Training data date range and sources
  - Feature list with descriptions
  - Known biases (Western chart data overrepresented, pre-2000 data sparse)
  - Limitations (can't predict viral TikTok moments, label marketing budgets, sync licensing)
  - Evaluation metrics (AUC, F1, calibration curve)
  - Model version history

**Prediction History (Local)**
- Browser localStorage stores last 20 predictions
- Accessible via a "Recent" drawer in the UI
- No account required, no backend persistence of user data

**Spotify OAuth (Optional, Phase 2)**
- "Analyze my playlist" — connect Spotify, analyze all tracks in a playlist
- "What's my hit rate?" — score all tracks in user's liked songs
- Requires Spotify OAuth, separate flow

**EDA Notebook as Public Artifact**
- Jupyter notebook exported as HTML, hosted at `/notebook` or linked from `/about`
- All cells rendered with output, clean formatting
- Acts as the "research paper" version of the project

**Public API (Phase 2)**
- Rate-limited public API with API key registration
- Allows developers to query AlgoRhythm predictions programmatically
- Swagger docs auto-generated by FastAPI at `/docs`

**Social Sharing**
- `/predict` result generates a shareable OG image:
  - Track name, artist, album art
  - Hit probability score
  - "Analyzed by AlgoRhythm"
- Works with Twitter, LinkedIn, WhatsApp preview cards

---

## 5. Data Flow Diagram

```
User (Browser)
      │
      │  Spotify URL
      ▼
[Vercel Frontend]
      │
      │  POST /predict { spotify_url }
      ▼
[AWS EC2 — FastAPI]
      │                        │
      │  Spotify Web API       │  Load model artifacts
      │  (audio features)      │  (startup / cache)
      ▼                        ▼
[Feature Engineering]    [AWS S3]
      │                  model.json
      │                  shap_explainer.pkl
      ▼                  feature_pipeline.pkl
[XGBoost Inference]
      │
      │  SHAP values
      ▼
[SHAP Explainer]
      │
      │  { prediction, shap_values, features, similar_hits }
      ▼
[Vercel Frontend]
      │
      ▼
[Custom SHAP Waterfall + UI]
```

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Model AUC-ROC | ≥ 0.82 |
| Model F1 Score | ≥ 0.75 |
| Prediction latency (p95) | < 2 seconds |
| Frontend lighthouse score | ≥ 90 |
| Demo works live | Yes — no localhost, no "coming soon" |
| Resume bullet talks to real numbers | Yes — AUC, dataset size, features engineered |
| AWS S3 + EC2 in actual use | Yes — not just listed on resume |

---

## 7. Timeline (Suggested)

| Phase | Work | Duration |
|---|---|---|
| **Phase 1** | Dataset collection, cleaning, labeling | 3–4 days |
| **Phase 2** | EDA + feature engineering notebook | 3–4 days |
| **Phase 3** | Model training + Optuna HPO + SHAP | 2–3 days |
| **Phase 4** | FastAPI backend + EC2 deployment | 2 days |
| **Phase 5** | S3 artifact pipeline + versioning | 1 day |
| **Phase 6** | React frontend (all pages) | 4–5 days |
| **Phase 7** | Integration, testing, polish | 2 days |
| **Total** | | **~17–21 days** |

---

## 8. Resume Bullet Template

```
AlgoRhythm — Global Music Hit Prediction System
Tech: Python · Pandas · XGBoost · SHAP · Optuna · Spotify API · FastAPI · AWS S3 · AWS EC2 · React · Vercel

- Engineered 35+ features from 200K+ global tracks (Spotify audio API, chart datasets, 
  artist momentum, release timing, genre-era signals) using Pandas; trained XGBoost 
  classifier with Optuna HPO achieving 0.XX AUC-ROC on held-out test set

- Built per-prediction SHAP explainability pipeline (TreeExplainer); rendered custom 
  animated SHAP waterfall chart in React — regional hit scoring across 8 markets 
  (Global, US, India, Latin, K-Pop, Afrobeats, UK, EDM)

- Deployed FastAPI inference server on AWS EC2 (t3.medium) with Nginx reverse proxy; 
  versioned model artifacts (XGBoost JSON, SHAP explainer, feature pipeline) to AWS S3; 
  live frontend on Vercel with 3D audio visualization (React Three Fiber)
```

---

*PRD version: 1.0 | Project: AlgoRhythm | Author: Aditya*
