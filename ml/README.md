# AlgoRhythm — ML

The data-science layer: feature engineering → training (XGBoost + Optuna) → SHAP →
versioned artifacts. The pipeline runs end-to-end on **synthetic data today**, and
swaps to real data by replacing one CSV.

> **Use Python 3.11.** XGBoost/SHAP wheels lag on 3.14.

```bash
cd ml
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Run the whole pipeline on synthetic data (proves it works)

```bash
python src/make_sample_data.py --n 20000     # → data/processed/tracks.csv
python src/train.py --trials 60              # → artifacts/ (model, pipeline, shap, metadata)
python src/evaluate.py                       # → ROC, confusion, calibration PNGs + metrics
python src/upload_artifacts.py --latest      # → S3 (needs AWS creds)
```

Then point the backend at the real model:

```bash
# backend/.env
USE_MOCK_MODEL=0
S3_ARTIFACT_PREFIX=artifacts/latest
```

…and finish wiring `backend/services/model.py::_real_prediction` (the feature
pipeline + SHAP call — the shapes are already defined).

## 🧑 What I need from you for the *real* model

1. **Spotify API app** → `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`
   (developer.spotify.com → create app, Client Credentials flow).
2. **Datasets** (Kaggle): Spotify Charts 2017–2023, Billboard Hot 100 historical.
   Drop raw files in `data/raw/` (gitignored).
3. **A merge/label step** that produces `data/processed/tracks.csv` with the columns
   `make_sample_data.py` emits + an `is_hit` label (the labeling rule is in PRD §4.1).
   I can write the Spotify-fetch + merge script once you've got the raw datasets and keys.
4. **AWS account** for S3 (artifacts) + EC2 (inference) when you're ready to deploy.

The `is_hit` label = peak Billboard Hot 100 ≤ 40 **OR** Spotify Global ≤ 50 **OR**
regional chart ≤ 30. Negatives = same-era/genre tracks with no chart presence.

## Files

| File | Role |
|---|---|
| `src/features.py` | sklearn-compatible feature engineering (35+ features) |
| `src/make_sample_data.py` | synthetic dataset generator (signal matches the EDA) |
| `src/train.py` | XGBoost + Optuna HPO, exports all artifacts |
| `src/evaluate.py` | AUC / F1 / confusion / ROC / calibration |
| `src/shap_analysis.py` | TreeExplainer + global SHAP plots |
| `src/upload_artifacts.py` | boto3 versioned S3 upload |
| `notebooks/` | EDA + feature engineering + training notebooks |
