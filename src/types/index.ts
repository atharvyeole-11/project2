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
}

export interface Zone {
  id: string;
  name: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel?: 'Low' | 'Medium' | 'High';
  cameras: number;
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
  }[];
}
