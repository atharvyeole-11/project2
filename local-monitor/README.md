# Local monitoring service

This service is the local rule engine for the basic supervisor console. It
uses the downloaded upstream YOLO11 construction-hazard model and does not
upload camera frames.

## Run

```powershell
cd C:\Users\athar\OneDrive\Documents\ChatGPT\New project\sitesentry-integrated
$env:YOLO_CONFIG_DIR = "$PWD\.yolo-config"
.\.venv\Scripts\python.exe -m uvicorn local-monitor.app:app --host 127.0.0.1 --port 8010
```

`GET /health` verifies the model. `POST /analyze?camera_id=CAM-001` accepts a
multipart `image` field and responds with detections, alerts, and a `buzzer`
boolean.

## Rules

* Red polygon: Power Station A, configured in `config.json`.
* A person in that zone triggers a critical alert unless their associated
  hardhat appears white.
* Person near machinery/vehicle triggers a high alert.
* Missing hardhat or safety vest triggers a high alert.

The zone polygon and proximity threshold must be calibrated from each real
camera view before relying on this system operationally.
