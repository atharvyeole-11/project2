import { useEffect, useState, useRef } from "react";
import { api } from "../../../services/api";
import { socket } from "../../../services/socket";
import { cameras as mockCameras } from "../../../data/cameras";
import { alerts as mockAlerts } from "../../../data/alerts";

import StatCard from "../components/StatCard";
import LiveCameraCard from "../components/LiveCameraCard";
import ActiveAlertCard from "../components/ActiveAlertCard";
import RiskSummary from "../components/RiskSummary";
import PageHeader from "../../../shared/components/PageHeader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cameras, setCameras] = useState(mockCameras);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [stats, setStats] = useState({});
  const [webrtcStream, setWebrtcStream] = useState(null);
  const [alertPopup, setAlertPopup] = useState(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const res = await api.getDashboard();
      if (res) {
        setData(res);
        setCameras(res.cameras);
        setAlerts(res.recentAlerts);
        setStats({
          activeCameras: res.activeCameras,
          totalCameras: res.totalCameras,
          activeAlerts: res.activeAlerts,
          todayIncidents: res.todayIncidents,
          siteRisk: res.siteRisk
        });
      }
    }
    loadData();

    // Socket listeners for real-time AI demo
    socket.on("camera_updated", (cam) => {
      setCameras(prev => prev.map(c => c.id === cam.id ? cam : c));
      if (cam.id === "CAM-MOBILE-001" && cam.status === "offline") {
        setWebrtcStream(null);
        if (peerConnectionRef.current) peerConnectionRef.current.close();
      }
    });

    socket.on("alert_created", (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 3));
      if (alert.priority === "CRITICAL" || alert.priority === "HIGH") {
        setAlertPopup(alert);
        setTimeout(() => setAlertPopup(null), 8000);
      }
    });

    socket.on("stats_updated", (newStats) => {
      setStats(prev => ({ ...prev, ...newStats }));
    });

    // WebRTC Answer Logic for receiving stream from PhoneCamera
    socket.on("offer", async (offer) => {
      const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        setWebrtcStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current && candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding remote ice candidate", e);
        }
      }
    });
  socket.emit("request-offer"); // Prompt phone to send WebRTC offer

    return () => {
      socket.off("camera_updated");
      socket.off("alert_created");
      socket.off("stats_updated");
      socket.off("offer");
      socket.off("ice-candidate");
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-6 relative">
      <PageHeader
        title="Safety Operations Center"
        subtitle="Real-time AI camera telemetry, safety rule violations, and incident response center."
      />

      {/* Alert Popup Notification */}
      {alertPopup && (
        <div className="fixed top-20 right-6 z-50 w-96 bg-white border-2 border-rose-500 rounded-xl shadow-2xl p-4 animate-slide-up">
          <div className="flex justify-between items-start">
            <h4 className="text-rose-500 font-bold flex items-center gap-2">
              <span className="animate-ping w-2 h-2 rounded-full bg-rose-500 block"></span>
              ⚠ SAFETY ALERT
            </h4>
            <span className="text-xs font-mono text-slate-500">{alertPopup.time}</span>
          </div>
          <p className="text-slate-900 font-semibold mt-2">{alertPopup.title}</p>
          <div className="text-xs text-slate-500 mt-1 space-y-1">
            <p>Camera: {alertPopup.camera}</p>
            <p>Location: {alertPopup.location}</p>
            <p>Risk: <span className="text-rose-500 font-bold">{alertPopup.risk}</span></p>
          </div>
          <div className="mt-4 flex gap-2">
            <a href="/alerts" className="px-3 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-400">View Alert</a>
            <button onClick={() => setAlertPopup(null)} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg">Dismiss</button>
          </div>
        </div>
      )}

      {/* Top Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Cameras" value={`${stats.activeCameras || 0}/${stats.totalCameras || 0}`} subtitle="Live nodes" icon="📹" />
        <StatCard title="Active Alerts" value={String(stats.activeAlerts || 0).padStart(2, '0')} subtitle="Unresolved" icon="🚨" />
        <StatCard title="Today's Incidents" value={String(stats.todayIncidents || 0).padStart(2, '0')} subtitle="Logged" icon="⚠️" />
        <StatCard title="Current Site Risk" value={stats.siteRisk || "LOW"} subtitle="Risk index" icon="🛡️" />
      </div>

      {/* Main Grid: Live Feeds + Risk Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Live CCTV AI Streams</h2>
            <a href="/cameras" className="text-xs text-blue-600 hover:text-blue-500 font-semibold">View All Feeds →</a>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {cameras.slice(0, 4).map((camera) => (
              <LiveCameraCard key={camera.id} camera={camera} stream={camera.id === "CAM-MOBILE-001" ? webrtcStream : null} />
            ))}
          </div>
        </div>
        <RiskSummary />
      </div>

      {/* Recent Active Alerts */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Recent Active Safety Alerts</h2>
          <a href="/alerts" className="text-xs text-blue-600 hover:text-blue-500 font-semibold">Open Alert Console →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <ActiveAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}