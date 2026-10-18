import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function AlertDetails() {
  const { alerts } = useSafety();
  const [filter, setFilter] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('all');

  const filtered = alerts.filter(
    (a) => filter === 'all' || a.priority === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety Operations Center — Audit Log & Records"
          subtitle="Complete chronological audit trail of all computer vision detections across facility camera nodes."
        />
        <Link
          to="/alerts"
          className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold rounded-xl transition-colors border border-cyan-500/30 self-start sm:self-auto"
        >
          ← Back to Live Alert Console
        </Link>
      </div>

      {/* Screen 7 Alert Log Table */}
      <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/40 border-b border-white/[0.06] flex flex-wrap justify-between items-center gap-3">
          <div className="flex space-x-2">
            {(['all', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  filter === p
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Recorded Safety Warnings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.08]">
              <tr>
                <th className="p-4">Alert ID</th>
                <th className="p-4">Violation Type</th>
                <th className="p-4">Sector Location</th>
                <th className="p-4">Camera Node</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-cyan-400 font-bold">{alert.id}</td>
                  <td className="p-4 font-semibold text-white font-sans">{alert.type}</td>
                  <td className="p-4 text-slate-300 font-sans">{alert.location}</td>
                  <td className="p-4 text-slate-400">{alert.camera}</td>
                  <td className="p-4 text-slate-500">{alert.time}</td>
                  <td className="p-4">
                    <Badge
                      type={
                        alert.priority === 'CRITICAL'
                          ? 'danger'
                          : alert.priority === 'HIGH'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold text-[11px] ${
                        alert.status === 'NEW'
                          ? 'text-rose-400'
                          : alert.status === 'ESCALATED'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to="/alerts"
                      className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 rounded-lg font-bold border border-cyan-500/30 transition-all shadow-sm"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
