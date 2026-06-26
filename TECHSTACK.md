# AlgoRhythm — Tech Stack

> Complete technology decisions for every layer of the system. Every tool listed here is used in a real capacity — nothing is resume decoration.

---

## 1. Data & ML Layer

### Core ML
| Tool | Version | Purpose |
|---|---|---|
| **Python** | 3.11+ | Primary language for all data/ML work |
| **XGBoost** | ≥2.0 | Primary classifier — gradient boosted trees for hit prediction |
| **SHAP** | ≥0.44 | TreeExplainer for per-prediction feature attribution + global importance |
| **Optuna** | ≥3.5 | Hyperparameter optimization (100+ trials, Bayesian search) |
| **scikit-learn** | ≥1.4 | Pipeline, ColumnTransformer, cross-validation, metrics, preprocessing |

### Data Engineering
| Tool | Version | Purpose |
|---|---|---|
| **Pandas** | ≥2.1 | All data ingestion, feature engineering, EDA, merging datasets |
| **NumPy** | ≥1.26 | Numerical operations within feature engineering pipeline |
| **Spotipy** | ≥2.23 | Python SDK for Spotify Web API (audio features, metadata, artist data) |

### EDA & Visualization (Notebook)
| Tool | Version | Purpose |
|---|---|---|
| **Seaborn** | ≥0.13 | Statistical visualizations — distributions, heatmaps, pairplots |
| **Matplotlib** | ≥3.8 | Custom plots, SHAP summary/waterfall renders for notebook |
| **Plotly** | ≥5.18 | Interactive charts in notebook (genre era heatmap, regional radar) |
| **Jupyter** | ≥7.0 | EDA + training notebook environment |
| **nbconvert** | ≥7.0 | Export notebook as clean HTML for public artifact hosting |

### Model Persistence
| Tool | Purpose |
|---|---|
| **joblib** | Serialize sklearn Pipeline, SHAP explainer, label encoders |
| **XGBoost native JSON** | Save/load XGBoost model (`model.save_model("model.json")`) |
| **boto3** | Upload/download model artifacts to/from AWS S3 |

---

## 2. Backend Layer

### API Framework
| Tool | Version | Purpose |
|---|---|---|
| **FastAPI** | ≥0.110 | REST API framework — async, auto-generates OpenAPI docs |
| **Uvicorn** | ≥0.27 | ASGI server (used with gunicorn in prod) |
| **Gunicorn** | ≥21.0 | Process manager for production (multiple uvicorn workers) |
| **Pydantic v2** | ≥2.5 | Request/response schema validation |

### External Integrations
| Tool | Purpose |
|---|---|
| **Spotipy / httpx** | Spotify Web API calls from backend (audio features, metadata) |
| **boto3** | AWS SDK — load model artifacts from S3 at startup |
| **asyncio / threading** | Async artifact loading, non-blocking inference |

### Infrastructure
| Tool | Purpose |
|---|---|
| **Nginx** | Reverse proxy in front of gunicorn — handles SSL termination, rate limiting |
| **Certbot + Let's Encrypt** | Free SSL certificate for HTTPS |
| **systemd** | Service management — auto-restart FastAPI on EC2 reboot |
| **python-dotenv** | Environment variable management |

### Middleware & Security
| Tool | Purpose |
|---|---|
| **fastapi.middleware.cors** | CORS configured for Vercel frontend domain |
| **slowapi** | Rate limiting middleware (prevent API abuse) |
| **python-jose** | JWT if any auth layer is added (Phase 2) |

---

## 3. AWS Infrastructure

### Storage
| Service | Configuration | Purpose |
|---|---|---|
| **AWS S3** | Bucket: `algorhythm-artifacts` | Versioned model artifact storage — XGBoost JSON, SHAP explainer PKL, feature pipeline PKL, label encoders, training metadata JSON |
| **S3 Lifecycle Policy** | Keep 5 versions, archive older to Glacier | Cost control + version history |
| **S3 Static Hosting** | Optional | EDA notebook HTML export hosting |

### Compute
| Service | Configuration | Purpose |
|---|---|---|
| **AWS EC2** | t3.medium (2 vCPU, 4GB RAM) | FastAPI inference server |
| **Ubuntu 22.04 LTS** | AMI base | OS for EC2 |
| **Elastic IP** | 1 static IP attached | Stable endpoint URL for frontend |
| **Security Group** | Port 80, 443, 22 (restricted) | Network access control |

### Identity & Access
| Service | Configuration | Purpose |
|---|---|---|
| **IAM Role** | EC2 instance role | Grants EC2 read access to S3 bucket — no credentials in code |
| **IAM User** | Dev/training user | S3 read/write for uploading artifacts during training |
| **IAM Policy** | Least-privilege, scoped to `algorhythm-artifacts` | Security |

