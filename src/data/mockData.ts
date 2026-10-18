import { Camera, Alert, Incident, Zone, SettingsConfig, AnalyticsStats } from '../types';

export const initialCameras: Camera[] = [
  {
    id: "CAM-001",
    name: "Warehouse - CAM-A01",
    location: "Zone A - Main Yard",
    status: "online",
    zone: "Zone A",
    detections: 4,
    resolution: "1080p",
    fps: 30,
    image: "/assets/demo/person_did_not_wear_safety_vest.png",
    detectionsList: [
      {
        id: "det-1",
        label: "Worker - Helmet OK",
        confidence: 96,
        severity: "normal",
        timestamp: "10:42:10",
        box: { top: 18, left: 18, width: 26, height: 58 }
      },
      {
        id: "det-2",
        label: "Violation: Missing Safety Vest",
        confidence: 89,
        severity: "critical",
        timestamp: "10:42:15",
        box: { top: 28, left: 56, width: 28, height: 54 }
      }
    ]
  },
  {
    id: "CAM-002",
    name: "Loading Bay - CAM-B02",
    location: "Zone B - Warehouse",
    status: "online",
    zone: "Zone B",
    detections: 3,
    resolution: "1080p",
    fps: 30,
    image: "/assets/demo/person_near_machinery.jpg",
    detectionsList: [
      {
        id: "det-3",
        label: "Forklift Machine Active",
        confidence: 94,
        severity: "warning",
        timestamp: "10:35:00",
        box: { top: 32, left: 24, width: 34, height: 48 }
      },
      {
        id: "det-4",
        label: "Worker - Proximity Alert",
        confidence: 91,
        severity: "warning",
        timestamp: "10:35:12",
        box: { top: 22, left: 65, width: 22, height: 50 }
      }
    ]
  },
  {
    id: "CAM-003",
    name: "Restricted Area - CAM-C03",
    location: "Zone C - Chemical Storage",
    status: "warning",
    zone: "Zone C",
    detections: 7,
    resolution: "1080p",
    fps: 24,
    image: "/assets/demo/persons_in_restricted_zones.jpg",
    detectionsList: [
      {
        id: "det-5",
        label: "Unauthorized Entry Detected",
        confidence: 93,
        severity: "critical",
        timestamp: "10:38:00",
        box: { top: 20, left: 32, width: 36, height: 58 }
      }
    ]
  },
  {
    id: "CAM-MOBILE-001",
    name: "Mobile Construction CCTV",
    location: "Construction Site — Demo Area",
    status: "offline",
    zone: "Zone B",
    detections: 0,
    source: "MOBILE_WEBRTC",
    resolution: "1080p",
    fps: 30,
    image: "/assets/demo/yolov8_inference.jpg",
    detectionsList: [
      {
        id: "det-m1",
        label: "Mobile Optical Feed Active",
        confidence: 98,
        severity: "normal",
        timestamp: "Just now",
        box: { top: 15, left: 20, width: 45, height: 60 }
      }
    ]
  },
  {
    id: "CAM-004",
    name: "Parking & Logistics - CAM-D04",
    location: "Zone D - South Parking",
    status: "offline",
    zone: "Zone D",
    detections: 0,
    resolution: "720p",
    fps: 15,
    image: "/assets/demo/yolov8_inference.jpg"
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "PPE Violation",
    title: "PPE Violation — Missing Safety Vest on Worker",
    camera: "CAM-001",
    location: "Zone A - Main Yard",
    priority: "HIGH",
    status: "NEW",
    time: "10:42 AM",
    description: "YOLO11 flagged ground technician in active crane swing path without high-visibility vest.",
    risk: "HIGH",
    image: "/assets/demo/person_did_not_wear_safety_vest.png"
  },
  {
    id: "ALT-002",
    type: "Restricted Zone",
    title: "Restricted Zone — Unauthorized Perimeter Intrusion",
    camera: "CAM-003",
    location: "Zone C - Chemical Storage",
    priority: "CRITICAL",
    status: "ACKNOWLEDGED",
    time: "10:38 AM",
    description: "Target crossed toxic solvent containment boundary without Level 2 hazmat clearance badge.",
    risk: "CRITICAL",
    image: "/assets/demo/persons_in_restricted_zones.jpg"
  },
  {
    id: "ALT-003",
    type: "Proximity Hazard",
    title: "Proximity Hazard — Worker in Machinery Blindspot",
    camera: "CAM-002",
    location: "Zone B - Warehouse",
    priority: "HIGH",
    status: "NEW",
    time: "10:25 AM",
    description: "Pedestrian worker detected within 1.8m danger radius of reversing counterbalance forklift.",
    risk: "HIGH",
    image: "/assets/demo/person_near_machinery.jpg"
  },
  {
    id: "ALT-004",
    type: "Crowd Risk",
    title: "Crowd Risk — Egress Threshold Limit Exceeded",
    camera: "CAM-001",
    location: "Zone A - Main Yard",
    priority: "MEDIUM",
    status: "ASSIGNED",
    time: "10:14 AM",
    description: "Shift change density surge registered at Exit Corridor 3; safe throughput clearance delayed.",
    risk: "MEDIUM",
    image: "/assets/demo/yolov8_inference.jpg"
  }
];

