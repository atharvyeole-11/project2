# SiteSentry — AI Safety Intelligence Platform

SiteSentry is an AI-powered site safety operations platform for construction sites, industrial facilities, and manufacturing plants. It delivers real-time CCTV monitoring, computer vision hazard detection (PPE compliance, restricted zone intrusions, proximity risks), and incident response workflow management.

## Port & Rewrite Overview

This application was migrated to a high-performance React + TypeScript single-page application powered by Vite and Tailwind CSS.

### Core Features

1. **Safety Operations Center Dashboard (`/`)**
   - Real-time CCTV node feeds with status badges and AI detection metrics.
   - Live stream integration supporting mobile and device webcams.
   - Dynamic site risk index (Low, High, Critical) with automatic recalculation.
   - Unresolved safety alert queue with instant alert notifications.

2. **Camera Fleet Management (`/cameras`)**
   - Active CCTV node directory with status filtering (`all`, `online`, `warning`, `offline`) and search.
   - Real-time detection counters and zone assignment tags.
   - Dedicated Mobile CCTV Node gateway (`/camera-source`).

3. **Node Telemetry & Stream Viewer (`/cameras/:id`)**
   - High-definition live RTSP stream viewport with bounding box overlay markers.
   - Stream telemetry including FPS, resolution, codec, active objects, and PPE compliance score.
   - Manual hazard simulation action to test alarm dispatchers.

4. **Mobile CCTV Camera Mode (`/camera-source`)**
   - Turns any browser, mobile phone, or laptop webcam into a live CCTV node (`CAM-MOBILE-001`).
   - Supports camera switching (front/rear lens), start/stop streaming, and live recording indicators.

5. **AI Computer Vision Detection Canvas (`/detection`)**
   - Multi-class bounding box stream (Helmet OK, Missing Safety Vest violation, Forklift Machine).
   - Real-time event stream log displaying detected objects and timestamps.
   - Active detections count, compliance percentage, and restricted zone intrusion monitors.

6. **Alert Console & Review Workflow (`/alerts`)**
   - Dual-pane inspection workspace with captured evidence snapshot view.
   - Supervisor action buttons: **Acknowledge Alert**, **Escalate to Incident**, and **Dismiss**.
   - Escalating an alert automatically provisions a new Incident investigation record.

7. **Alert Audit History Table (`/alerts/table`)**
   - Filterable table of all detected safety warnings with priority filters (`CRITICAL`, `HIGH`, `MEDIUM`).

8. **Incident Investigation Management (`/incidents` & `/incidents/:id`)**
   - Comprehensive incident audit log with status badges (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
   - Incident case files with dual-frame evidence snapshots (Frame #1420 Detection Box, Frame #1425 Zoom Telemetry).
   - Investigation audit trail, status updates, and editable supervisor resolution notes.

9. **Interactive 3D Blueprint Site Map (`/site-map`)**
   - Isometric facility coordinate mesh with zone risk overlays.
   - Facility zone selector (`All`, `Main Yard`, `Warehouse`, `Chemical Storage`, `South Parking`).
   - Interactive camera pins with node inspector and direct stream access.

10. **Analytics & Performance Benchmarks (`/analytics`)**
    - Time-range filters (`24H`, `7D`, `30D`, `90D`).
    - Key metrics: Detection Precision (97%), False Alert Rate (2%), Avg Response Time (1m 38s), Resolution Rate (95%).
    - Categorized safety violations breakdown chart (Missing Helmet, No Safety Vest, Restricted Intrusion, Forklift Speeding).
    - One-click CSV export of complete safety analytics and logs.

11. **System & Safety Rule Settings (`/settings`)**
    - Toggle individual AI detection engines (PPE, Intrusion, Fire & Smoke, Crowd Evaluation, Proximity Warning, Auto-Escalation).
    - Adjustable AI confidence threshold slider (50% to 99%).

12. **Operations Center Authentication (`/login`)**
    - Supervisor login screen with industrial backdrop and demo credentials.

## Development & Build

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```
