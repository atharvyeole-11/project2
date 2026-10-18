import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { incidents as mockIncidents } from "../../../data/incidents";
import Badge from "../../../shared/components/Badge";

export default function Incidents() {
  const [incidents, setIncidents] = useState(mockIncidents);

  useEffect(() => {
    async function load() {
      const res = await api.getIncidents();
      if (res) setIncidents(res);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — Incident Management"
        subtitle="Escalated safety breaches, investigation workflows, and assigned safety personnel log."
      />

      {/* Screen 8 Incidents Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">Incident Record Log ({incidents.length})</span>
          <span className="text-slate-500">Sorted by Severity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Incident ID</th>
                <th className="p-3">Related Alert</th>
                <th className="p-3">Title / Description</th>
                <th className="p-3">Location</th>
                <th className="p-3">Date / Time</th>
                <th className="p-3">Assigned User</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">View Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-blue-600 font-bold">{inc.id}</td>
                  <td className="p-3 font-mono text-slate-500">{inc.relatedAlert}</td>
                  <td className="p-3 font-semibold text-slate-900">{inc.title}</td>
                  <td className="p-3">{inc.location}</td>
                  <td className="p-3 font-mono text-slate-500">{inc.time}</td>
                  <td className="p-3">{inc.assignedUser}</td>
                  <td className="p-3">
                    <Badge type={inc.status === "OPEN" ? "danger" : inc.status === "IN_PROGRESS" ? "warning" : "success"}>
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href={`/incidents/${inc.id}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[11px]"
                    >
                      Open File →
                    </a>
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
