import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function Alerts() {
  const { alerts, updateAlertStatus } = useSafety();
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || '');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filteredAlerts = alerts.filter(
    (a) => severityFilter === 'ALL' || a.priority === severityFilter
  );

  const selectedAlert =
    alerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0] || alerts[0];

  const handleAction = (status: 'ACKNOWLEDGED' | 'ESCALATED' | 'DISMISSED') => {
    if (selectedAlert) {
      updateAlertStatus(selectedAlert.id, status);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety Operations Center — Alert Command Console"
          subtitle="Real-time optical hazard dispatch, live evidence review, and supervisor escalation terminal."
        />
        <Link
          to="/alerts/table"
          className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold rounded-xl transition-colors border border-cyan-500/30 self-start sm:self-auto shadow-sm"
        >
          View Full Audit Table →
        </Link>
      </div>

      {/* Filter Chips & Active Queue */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
            Filter Priority:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-cyan-400">
          {filteredAlerts.length} Active in Queue
        </span>
      </div>

      {/* Main Dual-Pane Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prominent Live Evidence Snapshot Viewport */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="h-[440px] sm:h-[480px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
            {/* Evidence Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 filter contrast-115"
              style={{
                backgroundImage: `url(${
                  selectedAlert?.image ||
                  (selectedAlert?.type === 'PPE Violation'
                    ? '/assets/demo/person_did_not_wear_safety_vest.png'
                    : selectedAlert?.type === 'Restricted Zone'
                    ? '/assets/demo/persons_in_restricted_zones.jpg'
                    : selectedAlert?.type === 'Proximity Hazard'
                    ? '/assets/demo/person_near_machinery.jpg'
                    : '/assets/demo/yolov8_inference.jpg')
                })`,
              }}
            />

            {/* Cyber Reticles & Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Reticle Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-rose-500" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-rose-500" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-rose-500" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-rose-500" />

            {/* Red Violation Box */}
            <div className="absolute top-20 left-36 w-56 h-64 border-2 border-rose-500 rounded-lg p-2 bg-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-pulse z-10">
              <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-rose-400/40">
                ⚠️ VIOLATION: {selectedAlert?.type}
              </span>
            </div>

            <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-lg border border-rose-400/40 z-20 backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>LIVE EVIDENCE SNAPSHOT</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-slate-950/80 text-cyan-300 text-xs font-mono px-3 py-1 rounded-lg border border-white/10 z-20 backdrop-blur-md">
              INSPECTION ID: {selectedAlert?.id}
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Camera Node: <span className="text-white font-bold">{selectedAlert?.camera}</span></span>
            <span>Captured: <span className="text-cyan-400">{selectedAlert?.time}</span></span>
          </div>
        </div>

        {/* Right Pane: Selected Alert Telemetry & Supervisor Response Actions */}
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
          {selectedAlert ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-white/[0.06]">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {selectedAlert.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedAlert.title || selectedAlert.type}
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

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200 font-semibold">{selectedAlert.location}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-slate-400">Camera Source:</span>
                    <span className="text-cyan-300 font-bold">{selectedAlert.camera}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                    <span className="text-slate-400">Dispatch Status:</span>
                    <span
                      className={`font-bold ${
                        selectedAlert.status === 'NEW'
                          ? 'text-rose-400'
                          : selectedAlert.status === 'ESCALATED'
                          ? 'text-amber-400'
                          : selectedAlert.status === 'ACKNOWLEDGED'
                          ? 'text-cyan-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {selectedAlert.status}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-slate-400 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                      Neural Model Description:
                    </p>
                    <p className="p-3 bg-slate-950/70 rounded-xl border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-sans">
                      {selectedAlert.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => handleAction('ACKNOWLEDGED')}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer border border-cyan-300/40 uppercase tracking-wider"
                >
                  ✓ Acknowledge Alert
                </button>

                <button
                  onClick={() => handleAction('ESCALATED')}
                  className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] cursor-pointer border border-rose-400/40 uppercase tracking-wider"
                >
                  ⚠️ Escalate to Incident Docket
                </button>

                <button
                  onClick={() => handleAction('DISMISSED')}
                  className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-white/10"
                >
                  Dismiss Hazard
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono">
              No alert selected.
            </div>
          )}
        </div>
      </div>

      {/* Queue selector grid */}
      <div className="pt-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
          Select From Active Queue:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredAlerts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAlertId(a.id)}
              className={`p-3 rounded-xl bg-slate-900/60 backdrop-blur-xl border text-left transition-all cursor-pointer ${
                selectedAlert?.id === a.id
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'border-white/[0.08] hover:border-cyan-500/30'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">{a.id}</span>
                <span className="text-slate-500">{a.time}</span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-1">{a.title || a.type}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{a.location}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
