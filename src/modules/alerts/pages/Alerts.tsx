import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function Alerts() {
  const { alerts, updateAlertStatus } = useSafety();
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || '');

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  const handleAction = (status: 'ACKNOWLEDGED' | 'ESCALATED' | 'DISMISSED') => {
    if (selectedAlert) {
      updateAlertStatus(selectedAlert.id, status);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety Operations Center — Alert Console"
          subtitle="Real-time CCTV violation alerts & supervisor response dispatcher."
        />
        <Link
          to="/alerts/table"
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-blue-600 text-xs font-semibold rounded-xl transition-colors border border-slate-200 self-start sm:self-auto"
        >
          View Full Alert History Table →
        </Link>
      </div>

      {/* Alert quick selector chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Active Queue:
        </span>
        {alerts.slice(0, 6).map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAlertId(a.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedAlert?.id === a.id
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {a.id} — {a.type}
          </button>
        ))}
      </div>

      {/* Screen 6 Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane: CCTV Video Snapshot Preview */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="h-[420px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url(${
                  selectedAlert?.type === 'PPE Violation'
                    ? '/assets/demo/person_did_not_wear_safety_vest.png'
                    : selectedAlert?.type === 'Restricted Zone'
                    ? '/assets/demo/persons_in_restricted_zones.jpg'
                    : selectedAlert?.type === 'Proximity Hazard'
                    ? '/assets/demo/person_near_machinery.jpg'
                    : '/assets/demo/yolov8_inference.jpg'
                })`,
              }}
            />

            {/* Red Violation Box */}
            <div className="absolute top-20 left-36 w-52 h-64 border-2 border-rose-500 rounded-lg p-2 bg-rose-500/20 animate-pulse z-10">
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                ⚠️ VIOLATION DETECTED: {selectedAlert?.type}
              </span>
            </div>

            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md z-20">
              LIVE EVIDENCE SNAPSHOT
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>Camera: {selectedAlert?.camera}</span>
            <span>Timestamp: {selectedAlert?.time}</span>
          </div>
        </div>

        {/* Right Pane: Alert Info & Supervisor Actions */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          {selectedAlert ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {selectedAlert.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedAlert.type}
                    </h3>
                  </div>
                  <Badge
                    type={
                      selectedAlert.priority === 'CRITICAL'
                        ? 'danger'
                        : selectedAlert.priority === 'HIGH'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {selectedAlert.priority}
                  </Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-800 font-semibold">{selectedAlert.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Node Camera:</span>
                    <span className="text-slate-800 font-mono">{selectedAlert.camera}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Status:</span>
                    <span
                      className={`font-bold font-mono ${
                        selectedAlert.status === 'NEW'
                          ? 'text-rose-600'
                          : selectedAlert.status === 'ESCALATED'
                          ? 'text-amber-600'
                          : selectedAlert.status === 'ACKNOWLEDGED'
                          ? 'text-blue-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {selectedAlert.status}
                    </span>
                  </div>
                  <div className="pt-2 text-slate-700">
                    <p className="text-slate-500 mb-1 font-semibold uppercase text-[10px] tracking-wider">
                      Alert Description:
                    </p>
                    <p className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800">
                      {selectedAlert.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supervisor Action Buttons */}
              <div className="space-y-2.5 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleAction('ACKNOWLEDGED')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  ✓ Acknowledge Alert
                </button>

                <button
                  onClick={() => handleAction('ESCALATED')}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  ⚠️ Escalate to Incident Case
                </button>

                <button
                  onClick={() => handleAction('DISMISSED')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Dismiss Alert
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No active alerts selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
