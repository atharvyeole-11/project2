import { useParams, useNavigate } from "react";
import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { incidents as mockIncidents } from "../../../data/incidents";
import Badge from "../../../shared/components/Badge";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const res = await api.getIncident(id);
      setIncident(res || mockIncidents.find(i => i.id === id) || mockIncidents[0]);
    }
    load();
  }, [id]);

  if (!incident) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title={`Incident File — ${incident.id}`}
          subtitle={`Investigation Case: ${incident.title}`}
        />
        <button
          onClick={() => navigate("/incidents")}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-700"
        >
          ← Back to Incident Log
        </button>
      </div>

      {/* Screen 9 Incident Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence Snapshots & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Case Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-blue-600">ALERT REF: {incident.relatedAlert}</span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{incident.title}</h2>
              </div>
              <Badge type={incident.status === "OPEN" ? "danger" : "warning"}>{incident.status}</Badge>
            </div>

            <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded border border-slate-300">
              {incident.summary}
            </p>

            {/* Evidence Snapshot Grid */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Captured Evidence Snapshots
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-44 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-200 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80')` }}
                  />
                  <span className="relative z-10 bg-white/90 text-rose-400 text-[10px] font-mono font-bold px-2 py-1 rounded border border-rose-500/30">
                    Frame #1420 - Detection Box
                  </span>
                </div>
                <div className="h-44 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-200 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80')` }}
                  />
                  <span className="relative z-10 bg-white/90 text-blue-600 text-[10px] font-mono font-bold px-2 py-1 rounded border border-blue-300">
                    Frame #1425 - Zoom Telemetry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Resolution Form (Matching Screen 9) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
              Investigation Audit Trail
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Officer:</span>
                <span className="text-slate-800 font-bold">{incident.assignedUser}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800">{incident.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-800 font-mono">{incident.time}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Resolution Officer Notes
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter supervisor resolution details or corrective actions..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors mt-4">
            Save & Update Incident File
          </button>
        </div>
      </div>
    </div>
  );
}
