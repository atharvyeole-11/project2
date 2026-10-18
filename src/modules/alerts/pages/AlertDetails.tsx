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
          title="Safety Operations Center — Alert History & Logs"
          subtitle="Complete audit log of all computer vision safety detections across facility camera nodes."
        />
        <Link
          to="/alerts"
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200 self-start sm:self-auto"
        >
          ← Back to Live Alert Console
        </Link>
      </div>

      {/* Screen 7 Alert Log Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex space-x-2">
            {(['all', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  filter === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {filtered.length} Total Alerts Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Alert ID</th>
                <th className="p-3.5">Alert Type</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Camera Node</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-blue-600 font-bold">{alert.id}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{alert.type}</td>
                  <td className="p-3.5">{alert.location}</td>
                  <td className="p-3.5 font-mono text-slate-600">{alert.camera}</td>
                  <td className="p-3.5 font-mono text-slate-400">{alert.time}</td>
                  <td className="p-3.5">
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
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 text-[11px] font-mono">
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to="/alerts"
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold border border-blue-200 transition-colors"
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
