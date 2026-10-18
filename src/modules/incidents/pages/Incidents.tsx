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
        title="Safety Operations Center — Incident Management"
        subtitle="Escalated safety breaches, investigation workflows, and assigned safety personnel log."
      />

      {/* Screen 8 Incidents Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900">
            Incident Investigation Records ({incidents.length})
          </span>
          <span className="text-slate-400 font-mono">Real-Time Operational Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Incident ID</th>
                <th className="p-3.5">Related Alert</th>
                <th className="p-3.5">Case Title / Breach</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Date / Time</th>
                <th className="p-3.5">Assigned Officer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">View Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-blue-600 font-bold">{inc.id}</td>
                  <td className="p-3.5 font-mono text-slate-500">
                    {inc.relatedAlert || inc.alert || '—'}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">{inc.title}</td>
                  <td className="p-3.5">{inc.location}</td>
                  <td className="p-3.5 font-mono text-slate-400">
                    {inc.date} {inc.time ? `• ${inc.time}` : ''}
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">
                    {inc.assignedUser || inc.assignedTo || 'Unassigned'}
                  </td>
                  <td className="p-3.5">
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
                  <td className="p-3.5 text-right">
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors inline-block"
                    >
                      Open File →
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
