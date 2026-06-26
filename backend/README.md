# AlgoRhythm — Backend (FastAPI)

Inference API. Runs in **mock mode** out of the box (deterministic predictions, no
model or keys required), so the frontend works end-to-end before the model is trained.

## Run

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive Swagger docs.

> **Mock vs real:** `USE_MOCK_MODEL=1` (default) serves mock predictions and never
> imports xgboost/shap/boto3. Set `USE_MOCK_MODEL=0` once trained artifacts exist in
> S3 and Spotify credentials are configured — the app will then load artifacts at
> startup and run real inference + SHAP.

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Model version, mock flag, uptime |
| `POST` | `/predict` | Hit probability + SHAP for a Spotify URL |
| `POST` | `/batch-predict` | Up to 10 tracks (Compare page) |
| `GET` | `/track/{id}` | Metadata + audio features only |
| `GET` | `/regions`, `/genres` | Reference lists |
| `GET` | `/features/importance` | Global feature importance |
| `GET` | `/insights/region/{r}`, `/insights/era/{e}` | EDA summaries |
| `GET` | `/similar-hits?track=` | Nearest charting tracks |

## Notes

- **Python version:** the web layer runs on any 3.11+. For real inference, use a
  **Python 3.11** venv — XGBoost/SHAP wheels lag on 3.14.
- Real inference (`services/model.py::_real_prediction`) is wired but raises until the
  feature pipeline + artifacts from `ml/` Phase 13 are uploaded to S3.
