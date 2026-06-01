# Railroad CV Hugging Face API

Docker Space backend for the Railroad CV website.

## Required Model Files

Upload these files into the Space under `models/`:

```text
models/
  best_model.pkl  # classic ML bundle from model-compvis/outputs_clean/best_model.pkl
  best.pt         # deep learning YOLO weights from obstacle-detection
```

The `models/` folder is ignored in GitHub, so model weights stay out of the web repo.

## Space Settings

Create a new Hugging Face Space with:

```text
SDK: Docker
Root directory: huggingface
```

After the Space is running, test:

```bash
curl https://<username>-<space-name>.hf.space/api/v1/health
```

Expected shape:

```json
{
  "data": {
    "status": "ok",
    "classic_ml_model": true,
    "deep_learning_model": true
  }
}
```

## Website Environment

In Vercel, set:

```text
NEXT_PUBLIC_API_BASE_URL=https://<username>-<space-name>.hf.space/api/v1
```

Remove or ignore the old `VITE_API_URL`. The Next.js frontend only needs `NEXT_PUBLIC_API_BASE_URL`.

## API Contract

```http
POST /api/v1/detect
Content-Type: multipart/form-data

file=<image>
modelType=classic_ml | deep_learning
```

Response:

```json
{
  "data": {
    "job_id": "uuid",
    "filename": "crossing.jpg",
    "model_type": "classic_ml",
    "model_name": "Classic CV RBF SVM",
    "status": "SAFE",
    "reason": "RBF SVM classified the frame as safe.",
    "latency_ms": 42.1,
    "kind": "image",
    "detections": [],
    "preprocessing": []
  }
}
```