export const initialIncidents: Incident[] = [
  {
    id: "INC-1001",
    relatedAlert: "ALT-001",
    alert: "ALT-001",
    title: "PPE Non-Compliance Breach — Crane Lift Sector",
    type: "PPE Violation",
    location: "Zone A - Main Yard",
    status: "OPEN",
    assignedUser: "Chief Supervisor Vance",
    assignedTo: "Chief Supervisor Vance",
    date: "18 Oct 2026",
    time: "10:42 AM",
    severity: "HIGH",
    summary: "Worker failed to wear safety vest prior to entering overhead crane exclusion perimeter. Audio alert emitted on-site; inspection logged."
  },
  {
    id: "INC-1002",
    relatedAlert: "ALT-002",
    alert: "ALT-002",
    title: "Chemical Storage Boundary Intrusion",
    type: "Restricted Zone",
    location: "Zone C - Chemical Storage",
    status: "IN_PROGRESS",
    assignedUser: "Tactical Response Unit A",
    assignedTo: "Tactical Response Unit A",
    date: "18 Oct 2026",
    time: "10:38 AM",
    severity: "CRITICAL",
    summary: "External contractor entered solvent holding bay without hazardous materials clearance. Gate lock triggered and patrol dispatched."
  },
  {
    id: "INC-1003",
    relatedAlert: "ALT-003",
    alert: "ALT-003",
    title: "Loading Bay Proximity Incident",
    type: "Proximity Hazard",
    location: "Zone B - Warehouse",
    status: "RESOLVED",
    assignedUser: "Safety Officer Davis",
    assignedTo: "Safety Officer Davis",
    date: "17 Oct 2026",
    time: "16:20 PM",
    severity: "MEDIUM",
    summary: "Forklift driver paused vehicle following sensor beep. Worker redirected to pedestrian walkway. Safe operations resumed."
  }
];

export const initialZones: Zone[] = [
  {
    id: "A",
    name: "Zone A - Main Yard",
    risk: "LOW",
    riskLevel: "Low",
    cameras: 4,
    activeHazards: 1
  },
  {
    id: "B",
    name: "Zone B - Warehouse",
    risk: "MEDIUM",
    riskLevel: "Medium",
    cameras: 5,
    activeHazards: 1
  },
  {
    id: "C",
    name: "Zone C - Chemical Storage",
    risk: "HIGH",
    riskLevel: "High",
    cameras: 3,
    activeHazards: 2
  },
  {
    id: "D",
    name: "Zone D - South Parking",
    risk: "LOW",
    riskLevel: "Low",
    cameras: 2,
    activeHazards: 0
  }
];

export const initialSettings: SettingsConfig = {
  ppeDetection: true,
  intrusionDetection: true,
  fireDetection: true,
  crowdEvaluation: true,
  proximityWarning: true,
  confidenceThreshold: 85,
  autoEscalate: true,
  smsNotifications: true
};

export const initialAnalytics: AnalyticsStats = {
  totalDetections: 548,
  totalAlerts: 36,
  resolvedIncidents: 31,
  detectionPrecision: 98.2,
  falseAlertRate: 1.8,
  avgResponseTime: "1m 24s",
  incidentsResolved: 94,
  hazardBreakdown: [
    { category: "Missing Helmet", count: 48, percentage: 37.5, color: "bg-rose-500" },
    { category: "No Safety Vest", count: 34, percentage: 26.5, color: "bg-amber-500" },
    { category: "Restricted Intrusion", count: 28, percentage: 21.8, color: "bg-purple-500" },
    { category: "Forklift Speeding", count: 18, percentage: 14.2, color: "bg-cyan-500" }
  ]
};
