from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import cv2
import torch
from ultralytics import YOLO


CLASS_BARRIER_OPEN = 0
CLASS_BARRIER_CLOSED = 1
CLASS_OBSTACLE = 2
CONF_THRESHOLD = 0.4

NAME_BY_CLASS = {
    CLASS_BARRIER_OPEN: "barrier_open",
    CLASS_BARRIER_CLOSED: "barrier_closed",
    CLASS_OBSTACLE: "obstacle",
}


def evaluate(class_ids: list[int]) -> tuple[str, str]:
    if CLASS_BARRIER_OPEN in class_ids:
        return "SAFE", "Barrier open, no train incoming"
    if CLASS_BARRIER_CLOSED in class_ids and CLASS_OBSTACLE in class_ids:
        return "DANGER", "Obstacle on tracks while barrier closed"
    if CLASS_BARRIER_CLOSED in class_ids:
        return "SAFE", "Barrier closed, tracks clear"
    return "SAFE", "No significant detection"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--weights", required=True)
    parser.add_argument("--conf", type=float, default=CONF_THRESHOLD)
    args = parser.parse_args()

    image_path = Path(args.image)
    weights_path = Path(args.weights)
    if not weights_path.exists():
        raise FileNotFoundError(f"Weights not found: {weights_path}")

    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not decode image: {image_path}")

    model = YOLO(str(weights_path))
    device = 0 if torch.cuda.is_available() else "cpu"
    half = torch.cuda.is_available()

    started = time.perf_counter()
    results = model.predict(image, conf=args.conf, device=device, half=half, verbose=False)
    latency_ms = (time.perf_counter() - started) * 1000

    detections = []
    class_ids = []
    boxes = results[0].boxes
    if boxes is not None and len(boxes) > 0:
        for cls, conf, xyxy in zip(boxes.cls.tolist(), boxes.conf.tolist(), boxes.xyxy.tolist()):
            class_id = int(cls)
            class_ids.append(class_id)
            detections.append(
                {
                    "class": NAME_BY_CLASS.get(class_id, "unknown"),
                    "class_id": class_id,
                    "confidence": round(float(conf), 3),
                    "bbox": [round(float(v), 1) for v in xyxy],
                }
            )

    status, reason = evaluate(class_ids)
    print(
        json.dumps(
            {
                "model_name": "Deep Learning obstacle detector",
                "status": status,
                "reason": reason,
                "detections": detections,
                "latency_ms": round(latency_ms, 1),
                "preprocessing": [
                    {
                        "name": "Input resizing",
                        "description": "The image is resized and padded before inference.",
                    },
                    {
                        "name": "Object detection",
                        "description": "The model detects barrier_open, barrier_closed, and obstacle classes.",
                    },
                    {
                        "name": "Rule engine",
                        "description": "Detections are converted into a SAFE or DANGER crossing verdict.",
                    },
                ],
            }
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        raise
