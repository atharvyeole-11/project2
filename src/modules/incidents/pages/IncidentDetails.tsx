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
      <div className="p-8 text-center text-slate-500">
        Incident not found.
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
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Back to Incident Log
        </button>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>Incident investigation notes updated successfully.</span>
        </div>
      )}

      {/* Screen 9 Incident Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence Snapshots & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Case Summary */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  ALERT REF: {incident.relatedAlert || incident.alert || 'ALT-DEMO'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{incident.title}</h2>
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

            <p className="text-xs text-slate-700 p-4 bg-slate-50 rounded-xl border border-slate-200/80 leading-relaxed">
              {notes || incident.summary}
            </p>

            {/* Quick Status Setter */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Update Status:
              </span>
              {(['OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    incident.status === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Evidence Snapshot Grid */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Captured Evidence Snapshots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-48 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 filter contrast-110"
                    style={{
                      backgroundImage: `url('/assets/demo/person_did_not_wear_safety_vest.png')`,
                    }}
                  />
                  <div className="absolute inset-8 border border-rose-500 rounded p-1">
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      PPE Breach Box
                    </span>
                  </div>
                  <span className="relative z-10 bg-slate-900/90 text-rose-400 text-[10px] font-mono font-bold px-2 py-1 rounded border border-rose-500/30">
                    Frame #1420 - Detection Box
                  </span>
                </div>

                <div className="h-48 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 filter contrast-110"
                    style={{
                      backgroundImage: `url('/assets/demo/yolov8_inference.jpg')`,
                    }}
                  />
                  <span className="relative z-10 bg-slate-900/90 text-blue-400 text-[10px] font-mono font-bold px-2 py-1 rounded border border-blue-500/30">
                    Frame #1425 - Zoom Telemetry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Resolution Form */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Investigation Audit Trail
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Assigned Officer:</span>
                <span className="text-slate-900 font-bold">
                  {incident.assignedUser || incident.assignedTo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Incident Location:</span>
                <span className="text-slate-800 font-semibold">{incident.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-800 font-mono">
                  {incident.date} {incident.time ? `• ${incident.time}` : ''}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Resolution Officer Notes
              </label>
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter supervisor resolution details, worker statements, or corrective actions..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveNotes}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors mt-6 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Save & Update Incident File
          </button>
        </div>
      </div>
    </div>
  );
}
