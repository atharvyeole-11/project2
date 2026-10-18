import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Camera,
  Alert,
  Incident,
  Zone,
  SettingsConfig,
  AnalyticsStats,
  MobileSessionState,
  VideoAnalysisResult
} from '../types';
import {
  initialCameras,
  initialAlerts,
  initialIncidents,
  initialZones,
  initialSettings,
  initialAnalytics
} from '../data/mockData';

interface SafetyContextType {
  appTitle: string;
  aiEngineName: string;
  apiBaseUrl: string;
  socketStatus: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCameraId: string;
  setActiveCameraId: (id: string) => void;
  cameras: Camera[];
  alerts: Alert[];
  incidents: Incident[];
  zones: Zone[];
  settings: SettingsConfig;
  analytics: AnalyticsStats;
  alertPopup: Alert | null;
  activeMobileStream: MediaStream | null;
  mobileFrameData: string | null;
  mobileSession: MobileSessionState;
  isSimulating: boolean;
  systemHealth: string;
  systemHealthState: 'nominal' | 'warning' | 'critical';
  currentTime: string;
  user: { name: string; role: string; location: string; callsign: string };
  isJuryMode: boolean;
  videoAnalysisResult: VideoAnalysisResult | null;
  isCamera1Mobile: boolean;
  updateCameraStatus: (id: string, status: Camera['status']) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  dismissPopup: () => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  updateIncidentNotes: (id: string, notes: string) => void;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
  setActiveMobileStream: (stream: MediaStream | null) => void;
  triggerManualAlert: (customAlert?: Partial<Alert>) => Alert;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  generateMobileSession: () => string;
  setMobileConnected: (connected: boolean, meta?: Partial<MobileSessionState>) => void;
  disconnectMobile: () => void;
  broadcastMobileFrame: (frameData: string) => void;
  toggleJuryMode: () => void;
  triggerJuryScenario: (scenarioType: 'ppe' | 'zone' | 'proximity' | 'multihazard' | 'reset') => void;
  setVideoAnalysisResult: (res: VideoAnalysisResult | null) => void;
  setIsCamera1Mobile: (val: boolean) => void;
  connectLaptopWebcamAsCamera1: () => Promise<boolean>;
}

const SafetyContext = createContext<SafetyContextType | null>(null);

const STORAGE_KEY_CAMERAS = 'sitesentry_futuristic_cameras_v2';
const STORAGE_KEY_ALERTS = 'sitesentry_futuristic_alerts_v2';
const STORAGE_KEY_INCIDENTS = 'sitesentry_futuristic_incidents_v2';
const STORAGE_KEY_SETTINGS = 'sitesentry_futuristic_settings_v2';
const STORAGE_KEY_SESSION = 'sitesentry_cctv_session_v2';

