import React from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function Incidents() {
  const { incidents } = useSafety();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — Incident Investigation Desk"
        subtitle="Escalated safety breaches, active supervisor investigation files, and containment workflows."
      />

      {/* Screen 8 Incidents Table */}
      <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/40 border-b border-white/[0.06] flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-white uppercase tracking-wider">
            Incident Investigation Records ({incidents.length})
          </span>
          <span className="text-cyan-400">Tactical Docket Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.08]">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Related Alert</th>
                <th className="p-4">Docket Breach / Title</th>
                <th className="p-4">Facility Sector</th>
                <th className="p-4">Date / Time</th>
                <th className="p-4">Assigned Officer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-cyan-400">{inc.id}</td>
                  <td className="p-4 text-slate-500 font-bold">
                    {inc.relatedAlert || inc.alert || '—'}
                  </td>
                  <td className="p-4 font-semibold text-white font-sans">{inc.title}</td>
                  <td className="p-4 text-slate-300 font-sans">{inc.location}</td>
                  <td className="p-4 text-slate-500">
                    {inc.date} {inc.time ? `• ${inc.time}` : ''}
                  </td>
                  <td className="p-4 text-slate-300 font-sans">
                    {inc.assignedUser || inc.assignedTo || 'Unassigned'}
                  </td>
                  <td className="p-4">
                    <Badge
                      type={
                        inc.status === 'OPEN'
                          ? 'danger'
                          : inc.status === 'IN_PROGRESS'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] inline-block"
                    >
                      Open Case →
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
