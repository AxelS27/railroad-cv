from __future__ import annotations

import tempfile
import time
from pathlib import Path
from typing import Literal
from uuid import uuid4

import cv2
import joblib
import numpy as np
import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from ultralytics import YOLO

from cv_features import CLASS_NAMES, extract_features


ROOT = Path(__file__).resolve().parent
MODELS_DIR = ROOT / "models"
CLASSIC_MODEL_PATH = MODELS_DIR / "best_model.pkl"
DL_MODEL_PATH = MODELS_DIR / "best.pt"
CONF_THRESHOLD = 0.4
CLASSIC_MODEL_ARTIFACT = "model-compvis/outputs_final/best_model.pkl"

DetectModelType = Literal["classic_ml", "deep_learning"]

CLASS_BARRIER_OPEN = 0
CLASS_BARRIER_CLOSED = 1
CLASS_OBSTACLE = 2
NAME_BY_CLASS = {
    CLASS_BARRIER_OPEN: "barrier_open",
    CLASS_BARRIER_CLOSED: "barrier_closed",
    CLASS_OBSTACLE: "obstacle",
}


class Detection(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    class_: str = Field(alias="class")
    class_id: int
    confidence: float
    bbox: list[float]


class PreprocessingStep(BaseModel):
    name: str
    description: str


class DetectResponse(BaseModel):
    job_id: str
    filename: str
    model_type: DetectModelType
    model_name: str
    status: Literal["DANGER", "SAFE"]
    reason: str
    latency_ms: float
    kind: Literal["image"] = "image"
    confidence: float | None = None
    detections: list[Detection] = Field(default_factory=list)
    preprocessing: list[PreprocessingStep] = Field(default_factory=list)


app = FastAPI(title="Railroad CV API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

classic_bundle: dict | None = None
deep_learning_model: YOLO | None = None


@app.get("/")
def root():
    return {"data": {"service": "railroad-cv-api", "status": "ok"}}


@app.get("/api/v1/health")
def health():
    return {
        "data": {
            "status": "ok",
            "classic_ml_model": CLASSIC_MODEL_PATH.exists(),
            "classic_ml_artifact": CLASSIC_MODEL_ARTIFACT,
            "deep_learning_model": DL_MODEL_PATH.exists(),
        }
    }


@app.post("/api/v1/detect")
async def detect(
    file: UploadFile = File(...),
    modelType: DetectModelType = Form("classic_ml"),
):
    suffix = Path(file.filename or "upload.jpg").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".bmp"}:
        raise HTTPException(status_code=400, detail="Use a JPG, PNG, WEBP, or BMP image.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Upload one image file to analyze.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(image_bytes)
        image_path = Path(temp_file.name)

    try:
        if modelType == "deep_learning":
            result = run_deep_learning(image_path, file.filename or image_path.name)
        else:
            result = run_classic_ml(image_path, file.filename or image_path.name)
    finally:
        image_path.unlink(missing_ok=True)

    return {"data": result.model_dump(by_alias=True)}


def run_classic_ml(image_path: Path, filename: str) -> DetectResponse:
    global classic_bundle

    if not CLASSIC_MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="Classic ML model is missing. Upload models/best_model.pkl to the Hugging Face Space.",
        )

    if classic_bundle is None:
        try:
            classic_bundle = joblib.load(CLASSIC_MODEL_PATH)
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Classic ML model could not be loaded: {exc}",
            ) from exc

    model = classic_bundle["model"]
    metadata = classic_bundle.get("metadata", {})
    image_size = int(metadata.get("image_size", 128))
    selected_key = metadata.get("best_by_cv_danger_f1")
    display_names = metadata.get("model_display_names", {})
    model_display = display_names.get(selected_key, selected_key or type(model).__name__)

    started = time.perf_counter()
    features = extract_features(image_path, image_size=image_size).reshape(1, -1)
    prediction = int(model.predict(features)[0])
    latency_ms = (time.perf_counter() - started) * 1000

    label = CLASS_NAMES[prediction]
    confidence = None
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        confidence = round(float(probabilities[prediction]), 3)

    return DetectResponse(
        job_id=str(uuid4()),
        filename=filename,
        model_type="classic_ml",
        model_name=f"Classic CV {model_display}",
        status="DANGER" if label == "danger" else "SAFE",
        reason=(
            f"{model_display} classified the frame as danger."
            if label == "danger"
            else f"{model_display} classified the frame as safe."
        ),
        latency_ms=round(latency_ms, 1),
        confidence=confidence,
        detections=[],
        preprocessing=[
            PreprocessingStep(name="Resize", description=f"Image is resized to {image_size} x {image_size} pixels."),
            PreprocessingStep(name="HOG", description="Shape gradients are extracted from the grayscale frame."),
            PreprocessingStep(name="HSV histogram", description="Color distribution is encoded from HSV channels."),
            PreprocessingStep(name="Uniform LBP", description="Texture patterns are summarized with local binary patterns."),
            PreprocessingStep(name="Canny edge density", description="Edge density is added as a compact spatial feature."),
        ],
    )


def run_deep_learning(image_path: Path, filename: str) -> DetectResponse:
    global deep_learning_model

    if not DL_MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="Deep learning model is missing. Upload models/best.pt to the Hugging Face Space.",
        )

    image_bytes = np.fromfile(str(image_path), dtype=np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Could not decode uploaded image.")

    if deep_learning_model is None:
        deep_learning_model = YOLO(str(DL_MODEL_PATH))

    device = 0 if torch.cuda.is_available() else "cpu"
    half = torch.cuda.is_available()

    started = time.perf_counter()
    results = deep_learning_model.predict(
        image,
        conf=CONF_THRESHOLD,
        device=device,
        half=half,
        verbose=False,
    )
    latency_ms = (time.perf_counter() - started) * 1000

    detections: list[Detection] = []
    class_ids: list[int] = []
    boxes = results[0].boxes
    if boxes is not None and len(boxes) > 0:
        for cls, conf, xyxy in zip(boxes.cls.tolist(), boxes.conf.tolist(), boxes.xyxy.tolist()):
            class_id = int(cls)
            class_ids.append(class_id)
            detections.append(
                Detection(
                    class_=NAME_BY_CLASS.get(class_id, "unknown"),
                    class_id=class_id,
                    confidence=round(float(conf), 3),
                    bbox=[round(float(value), 1) for value in xyxy],
                )
            )

    status, reason = evaluate_deep_learning(class_ids)
    return DetectResponse(
        job_id=str(uuid4()),
        filename=filename,
        model_type="deep_learning",
        model_name="Deep Learning obstacle detector",
        status=status,
        reason=reason,
        latency_ms=round(latency_ms, 1),
        detections=detections,
        preprocessing=[
            PreprocessingStep(name="Input resizing", description="The image is resized and padded before inference."),
            PreprocessingStep(name="Object detection", description="The model detects crossing barrier and obstacle classes."),
            PreprocessingStep(name="Rule engine", description="Detections are converted into a SAFE or DANGER verdict."),
        ],
    )


def evaluate_deep_learning(class_ids: list[int]) -> tuple[Literal["DANGER", "SAFE"], str]:
    if CLASS_BARRIER_OPEN in class_ids:
        return "SAFE", "Barrier open, no train incoming"
    if CLASS_BARRIER_CLOSED in class_ids and CLASS_OBSTACLE in class_ids:
        return "DANGER", "Obstacle on tracks while barrier closed"
    if CLASS_BARRIER_CLOSED in class_ids:
        return "SAFE", "Barrier closed, tracks clear"
    return "SAFE", "No significant detection"
