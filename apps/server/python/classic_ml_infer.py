from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import joblib


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--project-root", required=True)
    args = parser.parse_args()

    project_root = Path(args.project_root)
    sys.path.insert(0, str(project_root))

    from cv_features import CLASS_NAMES, extract_features

    model_path = Path(args.model)
    if not model_path.exists():
        raise FileNotFoundError(f"Classic ML model not found: {model_path}")

    bundle = joblib.load(model_path)
    model = bundle["model"]
    metadata = bundle.get("metadata", {})
    image_size = int(metadata.get("image_size", 128))
    selected_key = metadata.get("best_by_cv_danger_f1")
    display_names = metadata.get("model_display_names", {})
    model_display = display_names.get(selected_key, selected_key or type(model).__name__)

    started = time.perf_counter()
    features = extract_features(Path(args.image), image_size=image_size).reshape(1, -1)
    prediction = int(model.predict(features)[0])
    latency_ms = (time.perf_counter() - started) * 1000

    label = CLASS_NAMES[prediction]
    confidence = None
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        confidence = round(float(probabilities[prediction]), 3)

    payload = {
        "model_name": f"Classic CV {model_display}",
        "status": "DANGER" if label == "danger" else "SAFE",
        "reason": f"{model_display} classified the frame as danger."
        if label == "danger"
        else f"{model_display} classified the frame as safe.",
        "detections": [],
        "latency_ms": round(latency_ms, 1),
        "preprocessing": [
            {
                "name": "Resize",
                "description": f"Image is resized to {image_size} x {image_size} pixels.",
            },
            {
                "name": "HOG",
                "description": "Shape gradients are extracted from the grayscale frame.",
            },
            {
                "name": "HSV histogram",
                "description": "Color distribution is encoded from hue, saturation, and value channels.",
            },
            {
                "name": "Uniform LBP",
                "description": "Texture patterns are summarized with local binary patterns.",
            },
            {
                "name": "Canny edge density",
                "description": "Edge density is added as a compact spatial feature.",
            },
        ],
    }
    if confidence is not None:
        payload["confidence"] = confidence

    print(json.dumps(payload))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        raise