### Monitoring (Lightweight)
| Service | Purpose |
|---|---|
| **CloudWatch Logs** | EC2 instance + application logs |
| **CloudWatch Alarms** | CPU > 80%, disk > 70% triggers alert |

---

## 4. Frontend Layer

### Core Framework
| Tool | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI framework |
| **Next.js** | 14+ (App Router) | Routing, SSR for SEO pages (home, insights, about), API routes |
| **TypeScript** | ≥5.3 | Type safety throughout frontend |

### 3D & Animation
| Tool | Version | Purpose |
|---|---|---|
| **React Three Fiber** | ≥8.0 | 3D canvas rendering in React (hero waveform / vinyl mesh) |
| **Three.js** | ≥0.160 | Underlying 3D engine |
| **@react-three/drei** | ≥9.0 | Three.js helpers (OrbitControls, Float, Environment) |
| **Framer Motion** | ≥11.0 | Page transitions, SHAP bar entry animations, card reveals |
| **Lottie React** | Optional | Micro-animations for loading states |

### Data Visualization (Frontend)
| Tool | Version | Purpose |
|---|---|---|
| **Recharts** | ≥2.10 | Custom SHAP waterfall chart, probability arc, regional bars |
| **D3.js** | ≥7.0 | World map (Hit Atlas page), custom scales, color interpolation |
| **react-simple-maps** | ≥3.0 | Geographic map base layer for Atlas page |

### Styling
| Tool | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | ≥3.4 | Utility classes for layout and spacing (design tokens override defaults) |
| **CSS Modules** | — | Component-level styles for complex components (SHAP chart, 3D container) |
| **next/font** | — | Self-hosted fonts (zero layout shift, editorial type choices) |

### State & Data Fetching
| Tool | Version | Purpose |
|---|---|---|
| **TanStack Query** | ≥5.0 | Server state — prediction results, feature importance, insights |
| **Zustand** | ≥4.5 | Client state — comparison tracks, region filter, recent history |
| **axios / fetch** | — | HTTP calls to FastAPI EC2 endpoint |

### Utilities
| Tool | Purpose |
|---|---|
| **html2canvas + jspdf / dom-to-image** | Generate shareable OG image of prediction result |
| **date-fns** | Release date formatting and era calculations |
| **clsx** | Conditional className utility |

---

## 5. Deployment

| Service | What's Deployed | Configuration |
|---|---|---|
| **Vercel** | Next.js frontend | Auto-deploy from `main` branch, environment variables for API URL |
| **AWS EC2** | FastAPI backend | systemd service, Nginx reverse proxy, Elastic IP, HTTPS via Certbot |
| **AWS S3** | Model artifacts | Versioned, IAM-controlled, loaded by EC2 at boot |

**Deployment flow:**
```
Training machine (local)
    │
    │  boto3 upload
    ▼
AWS S3 (algorhythm-artifacts/artifacts/v{timestamp}/)
    │
    │  EC2 pulls on boot / refresh endpoint
    ▼
AWS EC2 (FastAPI — gunicorn + uvicorn + nginx)
    │
    │  CORS-open REST API
    ▼
Vercel (Next.js frontend)
    │
    ▼
User browser
```

---

## 6. Development Environment

| Tool | Purpose |
|---|---|
| **Poetry** | Python dependency management (pyproject.toml) |
| **pre-commit** | Black, isort, flake8 hooks on git commit |
| **Black** | Python code formatting |
| **ESLint + Prettier** | TypeScript/React code formatting |
| **pytest** | Unit tests for feature engineering pipeline and API endpoints |
| **httpx (async)** | FastAPI test client in pytest |
| **python-dotenv** | Local `.env` for API keys during development |
| **Jupyter + VS Code** | Development environment |

---

## 7. External APIs

| API | Usage | Auth Method |
|---|---|---|
| **Spotify Web API** | Audio features, track metadata, artist data, playlist data | OAuth 2.0 Client Credentials (server-side only, no user login required for basic prediction) |
| **Spotify OAuth** | Phase 2 — "Analyze my playlist" feature | Authorization Code Flow |

---

## 8. Environment Variables

### Backend (EC2 `.env`)
```env
# Spotify API
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# AWS
AWS_ACCESS_KEY_ID=          # dev only — prod uses IAM instance role
AWS_SECRET_ACCESS_KEY=      # dev only
AWS_REGION=ap-south-1       # or us-east-1
S3_BUCKET_NAME=algorhythm-artifacts
S3_ARTIFACT_PREFIX=artifacts/v{LATEST}

# App
ENVIRONMENT=production
ALLOWED_ORIGINS=https://algorhythm.vercel.app
RATE_LIMIT_PER_MINUTE=30
PORT=8000
```

