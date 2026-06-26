#!/usr/bin/env bash
# AlgoRhythm — EC2 bootstrap (Ubuntu 22.04 LTS, t3.medium).
# Installs Python + the app, configures gunicorn behind nginx, pulls model
# artifacts from S3 on boot. Run as root (user-data or `sudo bash ec2_setup.sh`).
set -euo pipefail

APP_DIR=/opt/algorhythm
REPO_URL="${REPO_URL:-https://github.com/Adityabit102/AlgoRhythm.git}"

echo "==> System packages"
apt-get update -y
apt-get install -y python3.11 python3.11-venv python3-pip nginx git awscli

echo "==> Fetch code"
mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" pull --ff-only
fi

echo "==> Python env"
cd "$APP_DIR/backend"
python3.11 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt

echo "==> Pull model artifacts from S3 (instance IAM role grants read)"
BUCKET="${S3_BUCKET_NAME:-algorhythm-artifacts}"
PREFIX="${S3_ARTIFACT_PREFIX:-artifacts/latest}"
mkdir -p "$APP_DIR/backend/.artifacts"
aws s3 sync "s3://${BUCKET}/${PREFIX}" "$APP_DIR/backend/.artifacts" || \
  echo "WARN: artifact sync failed — backend will need USE_MOCK_MODEL=1"

echo "==> systemd + nginx"
cp "$APP_DIR/infra/algorhythm.service" /etc/systemd/system/algorhythm.service
cp "$APP_DIR/infra/nginx.conf" /etc/nginx/sites-available/algorhythm
ln -sf /etc/nginx/sites-available/algorhythm /etc/nginx/sites-enabled/algorhythm
rm -f /etc/nginx/sites-enabled/default

systemctl daemon-reload
systemctl enable algorhythm
systemctl restart algorhythm
nginx -t && systemctl restart nginx

echo "==> Done. Health: curl http://localhost/health"
echo "    HTTPS: run  certbot --nginx -d api.yourdomain.com"
