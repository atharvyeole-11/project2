import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Camera, Alert, Incident, Zone, SettingsConfig, AnalyticsStats } from '../types';
import {
  initialCameras,
  initialAlerts,
  initialIncidents,
  initialZones,
  initialSettings,
  initialAnalytics
} from '../data/mockData';

interface SafetyContextType {
  cameras: Camera[];
  alerts: Alert[];
  incidents: Incident[];
  zones: Zone[];
  settings: SettingsConfig;
  analytics: AnalyticsStats;
  alertPopup: Alert | null;
  activeMobileStream: MediaStream | null;
  isSimulating: boolean;
  user: { name: string; role: string; location: string };
  updateCameraStatus: (id: string, status: Camera['status']) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  dismissPopup: () => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  updateIncidentNotes: (id: string, notes: string) => void;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
  setActiveMobileStream: (stream: MediaStream | null) => void;
  triggerManualAlert: (customAlert?: Partial<Alert>) => Alert;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
}

const SafetyContext = createContext<SafetyContextType | null>(null);

const STORAGE_KEY_CAMERAS = 'sitesentry_cameras_v1';
const STORAGE_KEY_ALERTS = 'sitesentry_alerts_v1';
const STORAGE_KEY_INCIDENTS = 'sitesentry_incidents_v1';
const STORAGE_KEY_SETTINGS = 'sitesentry_settings_v1';

export const SafetyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMERAS);
      return saved ? JSON.parse(saved) : initialCameras;
    } catch {
      return initialCameras;
    }
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      return saved ? JSON.parse(saved) : initialAlerts;
    } catch {
      return initialAlerts;
    }
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      return saved ? JSON.parse(saved) : initialIncidents;
    } catch {
      return initialIncidents;
    }
  });

  const [zones] = useState<Zone[]>(initialZones);

  const [settings, setSettings] = useState<SettingsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [alertPopup, setAlertPopup] = useState<Alert | null>(null);
  const [activeMobileStream, setActiveMobileStream] = useState<MediaStream | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAMERAS, JSON.stringify(cameras));
    } catch {}
  }, [cameras]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    } catch {}
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Update camera status
  const updateCameraStatus = useCallback((id: string, status: Camera['status']) => {
    setCameras(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  }, []);

  // Update alert status & auto-escalate logic
  const updateAlertStatus = useCallback((id: string, status: Alert['status']) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );

    if (status === 'ESCALATED') {
      setAlerts(currentAlerts => {
        const targetAlert = currentAlerts.find(a => a.id === id);
        if (targetAlert) {
          setIncidents(prevIncidents => {
            const alreadyExists = prevIncidents.some(
              i => i.relatedAlert === id || i.alert === id
            );
            if (!alreadyExists) {
              const newIncident: Incident = {
                id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
                relatedAlert: targetAlert.id,
                alert: targetAlert.id,
                title: targetAlert.title || targetAlert.type,
                type: targetAlert.type,
                location: targetAlert.location,
                status: 'OPEN',
                assignedUser: 'Operations Supervisor',
                assignedTo: 'Operations Supervisor',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: targetAlert.time,
                summary: targetAlert.description || `Escalated safety breach at ${targetAlert.location}. Immediate inspection logged.`
              };
              return [newIncident, ...prevIncidents];
            }
            return prevIncidents;
          });
        }
        return currentAlerts;
      });
    }
  }, []);

  const dismissPopup = useCallback(() => {
    setAlertPopup(null);
  }, []);

  const updateIncidentStatus = useCallback((id: string, status: Incident['status']) => {
    setIncidents(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    );
  }, []);

  const updateIncidentNotes = useCallback((id: string, notes: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === id ? { ...i, summary: notes } : i))
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SettingsConfig>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const triggerManualAlert = useCallback((customAlert?: Partial<Alert>): Alert => {
    const defaultScenarios = [
      {
        type: 'PPE Violation',
        title: 'PPE Violation — Hardhat missing on worker',
        rule: 'No safety helmet detected in active loading bay',
        priority: 'HIGH' as const,
        risk: 'HIGH',
        camera: 'CAM-001',
        location: 'Zone A - Main Yard'
      },
      {
        type: 'Restricted Zone',
        title: 'Restricted Zone — Unauthorized access breach',
        rule: 'Person detected crossing yellow perimeter line',
        priority: 'CRITICAL' as const,
        risk: 'CRITICAL',
        camera: 'CAM-003',
        location: 'Zone C - Chemical Storage'
      },
      {
        type: 'Proximity Hazard',
        title: 'Proximity Hazard — Worker near moving forklift',
        rule: 'Pedestrian within 1.5m radius of machinery',
        priority: 'HIGH' as const,
        risk: 'HIGH',
        camera: 'CAM-002',
        location: 'Zone B - Warehouse'
      }
    ];

    const scenario = defaultScenarios[Math.floor(Math.random() * defaultScenarios.length)];
    const id = `ALT-${Math.floor(100 + Math.random() * 900)}`;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newAlert: Alert = {
      id: customAlert?.id || id,
      type: customAlert?.type || scenario.type,
      title: customAlert?.title || scenario.title,
      location: customAlert?.location || scenario.location,
      camera: customAlert?.camera || scenario.camera,
      time: customAlert?.time || time,
      priority: customAlert?.priority || scenario.priority,
      status: 'NEW',
      description: customAlert?.description || `[AI ENGINE DETECTION] ${scenario.rule}`,
      risk: customAlert?.risk || scenario.risk
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Also increment detections count for corresponding camera
    setCameras(prev =>
      prev.map(c => (c.id === newAlert.camera ? { ...c, detections: c.detections + 1 } : c))
    );

    if (newAlert.priority === 'CRITICAL' || newAlert.priority === 'HIGH') {
      setAlertPopup(newAlert);
      setTimeout(() => {
        setAlertPopup(curr => (curr?.id === newAlert.id ? null : curr));
      }, 7000);
    }

    return newAlert;
  }, []);

  // Periodic simulated safety events generator
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 15% probability every 15 seconds to simulate a live detection
      if (Math.random() < 0.35) {
        triggerManualAlert();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isSimulating, triggerManualAlert]);

  const activeAlertsCount = alerts.filter(a => a.status !== 'DISMISSED' && a.status !== 'RESOLVED').length;
  const criticalCount = alerts.filter(a => a.priority === 'CRITICAL' && a.status !== 'RESOLVED').length;

  const dynamicAnalytics: AnalyticsStats = {
    ...initialAnalytics,
    totalAlerts: alerts.length,
    resolvedIncidents: incidents.filter(i => i.status === 'RESOLVED').length,
    incidentsResolved: Math.round(
      (incidents.filter(i => i.status === 'RESOLVED').length / Math.max(1, incidents.length)) * 100
    )
  };

  const user = {
    name: 'Shift Supervisor',
    role: 'Safety Lead',
    location: 'Central Control Room'
  };

  return (
    <SafetyContext.Provider
      value={{
        cameras,
        alerts,
        incidents,
        zones,
        settings,
        analytics: dynamicAnalytics,
        alertPopup,
        activeMobileStream,
        isSimulating,
        user,
        updateCameraStatus,
        updateAlertStatus,
        dismissPopup,
        updateIncidentStatus,
        updateIncidentNotes,
        updateSettings,
        setActiveMobileStream,
        triggerManualAlert,
        setIsSimulating
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
