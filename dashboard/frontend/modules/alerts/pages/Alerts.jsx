import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { alerts as mockAlerts } from "../../../data/alerts";
import Badge from "../../../shared/components/Badge";

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState(mockAlerts[0]);

  useEffect(() => {
    async function load() {
      const res = await api.getAlerts();
      if (res && res.length > 0) {
        setAlerts(res);
        setSelectedAlert(res[0]);
      }
    }
    load();
  }, []);

  const handleAction = async (id, status) => {
    await api.updateAlertStatus(id, status);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => ({ ...prev, status }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Safety Operations Center — Alert Console"
          subtitle="Real-time CCTV violation alerts & supervisor response dispatcher."
        />
        <a
          href="/alerts/table"
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-700 text-blue-600 text-xs font-semibold rounded-lg transition-colors border border-slate-300"
        >
          View Full Alert Table →
        </a>
      </div>

      {/* Screen 6 Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane: CCTV Video Snapshot Preview */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="h-[400px] bg-slate-50 relative flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80')`
              }}
            />

            {/* Red Violation Box */}
            <div className="absolute top-20 left-36 w-48 h-60 border-2 border-rose-500 rounded p-1.5 bg-rose-500/20 animate-pulse">
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                ⚠️ VIOLATION DETECTED: {selectedAlert?.type}
              </span>
            </div>

            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md">
              LIVE EVIDENCE SNAPSHOT
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Camera: {selectedAlert?.camera}</span>
            <span>Timestamp: {selectedAlert?.time}</span>
          </div>
        </div>

        {/* Right Pane: Alert Info & Supervisor Actions (Matching Screen 6) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono text-blue-600">{selectedAlert?.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAlert?.type}</h3>
              </div>
              <Badge type={selectedAlert?.priority === "CRITICAL" ? "danger" : "warning"}>
                {selectedAlert?.priority}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800 font-semibold">{selectedAlert?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-blue-600 font-bold font-mono">{selectedAlert?.status}</span>
              </div>
              <div className="pt-2 text-slate-700">
                <p className="text-slate-500 mb-1">Alert Description:</p>
                <p className="p-2 bg-slate-50 rounded border border-slate-300">
                  {selectedAlert?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Supervisor Action Buttons */}
          <div className="space-y-2 pt-6 border-t border-slate-200">
            <button
              onClick={() => handleAction(selectedAlert.id, "ACKNOWLEDGED")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-blue-600/20"
            >
              ✓ Acknowledge Alert
            </button>

            <button
              onClick={() => handleAction(selectedAlert.id, "ESCALATED")}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-rose-500/20"
            >
              ⚠️ Escalate to Incident
            </button>

            <button
              onClick={() => handleAction(selectedAlert.id, "DISMISSED")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-700 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