### Frontend (Vercel environment)
```env
NEXT_PUBLIC_API_URL=https://your-ec2-elastic-ip-or-domain
NEXT_PUBLIC_ENV=production
```

---

## 9. Project Structure

```
algorhythm/
├── ml/                          # All data science work
│   ├── data/
│   │   ├── raw/                 # Downloaded datasets (gitignored)
│   │   └── processed/           # Cleaned, merged, feature-engineered
│   ├── notebooks/
│   │   ├── 01_eda.ipynb         # Full EDA — 12 story beats
│   │   ├── 02_feature_engineering.ipynb
│   │   └── 03_training.ipynb    # XGBoost + Optuna + SHAP
│   ├── src/
│   │   ├── features.py          # Feature engineering pipeline (sklearn-compatible)
│   │   ├── train.py             # Training script
│   │   ├── evaluate.py          # Metrics, calibration, confusion matrix
│   │   ├── shap_analysis.py     # SHAP computation and export
│   │   └── upload_artifacts.py  # boto3 S3 upload script
│   └── requirements.txt
│
├── backend/                     # FastAPI application
│   ├── main.py                  # App entrypoint, router registration
│   ├── routers/
│   │   ├── predict.py           # /predict, /batch-predict
│   │   ├── track.py             # /track/{id}
│   │   ├── insights.py          # /insights/region, /insights/era
│   │   └── health.py            # /health
│   ├── services/
│   │   ├── spotify.py           # Spotify API client
│   │   ├── model.py             # Model loading, inference, SHAP
│   │   └── s3.py                # S3 artifact download and caching
│   ├── schemas/
│   │   ├── predict.py           # Request/response Pydantic models
│   │   └── track.py
│   ├── core/
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   └── middleware.py        # CORS, rate limiting
│   └── requirements.txt
│
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── page.tsx             # Home / hero
│   │   ├── predict/
│   │   │   └── page.tsx         # Prediction result
│   │   ├── compare/
│   │   │   └── page.tsx         # Track comparison
│   │   ├── atlas/
│   │   │   └── page.tsx         # Global hit atlas map
│   │   ├── explore/
│   │   │   └── page.tsx         # Feature explorer
│   │   ├── insights/
│   │   │   └── page.tsx         # EDA insights report
│   │   └── about/
│   │       └── page.tsx         # Model card + methodology
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroCanvas.tsx   # React Three Fiber 3D scene
│   │   │   └── SearchInput.tsx
│   │   ├── prediction/
│   │   │   ├── PredictionCard.tsx
│   │   │   ├── ShapWaterfall.tsx  # Custom SHAP chart (Recharts)
│   │   │   ├── ProbabilityArc.tsx # SVG arc meter
│   │   │   ├── RegionalScores.tsx
│   │   │   ├── SimilarHits.tsx
│   │   │   └── SensitivitySliders.tsx
│   │   ├── compare/
│   │   │   ├── TrackInput.tsx
│   │   │   └── RadarComparison.tsx
│   │   ├── atlas/
│   │   │   ├── WorldMap.tsx
│   │   │   └── RegionPanel.tsx
│   │   ├── explore/
│   │   │   └── FeatureCharts.tsx
│   │   └── ui/                  # Shared design system components
│   │       ├── Badge.tsx
│   │       ├── TrackCard.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── api.ts               # API client (axios, typed)
│   │   ├── store.ts             # Zustand stores
│   │   └── types.ts             # TypeScript types matching API schemas
│   ├── public/
│   └── package.json
│
├── infra/                       # AWS configuration scripts
│   ├── ec2_setup.sh             # EC2 bootstrap script
│   ├── nginx.conf               # Nginx config
│   └── algorhythm.service         # systemd service file
│
└── README.md
```

---

## 10. Tech Stack Summary (Resume Line Format)

```
Python · Pandas · NumPy · XGBoost · SHAP · Optuna · scikit-learn · 
Seaborn · Matplotlib · Spotipy · FastAPI · Uvicorn · Gunicorn · 
AWS S3 · AWS EC2 · IAM · boto3 · React · Next.js · TypeScript · 
React Three Fiber · Three.js · Framer Motion · Recharts · D3.js · 
Tailwind CSS · TanStack Query · Zustand · Vercel
```

---

*TECHSTACK version: 1.0 | Project: AlgoRhythm | Author: Aditya*
