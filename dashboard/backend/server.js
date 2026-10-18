import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 5000;
const HAZARD_ENGINE_URL = (process.env.HAZARD_ENGINE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const HAZARD_ENGINE_TOKEN = process.env.HAZARD_ENGINE_TOKEN || "";
const HAZARD_ENGINE_MODEL = process.env.HAZARD_ENGINE_MODEL || "ppe";

// The PPE benchmark used by this project has its own class map. Keep this
// mapping here (instead of borrowing a map from a different YOLO model) so
// alerts always describe the model that produced them.
const PPE_CLASS_NAMES = {
  0: "helmet", 1: "gloves", 2: "vest", 3: "boots", 4: "goggles",
  5: "none", 6: "Person", 7: "no_helmet", 8: "no_goggle",
  9: "no_gloves", 10: "no_boots"
};
const PPE_VIOLATION_CLASSES = new Set([7, 8, 9, 10]);

app.use(cors());
app.use(express.json());

// In-memory data store
let cameras = [
  { id: "CAM-MOBILE-001", name: "Mobile Construction CCTV", location: "Construction Site — Demo Area", status: "offline", zone: "Zone B", detections: 0, source: "MOBILE_WEBRTC" },
  { id: "CAM-001", name: "Warehouse - CAM-A01", location: "Zone A - Main Yard", status: "online", zone: "Zone A", detections: 4 },
  { id: "CAM-002", name: "Loading Bay - CAM-B02", location: "Zone B - Warehouse", status: "online", zone: "Zone B", detections: 2 },
  { id: "CAM-003", name: "Restricted Area - CAM-C03", location: "Zone C - Chemical Storage", status: "warning", zone: "Zone C", detections: 7 }
];

let alerts = [];
let incidents = [];
let totalDetections = 0;
let mobileCameraActive = false;

// --- SOCKET.IO WebRTC & Real-time Events ---
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // WebRTC Signaling
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });
  
  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("request-offer", () => {
    socket.broadcast.emit("request-offer");
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });

  // Mobile Camera State
  socket.on("mobile-camera-status", (status) => {
    const cam = cameras.find(c => c.id === "CAM-MOBILE-001");
    if (cam) {
      cam.status = status;
      mobileCameraActive = (status === "online");
      io.emit("camera_updated", cam);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- AI DEMO SIMULATION ENGINE ---
// Periodically generates simulated safety events if the mobile camera is active
setInterval(() => {
  if (!mobileCameraActive) return;

  const scenarios = [
    { type: "PPE Violation", rule: "No Helmet detected on worker", priority: "HIGH", risk: "HIGH" },
    { type: "PPE Violation", rule: "No Safety Vest detected", priority: "HIGH", risk: "HIGH" },
    { type: "Restricted Zone", rule: "Person enters restricted zone", priority: "CRITICAL", risk: "CRITICAL" },
    { type: "Proximity Risk", rule: "Worker too close to machinery", priority: "HIGH", risk: "HIGH" },
    { type: "Fall Hazard", rule: "Possible fall/unsafe position", priority: "CRITICAL", risk: "CRITICAL" }
  ];

  // 10% chance to generate an event every 2 seconds
  if (Math.random() < 0.1) {
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const alertId = `ALT-M${Math.floor(100 + Math.random() * 900)}`;
    
    const newAlert = {
      id: alertId,
      type: scenario.type,
      title: `${scenario.type} — ${scenario.rule}`,
      location: "Construction Site — Demo Area",
      camera: "CAM-MOBILE-001",
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      priority: scenario.priority,
      status: "NEW",
      description: `[SIMULATED DEMO EVENT] ${scenario.rule}`,
      risk: scenario.risk
    };

    alerts.unshift(newAlert);
    
    // Broadcast the alert
    io.emit("alert_created", newAlert);
    
    // Update stats
    totalDetections += 1;
    const cam = cameras.find(c => c.id === "CAM-MOBILE-001");
    if (cam) {
      cam.detections += 1;
      io.emit("camera_updated", cam);
    }
    
    io.emit("stats_updated", {
      activeAlerts: alerts.filter(a => a.status !== "DISMISSED" && a.status !== "RESOLVED").length,
      todayIncidents: incidents.length,
      siteRisk: scenario.risk
    });
  }
}, 2000);


// --- REST APIs ---
app.get("/api/dashboard", (req, res) => {
  res.json({
    activeCameras: cameras.filter(c => c.status === "online").length,
    totalCameras: cameras.length,
    activeAlerts: alerts.filter(a => a.status !== "DISMISSED" && a.status !== "RESOLVED").length,
    todayIncidents: incidents.length,
    siteRisk: alerts.some(a => a.priority === "CRITICAL" && a.status !== "RESOLVED") ? "CRITICAL" : "LOW",
    cameras,
    recentAlerts: alerts.slice(0, 3)
  });
});

app.get("/api/cameras", (req, res) => res.json(cameras));
app.get("/api/cameras/:id", (req, res) => res.json(cameras.find(c => c.id === req.params.id)));
app.get("/api/alerts", (req, res) => res.json(alerts));
app.get("/api/incidents", (req, res) => res.json(incidents));

// Health/status data consumed by the Detection screen. It deliberately does
// not claim the remote engine is healthy unless its /docs endpoint responds.
app.get("/api/detection", async (req, res) => {
  let engineOnline = false;
  try {
    const response = await fetch(`${HAZARD_ENGINE_URL}/docs`, {
      signal: AbortSignal.timeout(1500)
    });
    engineOnline = response.ok;
  } catch {
    // Development can continue with the dashboard while the Python service is off.
  }
  res.json({
    activeDetectionsCount: 0,
    ppeCompliance: null,
    restrictedZoneBreaches: 0,
    engineOnline,
    engineUrl: HAZARD_ENGINE_URL,
    model: HAZARD_ENGINE_MODEL
  });
});

// Browser clients post a JPEG/PNG as base64. The bridge sends a multipart
// request to the upstream FastAPI detector and emits persistent dashboard
// alerts for missing-PPE labels. A production deployment should replace the
// in-memory arrays with PostgreSQL and authenticate this endpoint.
app.post("/api/inference", async (req, res) => {
  const { imageBase64, filename = "frame.jpg" } = req.body || {};
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
    return res.status(400).json({ message: "imageBase64 must be a data:image URL" });
  }
  if (!HAZARD_ENGINE_TOKEN) {
    return res.status(503).json({ message: "HAZARD_ENGINE_TOKEN is not configured" });
  }

  try {
    const [, encoded] = imageBase64.split(",", 2);
    const contentType = imageBase64.slice(5, imageBase64.indexOf(";"));
    const image = Buffer.from(encoded, "base64");
    if (image.length === 0 || image.length > 20 * 1024 * 1024) {
      return res.status(413).json({ message: "Image must be between 1 byte and 20 MB" });
    }

    const form = new FormData();
    form.append("model", HAZARD_ENGINE_MODEL);
    form.append("image", new Blob([image], { type: contentType }), filename);
    const upstream = await fetch(`${HAZARD_ENGINE_URL}/detect`, {
      method: "POST",
      headers: { Authorization: `Bearer ${HAZARD_ENGINE_TOKEN}` },
      body: form,
      signal: AbortSignal.timeout(30_000)
    });
    if (!upstream.ok) {
      return res.status(502).json({ message: "Hazard engine rejected inference", detail: await upstream.text() });
    }

    const rawDetections = await upstream.json();
    const detections = rawDetections.map(([x1, y1, x2, y2, confidence, classId]) => ({
      box: { x1, y1, x2, y2 }, confidence, classId, label: PPE_CLASS_NAMES[classId] || `class_${classId}`
    }));
    const violations = detections.filter(({ classId }) => PPE_VIOLATION_CLASSES.has(classId));

    for (const violation of violations) {
      const alert = {
        id: `ALT-AI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: "PPE Violation",
        title: `PPE violation — ${violation.label.replace("_", " ")}`,
        location: "Unassigned camera location",
        camera: "Unassigned camera",
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        priority: "HIGH", status: "NEW", risk: "HIGH",
        description: `Model ${HAZARD_ENGINE_MODEL}: ${violation.label} (${Math.round(violation.confidence * 100)}%)`
      };
      alerts.unshift(alert);
      totalDetections += 1;
      io.emit("alert_created", alert);
    }
    io.emit("stats_updated", {
      activeAlerts: alerts.filter(a => !["DISMISSED", "RESOLVED"].includes(a.status)).length,
      todayIncidents: incidents.length,
      siteRisk: violations.length ? "HIGH" : "LOW"
    });
    res.json({ detections, violations, engine: HAZARD_ENGINE_MODEL });
  } catch (error) {
    res.status(502).json({ message: "Hazard engine is unavailable", detail: error.message });
  }
});

app.patch("/api/alerts/:id", (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ message: "Alert not found" });

  if (req.body.status) alert.status = req.body.status;

  if (req.body.status === "ESCALATED" && !incidents.find(i => i.relatedAlert === alert.id)) {
    const inc = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      relatedAlert: alert.id,
      title: alert.title,
      location: alert.location,
      time: alert.time,
      assignedUser: "Supervisor",
      status: "OPEN",
      summary: alert.description
    };
    incidents.unshift(inc);
    io.emit("incident_created", inc);
  }

  io.emit("alert_updated", alert);
  res.json(alert);
});

app.patch("/api/incidents/:id", (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Incident not found" });
  if (req.body.status) incident.status = req.body.status;
  io.emit("incident_updated", incident);
  res.json(incident);
});

app.get("/api/analytics", (req, res) => {
  res.json({
    totalDetections,
    totalAlerts: alerts.length,
    resolvedIncidents: incidents.filter(i => i.status === "RESOLVED").length,
    detectionPrecision: 94,
    falseAlertRate: 5
  });
});

// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`SiteSentry Backend running at http://0.0.0.0:${PORT}`);
});