export const SafetyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'SiteSentry Safety Monitor';
  const aiEngineName = import.meta.env.VITE_AI_DETECTION_ENGINE || 'YOLO11 Local Monitor';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

  const [socketStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'OFFLINE'>('CONNECTED');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCameraId, setActiveCameraId] = useState<string>('CAM-001');
  const [isCamera1Mobile, setIsCamera1Mobile] = useState<boolean>(true);
  const [isJuryMode, setIsJuryMode] = useState<boolean>(false);
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<VideoAnalysisResult | null>(null);

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
  const [mobileFrameData, setMobileFrameData] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Mobile Session Management
  const [mobileSession, setMobileSession] = useState<MobileSessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isConnected: false, // Reset live connection flag until verified
        };
      }
    } catch {}
    return {
      sessionId: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
      isConnected: false,
      connectedAt: null,
      elapsedSeconds: 0,
      elapsedFormatted: '00:00:00',
      deviceLabel: 'Mobile Optical Node (Android / Chrome)',
      facingMode: 'environment',
      resolution: { width: 1920, height: 1080, fps: 30 },
      torchActive: false,
      lastHeartbeat: Date.now(),
    };
  });

  // Cross-Tab & Cross-Window Broadcast Channel for instant WebRTC/Frame transport
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('sitesentry_cctv_uplink');
        channel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === 'FRAME_DATA' && payload?.frame) {
            setMobileFrameData(payload.frame);
            if (!mobileSession.isConnected) {
              setMobileSession((prev) => ({
                ...prev,
                isConnected: true,
                connectedAt: prev.connectedAt || Date.now(),
                resolution: payload.resolution || prev.resolution,
              }));
              updateCameraStatus('CAM-001', 'online');
              updateCameraStatus('CAM-MOBILE-001', 'online');
            }
          } else if (type === 'SESSION_UPDATE' && payload) {
            setMobileSession((prev) => ({
              ...prev,
              ...payload,
              isConnected: payload.isConnected ?? prev.isConnected,
            }));
            if (payload.isConnected) {
              updateCameraStatus('CAM-001', 'online');
              updateCameraStatus('CAM-MOBILE-001', 'online');
            } else if (payload.isConnected === false) {
              updateCameraStatus('CAM-MOBILE-001', 'offline');
            }
          } else if (type === 'DISCONNECT') {
            setMobileSession((prev) => ({
              ...prev,
              isConnected: false,
              connectedAt: null,
              elapsedSeconds: 0,
              elapsedFormatted: '00:00:00',
            }));
            setMobileFrameData(null);
            updateCameraStatus('CAM-MOBILE-001', 'offline');
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel initialization warning:', e);
    }

    return () => {
      try {
        channel?.close();
      } catch {}
    };
  }, [mobileSession.isConnected]);

  // Session elapsed timer ticker
  useEffect(() => {
    if (!mobileSession.isConnected || !mobileSession.connectedAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTotalSec = Math.floor((now - mobileSession.connectedAt!) / 1000);
      const hours = Math.floor(elapsedTotalSec / 3600);
      const minutes = Math.floor((elapsedTotalSec % 3600) / 60);
      const seconds = elapsedTotalSec % 60;
      const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      setMobileSession((prev) => ({
        ...prev,
        elapsedSeconds: elapsedTotalSec,
        elapsedFormatted: formatted,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [mobileSession.isConnected, mobileSession.connectedAt]);

  const generateMobileSession = useCallback(() => {
    const newId = `SES-${Math.floor(1000 + Math.random() * 9000)}`;
    setMobileSession((prev) => {
      const updated: MobileSessionState = {
        ...prev,
        sessionId: newId,
        isConnected: false,
        connectedAt: null,
        elapsedSeconds: 0,
        elapsedFormatted: '00:00:00',
      };
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newId;
  }, []);

  const setMobileConnected = useCallback((connected: boolean, meta?: Partial<MobileSessionState>) => {
    setMobileSession((prev) => {
      const updated: MobileSessionState = {
        ...prev,
        ...meta,
        isConnected: connected,
        connectedAt: connected ? prev.connectedAt || Date.now() : null,
        elapsedSeconds: connected ? prev.elapsedSeconds : 0,
        elapsedFormatted: connected ? prev.elapsedFormatted : '00:00:00',
      };
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('sitesentry_cctv_uplink');
          bc.postMessage({ type: 'SESSION_UPDATE', payload: updated });
          bc.close();
        }
      } catch {}
      return updated;
    });

    if (connected) {
      updateCameraStatus('CAM-001', 'online');
      updateCameraStatus('CAM-MOBILE-001', 'online');
    } else {
      updateCameraStatus('CAM-MOBILE-001', 'offline');
    }
  }, []);

  const disconnectMobile = useCallback(() => {
    if (activeMobileStream) {
      activeMobileStream.getTracks().forEach((t) => t.stop());
      setActiveMobileStream(null);
    }
    setMobileFrameData(null);
    setMobileConnected(false);

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sitesentry_cctv_uplink');
        bc.postMessage({ type: 'DISCONNECT' });
        bc.close();
      }
    } catch {}
  }, [activeMobileStream, setMobileConnected]);

  const broadcastMobileFrame = useCallback((frameData: string) => {
    setMobileFrameData(frameData);
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sitesentry_cctv_uplink');
        bc.postMessage({
          type: 'FRAME_DATA',
          payload: { frame: frameData, resolution: mobileSession.resolution },
        });
        bc.close();
      }
    } catch {}
  }, [mobileSession.resolution]);

  // Connect laptop webcam as Camera 1 directly (great for presentations)
  const connectLaptopWebcamAsCamera1 = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setActiveMobileStream(stream);
      setMobileConnected(true, {
        deviceLabel: 'Host Station Webcam (Camera 1 Bound)',
        facingMode: 'user',
        resolution: { width: 1920, height: 1080, fps: 30 },
      });
      setIsCamera1Mobile(true);
      return true;
    } catch (err) {
      console.warn('Webcam access error:', err);
      return false;
    }
  }, [setMobileConnected]);

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted =
        now
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase() +
        ' ' +
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) +
        ' UTC';
      setCurrentTime(formatted);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

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
    setCameras((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  // Update alert status & auto-escalate logic
  const updateAlertStatus = useCallback((id: string, status: Alert['status']) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    if (status === 'ESCALATED') {
      setAlerts((currentAlerts) => {
        const targetAlert = currentAlerts.find((a) => a.id === id);
        if (targetAlert) {
          setIncidents((prevIncidents) => {
            const alreadyExists = prevIncidents.some(
              (i) => i.relatedAlert === id || i.alert === id
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
                assignedUser: 'Chief Supervisor Vance',
                assignedTo: 'Chief Supervisor Vance',
                date: new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                time: targetAlert.time,
                severity: targetAlert.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
                summary:
                  targetAlert.description ||
                  `Escalated safety breach at ${targetAlert.location}. Immediate investigation logged.`,
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
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const updateIncidentNotes = useCallback((id: string, notes: string) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, summary: notes } : i)));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const triggerManualAlert = useCallback(
    (customAlert?: Partial<Alert>): Alert => {
      const defaultScenarios = [
        {
          type: 'PPE Violation',
          title: 'PPE Violation — Missing Hardhat Detected',
          rule: 'Ground technician inside active crane slew radius without required ANSI Z89.1 helmet.',
          priority: 'HIGH' as const,
          risk: 'HIGH',
          camera: 'CAM-001',
          location: 'Zone A - Main Yard',
          image: '/assets/demo/person_did_not_wear_safety_vest.png',
        },
        {
          type: 'Restricted Zone',
          title: 'Restricted Zone — Perimeter Boundary Breach',
          rule: 'Optical motion vector detected crossing perimeter yellow boundary line.',
          priority: 'CRITICAL' as const,
          risk: 'CRITICAL',
          camera: 'CAM-003',
          location: 'Zone C - Chemical Storage',
          image: '/assets/demo/persons_in_restricted_zones.jpg',
        },
        {
          type: 'Proximity Hazard',
          title: 'Proximity Hazard — Worker Near Active Forklift',
          rule: 'Worker distance to operating material handler below 2.0 meter safe clearance zone.',
          priority: 'HIGH' as const,
          risk: 'HIGH',
          camera: 'CAM-002',
          location: 'Zone B - Warehouse',
          image: '/assets/demo/person_near_machinery.jpg',
        },
      ];

      const scenario =
        defaultScenarios[Math.floor(Math.random() * defaultScenarios.length)];
      const id = `ALT-${Math.floor(100 + Math.random() * 900)}`;
      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const newAlert: Alert = {
        id: customAlert?.id || id,
        type: customAlert?.type || scenario.type,
        title: customAlert?.title || scenario.title,
        location: customAlert?.location || scenario.location,
        camera: customAlert?.camera || scenario.camera,
        time: customAlert?.time || time,
        priority: customAlert?.priority || scenario.priority,
        status: 'NEW',
        description:
          customAlert?.description || `[${aiEngineName}] ${scenario.rule}`,
        risk: customAlert?.risk || scenario.risk,
        image: customAlert?.image || scenario.image,
      };

      setAlerts((prev) => [newAlert, ...prev]);

      setCameras((prev) =>
        prev.map((c) =>
          c.id === newAlert.camera ? { ...c, detections: c.detections + 1 } : c
        )
      );

      if (newAlert.priority === 'CRITICAL' || newAlert.priority === 'HIGH') {
        setAlertPopup(newAlert);
        setTimeout(() => {
          setAlertPopup((curr) => (curr?.id === newAlert.id ? null : curr));
        }, 7000);
      }

      return newAlert;
    },
    [aiEngineName]
  );

  // Jury Demo Scenarios Trigger
  const triggerJuryScenario = useCallback(
    (scenarioType: 'ppe' | 'zone' | 'proximity' | 'multihazard' | 'reset') => {
      if (scenarioType === 'reset') {
        setAlerts(initialAlerts);
        setIncidents(initialIncidents);
        setCameras(initialCameras);
        setAlertPopup(null);
        return;
      }

      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      if (scenarioType === 'ppe') {
        triggerManualAlert({
          type: 'PPE Violation',
          title: 'JURY DEMO: Worker Missing Hardhat & Hi-Vis Vest',
          priority: 'CRITICAL',
          camera: 'CAM-001',
          location: 'Zone A - Main Yard (Camera 1)',
          description:
            '[YOLO11x Jury Verification] Worker bbox [0.24, 0.42, 0.35, 0.72] verified with 96.8% confidence. Hardhat class: NEGATIVE. Hi-Vis vest class: NEGATIVE.',
          image: '/assets/demo/person_did_not_wear_safety_vest.png',
        });
      } else if (scenarioType === 'zone') {
        triggerManualAlert({
          type: 'Restricted Zone',
          title: 'JURY DEMO: Excavation Perimeter Breach',
          priority: 'CRITICAL',
          camera: 'CAM-003',
          location: 'Zone C - Chemical Storage / Deep Pit',
          description:
            '[Spatial Geometry Engine] Intrusion polygon vector intersected. Worker ID #41 entered restricted zone without active perimeter clearance permit.',
          image: '/assets/demo/persons_in_restricted_zones.jpg',
        });
      } else if (scenarioType === 'proximity') {
        triggerManualAlert({
          type: 'Proximity Hazard',
          title: 'JURY DEMO: Heavy Forklift Proximity Hazard (<1.5m)',
          priority: 'HIGH',
          camera: 'CAM-002',
          location: 'Zone B - Warehouse Logistics',
          description:
            '[Machine Proximity Vector] Distance calculation: 1.38m between Class "Forklift" and Class "Worker". Threshold is 2.00m.',
          image: '/assets/demo/person_near_machinery.jpg',
        });
      } else if (scenarioType === 'multihazard') {
        triggerManualAlert({
          type: 'PPE Violation',
          title: 'JURY DEMO: High-Rise Crane Zone PPE Breach',
          priority: 'CRITICAL',
          camera: 'CAM-001',
          location: 'Zone A - Main Yard',
          description: 'Crane swing counterweight active overhead. Worker unhelmeted.',
          image: '/assets/demo/person_did_not_wear_safety_vest.png',
        });
        setTimeout(() => {
          triggerManualAlert({
            type: 'Restricted Zone',
            title: 'JURY DEMO: Unauthorized Floor Level Access',
            priority: 'HIGH',
            camera: 'CAM-003',
            location: 'Zone C - Chemical Storage',
            description: 'Intrusion sensor triggered at restricted entry point.',
            image: '/assets/demo/persons_in_restricted_zones.jpg',
          });
        }, 800);
      }
    },
    [triggerManualAlert]
  );

  const toggleJuryMode = useCallback(() => {
    setIsJuryMode((prev) => !prev);
  }, []);

  // Periodic simulated safety events generator
  useEffect(() => {
    if (!isSimulating || isJuryMode) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.28) {
        triggerManualAlert();
      }
    }, 14000);

    return () => clearInterval(interval);
  }, [isSimulating, isJuryMode, triggerManualAlert]);

  const criticalAlertsCount = alerts.filter(
    (a) =>
      a.priority === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED'
  ).length;

  const highAlertsCount = alerts.filter(
    (a) => a.priority === 'HIGH' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED'
  ).length;

  const systemHealthState: 'nominal' | 'warning' | 'critical' =
    criticalAlertsCount > 0 ? 'critical' : highAlertsCount > 0 ? 'warning' : 'nominal';

  const systemHealth =
    criticalAlertsCount > 0
      ? 'CRITICAL ALERT'
      : highAlertsCount > 0
      ? 'ELEVATED RISK'
      : '99.8% NOMINAL';

  const dynamicAnalytics: AnalyticsStats = {
    ...initialAnalytics,
    totalAlerts: alerts.length,
    resolvedIncidents: incidents.filter((i) => i.status === 'RESOLVED').length,
    incidentsResolved: Math.round(
      (incidents.filter((i) => i.status === 'RESOLVED').length /
        Math.max(1, incidents.length)) *
        100
    ),
  };

  const user = {
    name: 'Chief Supervisor Vance',
    role: 'Tactical Safety Commander',
    callsign: 'SENTINEL-1',
    location: 'SOC Main Deck — Node A',
  };

  return (
    <SafetyContext.Provider
      value={{
        appTitle,
        aiEngineName,
        apiBaseUrl,
        socketStatus,
        searchQuery,
        setSearchQuery,
        activeCameraId,
        setActiveCameraId,
        cameras,
        alerts,
        incidents,
        zones,
        settings,
        analytics: dynamicAnalytics,
        alertPopup,
        activeMobileStream,
        mobileFrameData,
        mobileSession,
        isSimulating,
        systemHealth,
        systemHealthState,
        currentTime,
        user,
        isJuryMode,
        videoAnalysisResult,
        isCamera1Mobile,
        updateCameraStatus,
        updateAlertStatus,
        dismissPopup,
        updateIncidentStatus,
        updateIncidentNotes,
        updateSettings,
        setActiveMobileStream,
        triggerManualAlert,
        setIsSimulating,
        generateMobileSession,
        setMobileConnected,
        disconnectMobile,
        broadcastMobileFrame,
        toggleJuryMode,
        triggerJuryScenario,
        setVideoAnalysisResult,
        setIsCamera1Mobile,
        connectLaptopWebcamAsCamera1,
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
