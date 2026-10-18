import { Camera, Alert, Incident, Zone, SettingsConfig, AnalyticsStats } from '../types';

export const initialCameras: Camera[] = [
  {
    id: "CAM-MOBILE-001",
    name: "Mobile Construction CCTV",
    location: "Construction Site — Demo Area",
    status: "offline",
    zone: "Zone B",
    detections: 0,
    source: "MOBILE_WEBRTC",
    resolution: "1080p",
    fps: 30
  },
  {
    id: "CAM-001",
    name: "Warehouse - CAM-A01",
    location: "Zone A - Main Yard",
    status: "online",
    zone: "Zone A",
    detections: 4,
    resolution: "1080p",
    fps: 30
  },
  {
    id: "CAM-002",
    name: "Loading Bay - CAM-B02",
    location: "Zone B - Warehouse",
    status: "online",
    zone: "Zone B",
    detections: 2,
    resolution: "1080p",
    fps: 30
  },
  {
    id: "CAM-003",
    name: "Restricted Area - CAM-C03",
    location: "Zone C - Chemical Storage",
    status: "warning",
    zone: "Zone C",
    detections: 7,
    resolution: "1080p",
    fps: 24
  },
  {
    id: "CAM-004",
    name: "Parking & Logistics - CAM-D04",
    location: "Zone D - South Parking",
    status: "offline",
    zone: "Zone D",
    detections: 0,
    resolution: "720p",
    fps: 15
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "PPE Violation",
    title: "PPE Violation — No Helmet detected on worker",
    camera: "CAM-001",
    location: "Zone A - Main Yard",
    priority: "HIGH",
    status: "NEW",
    time: "10:42 AM",
    description: "Worker detected without safety helmet in active crane zone.",
    risk: "HIGH"
  },
  {
    id: "ALT-002",
    type: "Restricted Zone",
    title: "Restricted Zone — Unauthorized person detected",
    camera: "CAM-003",
    location: "Zone C - Chemical Storage",
    priority: "CRITICAL",
    status: "ACKNOWLEDGED",
    time: "10:38 AM",
    description: "Person detected inside chemical containment perimeter without clearance.",
    risk: "CRITICAL"
  },
  {
    id: "ALT-003",
    type: "Crowd Risk",
    title: "Crowd Risk — Density threshold exceeded",
    camera: "CAM-002",
    location: "Zone B - Warehouse",
    priority: "MEDIUM",
    status: "ASSIGNED",
    time: "10:25 AM",
    description: "Crowd density exceeded safe egress limit during shift changeover.",
    risk: "MEDIUM"
  },
  {
    id: "ALT-004",
    type: "Proximity Hazard",
    title: "Proximity Hazard — Worker near active forklift",
    camera: "CAM-001",
    location: "Zone A - Main Yard",
    priority: "HIGH",
    status: "NEW",
    time: "10:14 AM",
    description: "Pedestrian within 2 meters of moving heavy machinery.",
    risk: "HIGH"
  }
];

export const initialIncidents: Incident[] = [
  {
    id: "INC-1001",
    relatedAlert: "ALT-001",
    alert: "ALT-001",
    title: "PPE Breach — Crane Lift Zone",
    type: "PPE Violation",
    location: "Zone A - Main Yard",
    status: "OPEN",
    assignedUser: "Supervisor Alpha",
    assignedTo: "Supervisor Alpha",
    date: "11 Sep 2026",
    time: "10:42 AM",
    summary: "Worker failed to put on hardhat before entering crane pick-and-carry exclusion circle. Supervisor instructed to halt lift and verify gear compliance."
  },
  {
    id: "INC-1002",
    relatedAlert: "ALT-002",
    alert: "ALT-002",
    title: "Containment Perimeter Breach",
    type: "Restricted Zone",
    location: "Zone C - Chemical Storage",
    status: "IN_PROGRESS",
    assignedUser: "Security Response Team",
    assignedTo: "Security Response Team",
    date: "11 Sep 2026",
    time: "10:38 AM",
    summary: "Unregistered contractor entered toxic solvent storage bay without hazmat suit or RFID clearance badge. On-site dispatch verified."
  },
  {
    id: "INC-1003",
    relatedAlert: "ALT-003",
    alert: "ALT-003",
    title: "Egress Blockage Shift Change",
    type: "Crowd Risk",
    location: "Zone B - Warehouse",
    status: "RESOLVED",
    assignedUser: "Safety Lead Davis",
    assignedTo: "Safety Lead Davis",
    date: "10 Sep 2026",
    time: "10:25 AM",
    summary: "Crowd cleared following secondary gate opening. No injuries or blockages noted."
  }
];

export const initialZones: Zone[] = [
  {
    id: "A",
    name: "Zone A - Main Yard",
    risk: "LOW",
    riskLevel: "Low",
    cameras: 4
  },
  {
    id: "B",
    name: "Zone B - Warehouse",
    risk: "MEDIUM",
    riskLevel: "Medium",
    cameras: 5
  },
  {
    id: "C",
    name: "Zone C - Chemical Storage",
    risk: "HIGH",
    riskLevel: "High",
    cameras: 3
  },
  {
    id: "D",
    name: "Zone D - South Parking",
    risk: "LOW",
    riskLevel: "Low",
    cameras: 2
  }
];

export const initialSettings: SettingsConfig = {
  ppeDetection: true,
  intrusionDetection: true,
  fireDetection: true,
  crowdEvaluation: true,
  proximityWarning: false,
  confidenceThreshold: 85,
  autoEscalate: true,
  smsNotifications: true
};

export const initialAnalytics: AnalyticsStats = {
  totalDetections: 482,
  totalAlerts: 34,
  resolvedIncidents: 28,
  detectionPrecision: 97,
  falseAlertRate: 2,
  avgResponseTime: "1 min 38s",
  incidentsResolved: 95,
  hazardBreakdown: [
    { category: "Missing Helmet", count: 48, percentage: 37.5, color: "bg-rose-500" },
    { category: "No Safety Vest", count: 34, percentage: 26.5, color: "bg-amber-500" },
    { category: "Restricted Intrusion", count: 28, percentage: 21.8, color: "bg-purple-500" },
    { category: "Forklift Speeding", count: 18, percentage: 14.2, color: "bg-blue-600" }
  ]
};
