export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  zone: string;
  detections: number;
  source?: string;
  resolution?: string;
  fps?: number;
  image?: string;
  detectionsList?: DetectionBox[];
  isMobileStream?: boolean;
}

export interface DetectionBox {
  id: string;
  label: string;
  classId?: number;
  confidence: number;
  severity: 'critical' | 'warning' | 'normal';
  timestamp: string;
  box: {
    top: number; // percentage e.g. 20
    left: number; // percentage e.g. 25
    width: number; // percentage e.g. 22
    height: number; // percentage e.g. 35
  };
}

export interface Alert {
  id: string;
  type: string;
  title?: string;
  location: string;
  camera: string;
  time: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'ESCALATED' | 'DISMISSED' | 'RESOLVED';
  description: string;
  risk?: string;
  image?: string;
}

export interface Incident {
  id: string;
  relatedAlert?: string;
  alert?: string;
  title: string;
  type?: string;
  location: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedUser?: string;
  assignedTo?: string;
  date?: string;
  time?: string;
  summary?: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface Zone {
  id: string;
  name: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel?: 'Low' | 'Medium' | 'High';
  cameras: number;
  activeHazards?: number;
}

export interface SettingsConfig {
  ppeDetection: boolean;
  intrusionDetection: boolean;
  fireDetection: boolean;
  crowdEvaluation: boolean;
  proximityWarning: boolean;
  confidenceThreshold: number;
  autoEscalate: boolean;
  smsNotifications: boolean;
}

export interface AnalyticsStats {
  totalDetections: number;
  totalAlerts: number;
  resolvedIncidents: number;
  detectionPrecision: number;
  falseAlertRate: number;
  avgResponseTime?: string;
  incidentsResolved?: number;
  hazardBreakdown?: {
    category: string;
    count: number;
    percentage: number;
    color: string;
    glow?: string;
  }[];
}

// Mobile CCTV Node Session Info
export interface MobileSessionState {
  sessionId: string;
  isConnected: boolean;
  connectedAt: number | null;
  elapsedSeconds: number;
  elapsedFormatted: string;
  deviceLabel: string;
  facingMode: 'environment' | 'user';
  resolution: { width: number; height: number; fps: number };
  torchActive: boolean;
  lastHeartbeat: number;
  latestFrameData?: string; // Data URL for cross-tab preview
}

// Construction Video Analysis Record
export interface VideoViolationItem {
  id: string;
  timestamp: number; // in seconds
  timestampFormatted: string; // "00:14.2"
  classType: 'missing_hardhat' | 'missing_vest' | 'restricted_zone' | 'proximity_hazard' | 'worker_ok' | 'hardhat_ok' | 'vest_ok';
  label: string;
  confidence: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  zone: string;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  evidenceSnapshot?: string;
  summary: string;
  status: 'OBSERVED_DETECTION' | 'RULE_ALERT' | 'CONFIRMED_INCIDENT';
}

export interface VideoAnalysisResult {
  fileName: string;
  fileSizeFormatted: string;
  durationSeconds: number;
  durationFormatted: string;
  totalFramesProcessed: number;
  processingDurationSeconds: number;
  averageInferenceFps: number;
  samplingRate: number; // e.g. 10 FPS
  violationsCount: number;
  criticalCount: number;
  warningCount: number;
  complianceRate: number; // percentage
  classCounts: {
    hardhatCompliant: number;
    missingHardhat: number;
    vestCompliant: number;
    missingVest: number;
    totalWorkers: number;
    restrictedBreaches: number;
    proximityHazards: number;
  };
  violations: VideoViolationItem[];
  timelineEvents: {
    time: number;
    timeFormatted: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    title: string;
    id: string;
  }[];
  modelUsed: string;
  analyzedAt: string;
}
