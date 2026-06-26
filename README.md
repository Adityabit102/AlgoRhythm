# AlgoRhythm 🎧

> **The science behind every hit.** A full-stack ML system that predicts whether any
> Spotify track has the DNA of a global or regional chart hit — with SHAP-powered
> explanations of *exactly* which audio and contextual features drove the call.

Predict a song's hit probability (0–100%), see a custom animated SHAP waterfall of what
pushed it up or down, compare tracks, and explore what makes hits across 8 regions.

## Stack

| Layer | Tech |
|---|---|
| **ML** | Python · Pandas · XGBoost · SHAP · Optuna · scikit-learn |
| **Backend** | FastAPI · Uvicorn/Gunicorn · Spotipy · boto3 |
| **Frontend** | Next.js 14 · TypeScript · React Three Fiber · Framer Motion · Recharts · D3 · Tailwind |
| **Infra** | AWS S3 (artifacts) · AWS EC2 (inference) · Vercel (frontend) |

## Monorepo layout

```
ml/         # data science: EDA, feature engineering, training, SHAP, S3 upload
backend/    # FastAPI inference server
frontend/   # Next.js app (all pages + 3D)
infra/      # EC2 bootstrap, nginx, systemd
```

See `PRD.md` for the full product spec, `TECHSTACK.md` for tech decisions,
`DESIGN_SYSTEM.md` for the visual language, and `TODO.md` for the atomic build checklist.

## Quick start

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

### Backend
```bash
cd backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # set Spotify + AWS keys
USE_MOCK_MODEL=1 uvicorn main:app --reload   # http://localhost:8000/docs
```

> The frontend ships with mock prediction data, so it runs standalone before the
> backend or trained model exist. The backend can run with `USE_MOCK_MODEL=1` to
> serve mock inference until real S3 artifacts are uploaded.

## ML model

The model (XGBoost + SHAP) is trained in `ml/` and requires Spotify API keys, chart
datasets, and (for deployment) an AWS account. Training is guided step-by-step — see
`ml/README.md` and `TODO.md` Phase 13.
