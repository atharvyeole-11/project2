"""Local-only camera-frame hazard analysis service.

Run with:
  set YOLO_CONFIG_DIR=%CD%
  ..\\.venv\\Scripts\\python -m uvicorn app:app --host 127.0.0.1 --port 8010

The service never sends frames outside the computer. It receives a JPEG/PNG
from a local camera gateway, evaluates safety rules, and returns detections and
alert events for the supervisor console.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((Path(__file__).with_name("config.json")).read_text())
MODEL_PATH = ROOT / "hazard-engine" / "models" / "yolo11" / "pt" / "yolo11n.pt"
os.environ.setdefault("YOLO_CONFIG_DIR", str(ROOT / ".yolo-config"))

app = FastAPI(title="SiteSentry Local Monitor", docs_url="/docs")
model: YOLO | None = None


def get_model() -> YOLO:
    global model
    if model is None:
        if not MODEL_PATH.exists():
            raise RuntimeError(f"Model is missing: {MODEL_PATH}")
        model = YOLO(str(MODEL_PATH))
    return model


def center(box: list[float]) -> tuple[float, float]:
    return ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)


def point_in_polygon(point: tuple[float, float], polygon: list[list[float]]) -> bool:
    return cv2.pointPolygonTest(np.asarray(polygon, dtype=np.float32), point, False) >= 0


def normalized_polygon(zone: dict[str, Any], width: int, height: int) -> list[list[float]]:
    return [[x * width, y * height] for x, y in zone["polygon"]]


def white_supervisor(person: list[float], hardhats: list[list[float]], frame: np.ndarray) -> bool:
    """Allow only a white hardhat associated with the top of this person box.

    This intentionally treats an unclassified/hidden hardhat as unauthorised:
    the safer failure mode around an energized area is to warn the supervisor.
    """
    px1, py1, px2, py2 = person
    for hx1, hy1, hx2, hy2 in hardhats:
        hx, hy = center([hx1, hy1, hx2, hy2])
        if not (px1 <= hx <= px2 and py1 <= hy <= py1 + (py2 - py1) * 0.38):
            continue
        crop = frame[max(0, int(hy1)):int(hy2), max(0, int(hx1)):int(hx2)]
        if crop.size == 0:
            continue
        hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
        # White has low saturation and high brightness; configurable in a later
        # calibration pass for the actual site's lighting and hardhat material.
        white_ratio = np.mean((hsv[:, :, 1] < 55) & (hsv[:, :, 2] > 170))
        if white_ratio >= 0.45:
            return True
    return False


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": MODEL_PATH.exists(), "model": str(MODEL_PATH), "zones": CONFIG["danger_zones"]}


@app.post("/analyze")
async def analyze(camera_id: str, image: UploadFile = File(...)) -> dict[str, Any]:
    raw = await image.read()
    if not raw or len(raw) > 20 * 1024 * 1024:
        raise HTTPException(400, "Provide an image smaller than 20 MB")
    frame = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(400, "Invalid image")
    result = get_model()(frame, verbose=False)[0]
    names = result.names
    detected: list[dict[str, Any]] = []
    for box, confidence, label_id in zip(result.boxes.xyxy.cpu().tolist(), result.boxes.conf.cpu().tolist(), result.boxes.cls.cpu().tolist(), strict=True):
        detected.append({"box": [round(v, 1) for v in box], "confidence": round(confidence, 3), "label": names[int(label_id)]})

    hardhats = [d["box"] for d in detected if d["label"] == "Hardhat"]
    people = [d for d in detected if d["label"] == "Person"]
    machines = [d for d in detected if d["label"] in {"machinery", "vehicle"}]
    height, width = frame.shape[:2]
    alerts: list[dict[str, Any]] = []
    for person in people:
        person_center = center(person["box"])
        for zone in CONFIG["danger_zones"]:
            polygon = normalized_polygon(zone, width, height)
            if point_in_polygon(person_center, polygon) and not white_supervisor(person["box"], hardhats, frame):
                alerts.append({"severity": "critical", "type": "unauthorised-danger-zone-entry", "camera_id": camera_id, "zone": zone["name"], "message": "Unauthorised worker in restricted power-station zone"})
        for machine in machines:
            if np.linalg.norm(np.subtract(person_center, center(machine["box"]))) < CONFIG["proximity_threshold_pixels"]:
                alerts.append({"severity": "high", "type": "person-machine-proximity", "camera_id": camera_id, "message": f"Person too close to {machine['label']}"})
    for d in detected:
        if d["label"] in {"NO-Hardhat", "NO-Safety Vest"}:
            alerts.append({"severity": "high", "type": "ppe-violation", "camera_id": camera_id, "message": d["label"]})
    return {"camera_id": camera_id, "detections": detected, "alerts": alerts, "buzzer": bool(alerts)}
