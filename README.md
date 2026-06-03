# Railroad CV

Railroad CV is a Computer Vision project for railway level-crossing safety. The website analyzes a crossing image and returns a clear `SAFE` or `DANGER` verdict.

**Live Website:** [railroadcv.vercel.app](https://railroadcv.vercel.app)

<img src="apps/web/src/app/icon.png" alt="Railroad CV icon" width="120" />

## Overview

Railway crossings are high-risk areas where blocked tracks, closed barriers, and vehicle queues can quickly become dangerous. Railroad CV explores how image-based computer vision can help identify unsafe crossing conditions from a single uploaded frame.

The website keeps the experience simple: users upload a crossing image, choose a model, and receive a direct safety result. The goal is not to overwhelm users with raw model output, but to turn visual analysis into a readable decision.

## What The Website Does

- Accepts railway crossing images.
- Lets users compare a Classic ML model and a Deep Learning model.
- Returns a direct `SAFE` or `DANGER` result.
- Shows a short explanation for the prediction.
- Provides a dedicated Model page for the image processing flow.
- Uses a railway-themed interface based on the original Railroad CV concept.

## Computer Vision Focus

This project focuses on the full image analysis flow:

1. A railway crossing frame is uploaded.
2. The image is processed by the selected model.
3. The model identifies whether the scene is safe or dangerous.
4. The result is shown as a simple safety verdict.

The Model page presents the classic image processing stages visually, so the preprocessing flow can be understood without reading code.

## Model Options

### Classic ML

The Classic ML option is the default model. It uses a traditional computer vision pipeline and a trained classifier to decide whether the image should be labeled `SAFE` or `DANGER`.

This model is useful for explaining how handcrafted visual features can still support image classification tasks.

### Deep Learning

The Deep Learning option uses an object detection approach. It looks for important crossing-related objects such as barriers and obstacles, then converts the detections into a safety verdict.

This model is useful for showing how detection-based systems can reason from visible objects in the scene.

## Result Meaning

`SAFE` means the uploaded frame does not indicate a dangerous crossing condition based on the selected model.

`DANGER` means the uploaded frame indicates a possible unsafe condition, such as an obstacle or blocked crossing situation.

The result is designed to be direct because the main use case is safety monitoring, where the output needs to be readable quickly.

## Project Pages

- **Home** - upload an image, choose a model, and view the analysis result.
- **Model** - view the image processing and model explanation.
- **About** - read the project context and purpose.

## Status

Railroad CV is live as a project demo. The current version focuses on image upload, model selection, visual explanation, and direct crossing safety prediction.
