"""Upload trained artifacts to S3 under a timestamped, versioned prefix.

    python src/upload_artifacts.py            # uploads artifacts/v{timestamp}/
    python src/upload_artifacts.py --latest   # also updates artifacts/latest/

Requires AWS credentials (env or ~/.aws). The EC2 instance reads from the prefix
configured by S3_ARTIFACT_PREFIX in the backend .env.
"""
from __future__ import annotations

import argparse
import os
import time

ART_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")
ARTIFACT_FILES = [
    "model.json",
    "feature_pipeline.pkl",
    "shap_explainer.pkl",
    "training_metadata.json",
    "feature_importance.json",
]


def main():
    import boto3
    from dotenv import load_dotenv

    load_dotenv()
    ap = argparse.ArgumentParser()
    ap.add_argument("--bucket", default=os.getenv("S3_BUCKET_NAME", "algorhythm-artifacts"))
    ap.add_argument("--region", default=os.getenv("AWS_REGION", "ap-south-1"))
    ap.add_argument("--latest", action="store_true", help="also mirror to artifacts/latest/")
    args = ap.parse_args()

    s3 = boto3.client("s3", region_name=args.region)
    version = f"v{int(time.time())}"
    prefixes = [f"artifacts/{version}"] + (["artifacts/latest"] if args.latest else [])

    for prefix in prefixes:
        for fname in ARTIFACT_FILES:
            local = os.path.join(ART_DIR, fname)
            if not os.path.exists(local):
                print(f"  skip (missing): {fname}")
                continue
            key = f"{prefix}/{fname}"
            s3.upload_file(local, args.bucket, key)
            print(f"  uploaded s3://{args.bucket}/{key}")

    print(f"Done. Set S3_ARTIFACT_PREFIX=artifacts/{version} (or artifacts/latest).")


if __name__ == "__main__":
    main()
