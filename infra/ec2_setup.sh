#!/usr/bin/env bash
# AlgoRhythm — EC2 bootstrap (Ubuntu 22.04/24.04, t3.micro free-tier friendly).
# Adds swap (t3.micro is only 1GB — the ML stack OOMs without it), installs the
# app, pulls model artifacts from S3, and serves gunicorn behind nginx.
# Run as root:  sudo REPO_URL=https://github.com/Adityabit102/AlgoRhythm.git bash ec2_setup.sh
set -euo pipefail

APP_DIR=/opt/algorhythm
REPO_URL="${REPO_URL:-https://github.com/Adityabit102/AlgoRhythm.git}"
BUCKET="${S3_BUCKET_NAME:-algorhythm-artifacts}"
PREFIX="${S3_ARTIFACT_PREFIX:-artifacts/latest}"

echo "==> Swap (prevents OOM on 1GB t3.micro)"
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> System packages"
apt-get update -y
# use the distro's default python3 (26.04 ships a newer one; xgboost/shap have wheels)
apt-get install -y python3 python3-venv python3-pip nginx git awscli \
  certbot python3-certbot-nginx

echo "==> Fetch code"
mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" pull --ff-only
fi

echo "==> Python env"
cd "$APP_DIR/backend"
python3 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt

echo "==> Pull model artifacts from S3 into ml/artifacts (instance IAM role grants read)"
mkdir -p "$APP_DIR/ml/artifacts"
aws s3 sync "s3://${BUCKET}/${PREFIX}" "$APP_DIR/ml/artifacts" || \
  echo "WARN: artifact sync failed — check the IAM role / bucket / prefix"

echo "==> starter .env (edit it to add Spotify keys + your Vercel domain)"
if [ ! -f "$APP_DIR/backend/.env" ]; then
  cat > "$APP_DIR/backend/.env" <<EOF
USE_MOCK_MODEL=0
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
S3_BUCKET_NAME=${BUCKET}
S3_ARTIFACT_PREFIX=${PREFIX}
ALLOWED_ORIGINS=http://localhost:3000
EOF
fi

echo "==> systemd + nginx"
cp "$APP_DIR/infra/algorhythm.service" /etc/systemd/system/algorhythm.service
cp "$APP_DIR/infra/nginx.conf" /etc/nginx/sites-available/algorhythm
ln -sf /etc/nginx/sites-available/algorhythm /etc/nginx/sites-enabled/algorhythm
rm -f /etc/nginx/sites-enabled/default

# ownership so the www-data service user can read the app
chown -R www-data:www-data "$APP_DIR"

systemctl daemon-reload
systemctl enable algorhythm
systemctl restart algorhythm
nginx -t && systemctl restart nginx

echo "==> Done. Local health:  curl http://localhost/health"
echo "    HTTPS: point a domain at this IP, then:  sudo certbot --nginx -d <your-domain>"
