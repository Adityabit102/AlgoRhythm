# AlgoRhythm — Infrastructure

Deploys the FastAPI backend to AWS EC2 behind nginx, with model artifacts in S3.
The Next.js frontend deploys separately to Vercel.

## S3 (artifacts)

```bash
aws s3 mb s3://algorhythm-artifacts --region ap-south-1
# Lifecycle: keep last 5 versions, archive older to Glacier (set in console or via
# put-bucket-lifecycle-configuration).
```

Upload artifacts from training: `cd ml && python src/upload_artifacts.py --latest`.

## IAM (least privilege)

- **EC2 instance role** → read-only on `algorhythm-artifacts` only:
  ```json
  { "Effect": "Allow", "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::algorhythm-artifacts",
                 "arn:aws:s3:::algorhythm-artifacts/*"] }
  ```
- **Local/training IAM user** → read/write to the same bucket for uploads.

## EC2

1. Launch `t3.medium`, Ubuntu 22.04, attach the instance role above + an Elastic IP.
2. Security group: 80, 443, and 22 (your IP only).
3. SSH in and run the bootstrap (or paste it as user-data):
   ```bash
   sudo REPO_URL=https://github.com/Adityabit102/AlgoRhythm.git bash ec2_setup.sh
   ```
4. Create `backend/.env` (Spotify keys, `USE_MOCK_MODEL=0`, `S3_ARTIFACT_PREFIX`,
   `ALLOWED_ORIGINS=https://<your-vercel-domain>`), then `sudo systemctl restart algorhythm`.
5. HTTPS: `sudo certbot --nginx -d api.yourdomain.com`.

## Vercel (frontend)

- Import the repo, set root directory to `frontend/`.
- Env: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`.
- Deploy. (With the env unset, the frontend runs on built-in mock data.)

## Files

| File | Role |
|---|---|
| `ec2_setup.sh` | one-shot EC2 bootstrap |
| `algorhythm.service` | systemd unit (gunicorn + uvicorn workers) |
| `nginx.conf` | reverse proxy + rate limiting (Certbot adds SSL) |
