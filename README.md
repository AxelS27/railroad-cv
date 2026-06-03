# Railroad CV

Railroad CV is a railway level-crossing safety demo that analyzes an uploaded crossing frame and returns a direct `SAFE` or `DANGER` verdict.

**Website:** [railroadcv.vercel.app](https://railroadcv.vercel.app)  
**Inference API:** [axels27-railroad-cv-api.hf.space](https://axels27-railroad-cv-api.hf.space)

<img src="apps/web/src/app/icon.png" alt="Railroad CV icon" width="120" />

## Overview

The project is built for a Computer Vision assignment around obstacle detection at railway crossings. Users upload an image from a crossing scene, choose a model, and receive a clear safety verdict.

The frontend is intentionally simple: upload frame, choose model, inspect result. The model and preprocessing explanation live on the Model page so the Home page stays focused on inference.

## Highlights

- Image upload flow for railway crossing frames.
- Two inference modes: Classic ML and Deep Learning.
- Classic ML is the default model option.
- Direct `SAFE` or `DANGER` result instead of noisy technical output.
- Model page documents the computer vision preprocessing pipeline.
- Hugging Face Space backend for hosted inference.
- Vercel static deployment for the web app.

## Model Pipeline

### Classic ML

The selected classic model is **Hist Gradient Boosting**.

Classic ML preprocessing:

1. Resize image to `128 x 128`.
2. Convert image to grayscale and HSV.
3. Extract HOG shape features.
4. Extract HSV color histograms.
5. Extract uniform LBP texture features.
6. Extract Canny edge density.
7. Concatenate the feature vector.
8. Classify the frame as `SAFE` or `DANGER`.

The current model artifact comes from:

```text
D:\Binus-Projects\model-compvis\outputs_final\best_model.pkl
```

### Deep Learning

The deep learning model uses YOLO-style object detection from:

```text
D:\Binus-Projects\obstacle-detection\website\backend\models\best.pt
```

Detected classes are converted into a safety verdict:

- `barrier_open` -> `SAFE`
- `barrier_closed` + `obstacle` -> `DANGER`
- `barrier_closed` without obstacle -> `SAFE`
- no significant detection -> `SAFE`

## Tech Stack

- **Monorepo:** pnpm, Turborepo, TypeScript
- **Frontend:** Next.js App Router, React, Tailwind CSS
- **Backend:** Hono for local API structure, FastAPI for Hugging Face Space
- **Validation:** Zod shared contracts in `packages/types`
- **Deployment:** Vercel for web, Hugging Face Space for inference

## Project Structure

```text
apps/
  web/        Next.js frontend
  server/     Local Hono API wrapper
packages/
  types/      Shared Zod schemas and TypeScript types
  ui/         Shared UI package
  utils/      Shared utilities
huggingface/  Docker Space API and model handoff workspace
code/         Notebook used for project work
test_images.zip
```

## API Contract

The hosted API accepts multipart image uploads:

```http
POST /api/v1/detect
Content-Type: multipart/form-data

file=<image>
modelType=classic_ml | deep_learning
```

Example response:

```json
{
  "data": {
    "job_id": "uuid",
    "filename": "crossing.jpg",
    "model_type": "classic_ml",
    "model_name": "Classic CV Hist Gradient Boosting",
    "status": "SAFE",
    "reason": "Hist Gradient Boosting classified the frame as safe.",
    "latency_ms": 46.9,
    "kind": "image",
    "confidence": 0.999,
    "detections": []
  }
}
```

Health check:

```bash
curl https://axels27-railroad-cv-api.hf.space/api/v1/health
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the web app:

```bash
pnpm --filter @repo/web dev
```

Run the local server:

```bash
pnpm --filter @repo/server dev
```

Run everything through Turborepo:

```bash
pnpm dev
```

## Environment Variables

For the frontend, set:

```text
NEXT_PUBLIC_API_BASE_URL=https://axels27-railroad-cv-api.hf.space/api/v1
```

In development, the frontend falls back to:

```text
http://localhost:4000/api/v1
```

In production, the app intentionally fails with a clear error if `NEXT_PUBLIC_API_BASE_URL` is not configured.

## Hugging Face Space

The `huggingface/` folder contains the Space runtime:

```text
huggingface/
  app.py
  cv_features.py
  Dockerfile
  requirements.txt
  models/
```

Required model files inside the Space:

```text
models/
  best_model.pkl
  best.pt
```

The GitHub repo does not need to bundle large model weights for normal web deployment. The Space hosts the inference runtime and model files.

## Verification

Useful checks before deployment:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @repo/web build
```

The Vercel build uses:

```bash
pnpm --filter @repo/web build
```

and exports static output from:

```text
apps/web/out
```

## Status

Live demo with hosted inference. Classic ML currently uses Hist Gradient Boosting as the default model, while the deep learning option uses the YOLO detector artifact.
