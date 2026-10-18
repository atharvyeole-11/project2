import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function IncidentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, updateIncidentStatus, updateIncidentNotes } = useSafety();

  const incident = incidents.find((i) => i.id === id) || incidents[0];
  const [notes, setNotes] = useState(incident?.summary || '');
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    if (incident) {
      setNotes(incident.summary || '');
    }
  }, [incident]);

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        Incident file not found.
      </div>
    );
  }

  const handleSaveNotes = () => {
    updateIncidentNotes(incident.id, notes);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleStatusChange = (newStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    updateIncidentStatus(incident.id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={`Incident Investigation File — ${incident.id}`}
          subtitle={`Investigation Case: ${incident.title}`}
        />
        <button
          onClick={() => navigate('/incidents')}
          className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Back to Incident Docket
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold rounded-xl animate-fade-in flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span>✓</span>
          <span>Supervisor resolution notes committed to docket records successfully.</span>
        </div>
      )}

      {/* Screen 9 Incident Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence Snapshots & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 space-y-5 shadow-xl">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  RELATED ALERT: {incident.relatedAlert || incident.alert || 'ALT-DEMO'}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{incident.title}</h2>
              </div>
              <Badge
                type={
                  incident.status === 'OPEN'
                    ? 'danger'
                    : incident.status === 'IN_PROGRESS'
                    ? 'warning'
                    : 'success'
                }
              >
                {incident.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-300 p-4 bg-slate-950/60 rounded-xl border border-white/[0.06] leading-relaxed font-sans">
              {notes || incident.summary}
            </p>

            {/* Quick Status Setter */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                Investigation Status:
              </span>
              {(['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    incident.status === st
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Evidence Snapshot Grid */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Captured Evidence Telemetry Snapshots</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-52 bg-slate-950 rounded-xl overflow-hidden relative border border-white/[0.08] flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 filter contrast-110"
                    style={{
                      backgroundImage: `url('/assets/demo/person_did_not_wear_safety_vest.png')`,
                    }}
                  />
                  <div className="absolute inset-8 border border-rose-500/80 rounded p-1 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <span className="bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                      PPE Breach Box
                    </span>
                  </div>
                  <span className="relative z-10 bg-slate-950/85 text-rose-400 text-[10px] font-mono font-bold px-2 py-1 rounded border border-rose-500/30 backdrop-blur-md">
                    Frame #1420 - Detection Box
                  </span>
                </div>

                <div className="h-52 bg-slate-950 rounded-xl overflow-hidden relative border border-white/[0.08] flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 filter contrast-110"
                    style={{
                      backgroundImage: `url('/assets/demo/yolov8_inference.jpg')`,
                    }}
                  />
                  <span className="relative z-10 bg-slate-950/85 text-cyan-300 text-[10px] font-mono font-bold px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md">
                    Frame #1425 - Zoom Telemetry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Resolution Form */}
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Investigation Audit Trail</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Assigned Officer:</span>
                <span className="text-white font-bold">
                  {incident.assignedUser || incident.assignedTo}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Sector Location:</span>
                <span className="text-slate-200">{incident.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-cyan-400 font-bold">
                  {incident.date} {incident.time ? `• ${incident.time}` : ''}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                Resolution Officer Notes
              </label>
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter supervisor resolution details, worker statements, or corrective actions..."
                className="w-full p-3 bg-slate-950/80 border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleSaveNotes}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] mt-6 cursor-pointer border border-cyan-300/40 uppercase tracking-wider"
          >
            Save & Update Incident File
          </button>
        </div>
      </div>
    </div>
  );
}
