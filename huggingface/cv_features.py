from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np


CLASS_NAMES = {0: "safe", 1: "danger"}


def cv_hog(gray: np.ndarray) -> np.ndarray:
    from skimage.feature import hog

    return hog(
        gray,
        orientations=9,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
        feature_vector=True,
    ).astype(np.float32)


def uniform_lbp_histogram(gray: np.ndarray) -> np.ndarray:
    from skimage.feature import local_binary_pattern

    lbp = local_binary_pattern(gray, P=8, R=1, method="uniform")
    lbp_hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, 11), range=(0, 10))
    lbp_hist = lbp_hist.astype(np.float32)
    lbp_hist /= lbp_hist.sum() + 1e-8
    return lbp_hist


def extract_features(image_path: Path, image_size: int = 128) -> np.ndarray:
    image_bytes = np.fromfile(str(image_path), dtype=np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    image = cv2.resize(image, (image_size, image_size), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    hog_features = cv_hog(gray)

    hist_h = cv2.calcHist([hsv], [0], None, [16], [0, 180]).flatten()
    hist_s = cv2.calcHist([hsv], [1], None, [16], [0, 256]).flatten()
    hist_v = cv2.calcHist([hsv], [2], None, [16], [0, 256]).flatten()
    color_hist = np.concatenate([hist_h, hist_s, hist_v]).astype(np.float32)
    color_hist /= color_hist.sum() + 1e-8

    lbp_hist = uniform_lbp_histogram(gray)

    edges = cv2.Canny(gray, threshold1=80, threshold2=160)
    edge_density = np.array([np.count_nonzero(edges) / edges.size], dtype=np.float32)

    return np.concatenate([hog_features, color_hist, lbp_hist, edge_density]).astype(np.float32)
