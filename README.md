# SiteSentry Integrated

This is a safe, staged integration of the upstream Visionnaire Flutter client
with the Construction Hazard Detection engine. The original `sitescentry`
directory is unchanged. Each upstream project remains an independent Git
checkout so its provenance and updates stay traceable.

## Layout

* `visionnaire-client/` — **primary UI**: the upstream Flutter client for
  live-stream overlays, violation records, notifications, documents, and
  role-based safety operations.
* `hazard-engine/` — upstream YOLO, RTSP, MediaMTX, PostgreSQL and Redis
  pipeline from `yihong1120/Construction-Hazard-Detection`.
* `dashboard/` — retained React prototype and Node inference bridge. It is a
  migration reference, not the primary application UI.
* `training/` — documentation for the supplied Construction PPE dataset.

## What works now

The dashboard runs independently, keeps live phone-to-dashboard WebRTC, and
has an `/api/inference` bridge that posts a captured image to the upstream
FastAPI `/detect` endpoint. The bridge normalizes bounding boxes and creates
real dashboard alerts for the PPE dataset's `no_helmet`, `no_goggle`,
`no_gloves`, and `no_boots` labels.

The bridge requires a valid JWT because the upstream `/detect` endpoint is
intentionally protected. It does not bypass the engine's authentication.

## Run the primary Flutter client

Install Flutter 3.44 or newer and JDK 17, then follow the upstream client
bootstrap process:

```powershell
cd visionnaire-client
flutter pub get
```

Copy the safe configuration templates described in
`visionnaire-client/README.md`, set this deployment's BFF/API values, then use
the provided wrapper to run or build. The upstream Flutter client deliberately
does not carry a working production endpoint, Firebase project, OAuth client,
or signing material.

## Run the retained React prototype

In one terminal:

```powershell
cd dashboard\backend
npm install
npm run dev
```

In another terminal:

```powershell
cd dashboard
npm install
npm run dev
```

Open the Vite URL, and open `/camera-source` on a phone or a second browser
for the existing WebRTC demo. The Vite development proxy sends `/api` and
`/socket.io` to port 5000.

## Connect the Flutter UI to real inference

1. Follow `hazard-engine/README.md` to prepare its Python environment, model
   registry, OIDC settings and detection API.
2. Configure the Flutter client's BFF/API contracts under
   `visionnaire-client/lib/services/` for your deployment. The client requires
   backend services; it does not embed backend credentials or endpoints.
3. The retained React bridge is useful for development snapshots only. It is
   not required by the primary Flutter client.

For continuous RTSP cameras, use `hazard-engine/main.py` rather than posting
browser frames. It owns RTSP ingest, shared YOLO workers, MediaMTX publishing,
Redis coordination, PostgreSQL records, and production notification services.

## Dataset

The supplied NDJSON manifest is external to this folder and was deliberately
not copied: it contains signed image URLs, not the full image archive. See
`training/README.md` before training.

## Safety and production gaps

Before a production launch, provide your own authenticated BFF, OIDC/Firebase
configuration, database migration plan, media gateway and mobile signing
identity. Also review the upstream AGPL-3.0 engine licence and the Flutter
client's GPL-2.0-only licence, along with its branding restrictions, before
distributing a combined deployment.
