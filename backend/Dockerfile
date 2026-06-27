# Backend container for a free host (Hugging Face Spaces / Render / Cloud Run).
# Loads model artifacts from AWS S3 at boot (set the env vars / secrets below).
FROM python:3.11-slim

WORKDIR /app

ENV PIP_NO_CACHE_DIR=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Hugging Face Spaces serve on 7860; other hosts inject $PORT.
ENV PORT=7860
EXPOSE 7860

# Real model on; artifacts pulled from S3 (S3_* + AWS_* provided as secrets).
ENV USE_MOCK_MODEL=0

CMD ["sh", "-c", "gunicorn main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:${PORT:-7860} -w 1 --timeout 120"]
