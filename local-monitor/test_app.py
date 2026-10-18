from __future__ import annotations

import importlib.util
from pathlib import Path

import cv2
import numpy as np
from fastapi.testclient import TestClient


MODULE_PATH = Path(__file__).with_name("app.py")
spec = importlib.util.spec_from_file_location("local_monitor_app", MODULE_PATH)
assert spec and spec.loader
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)


def test_point_in_polygon_accepts_inside_and_rejects_outside() -> None:
    polygon = [[0, 0], [100, 0], [100, 100], [0, 100]]
    assert app_module.point_in_polygon((50, 50), polygon)
    assert not app_module.point_in_polygon((101, 50), polygon)


def test_white_hardhat_authorizes_person() -> None:
    frame = np.full((200, 200, 3), 20, dtype=np.uint8)
    frame[20:50, 80:120] = (255, 255, 255)
    assert app_module.white_supervisor([50, 20, 150, 180], [[80, 20, 120, 50]], frame)


def test_colored_hardhat_does_not_authorize_person() -> None:
    frame = np.full((200, 200, 3), 20, dtype=np.uint8)
    frame[20:50, 80:120] = (0, 255, 255)  # yellow BGR
    assert not app_module.white_supervisor([50, 20, 150, 180], [[80, 20, 120, 50]], frame)


class FakeBoxes:
    # Both person and hardhat sit within Power Station A (rightmost 32%).
    xyxy = type("Tensor", (), {"cpu": lambda self: self, "tolist": lambda self: [[225, 30, 285, 190], [240, 35, 270, 60]]})()
    conf = type("Tensor", (), {"cpu": lambda self: self, "tolist": lambda self: [0.99, 0.99]})()
    cls = type("Tensor", (), {"cpu": lambda self: self, "tolist": lambda self: [5, 0]})()


class FakeModel:
    def __call__(self, _frame: np.ndarray, verbose: bool = False):
        result = type("Result", (), {"boxes": FakeBoxes(), "names": {0: "Hardhat", 5: "Person"}})()
        return [result]


def fake_model_for(rows: list[tuple[list[float], float, int]], names: dict[int, str]):
    class Tensor:
        def __init__(self, values):
            self.values = values

        def cpu(self):
            return self

        def tolist(self):
            return self.values

    class Model:
        def __call__(self, _frame: np.ndarray, verbose: bool = False):
            boxes = type("Boxes", (), {
                "xyxy": Tensor([row[0] for row in rows]),
                "conf": Tensor([row[1] for row in rows]),
                "cls": Tensor([row[2] for row in rows]),
            })()
            return [type("Result", (), {"boxes": boxes, "names": names})()]

    return Model()


def test_analyze_raises_critical_alert_for_unauthorized_power_station_entry(monkeypatch) -> None:
    monkeypatch.setattr(app_module, "get_model", lambda: FakeModel())
    client = TestClient(app_module.app)
    frame = np.full((240, 320, 3), 20, dtype=np.uint8)
    frame[35:60, 240:270] = (0, 255, 255)  # non-white hardhat
    ok, encoded = cv2.imencode(".jpg", frame)
    assert ok
    response = client.post("/analyze?camera_id=CAM-1", files={"image": ("frame.jpg", encoded.tobytes(), "image/jpeg")})
    assert response.status_code == 200
    body = response.json()
    assert body["buzzer"] is True
    assert body["alerts"][0]["type"] == "unauthorised-danger-zone-entry"


def test_analyze_rejects_invalid_image() -> None:
    client = TestClient(app_module.app)
    response = client.post("/analyze?camera_id=CAM-1", files={"image": ("bad.jpg", b"not-an-image", "image/jpeg")})
    assert response.status_code == 400


def test_white_supervisor_in_danger_zone_is_not_alerted(monkeypatch) -> None:
    model = fake_model_for(
        [([225, 30, 285, 190], 0.99, 5), ([240, 35, 270, 60], 0.99, 0)],
        {0: "Hardhat", 5: "Person"},
    )
    monkeypatch.setattr(app_module, "get_model", lambda: model)
    frame = np.full((240, 320, 3), 20, dtype=np.uint8)
    frame[35:60, 240:270] = (255, 255, 255)
    ok, encoded = cv2.imencode(".jpg", frame)
    assert ok
    response = TestClient(app_module.app).post(
        "/analyze?camera_id=CAM-1", files={"image": ("frame.jpg", encoded.tobytes(), "image/jpeg")},
    )
    assert response.status_code == 200
    assert response.json()["alerts"] == []
    assert response.json()["buzzer"] is False


def test_machine_proximity_and_ppe_rules_raise_alerts(monkeypatch) -> None:
    model = fake_model_for(
        [([90, 30, 150, 190], 0.99, 5), ([120, 40, 190, 190], 0.99, 8), ([90, 30, 150, 190], 0.98, 4)],
        {4: "NO-Safety Vest", 5: "Person", 8: "machinery"},
    )
    monkeypatch.setattr(app_module, "get_model", lambda: model)
    ok, encoded = cv2.imencode(".jpg", np.full((240, 320, 3), 20, dtype=np.uint8))
    assert ok
    response = TestClient(app_module.app).post(
        "/analyze?camera_id=CAM-2", files={"image": ("frame.jpg", encoded.tobytes(), "image/jpeg")},
    )
    assert response.status_code == 200
    assert {alert["type"] for alert in response.json()["alerts"]} == {"person-machine-proximity", "ppe-violation"}
