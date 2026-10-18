import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { alerts as mockAlerts } from "../../../data/alerts";
import Badge from "../../../shared/components/Badge";

export default function AlertDetails() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const res = await api.getAlerts();
      if (res) setAlerts(res);
    }
    load();
  }, []);

  const filtered = alerts.filter(a => filter === "all" || a.priority === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — Alert History & Logs"
        subtitle="Complete audit log of all computer vision safety detections across facility camera nodes."
      />

      {/* Screen 7 Alert Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <div className="flex space-x-2">
            {["all", "CRITICAL", "HIGH", "MEDIUM"].map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  filter === p ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono">{filtered.length} Total Alerts Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Alert ID</th>
                <th className="p-3">Alert Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Camera Node</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-blue-600 font-bold">{alert.id}</td>
                  <td className="p-3 font-semibold text-slate-900">{alert.type}</td>
                  <td className="p-3">{alert.location}</td>
                  <td className="p-3">{alert.camera}</td>
                  <td className="p-3 font-mono text-slate-500">{alert.time}</td>
                  <td className="p-3">
                    <Badge type={alert.priority === "CRITICAL" ? "danger" : "warning"}>
                      {alert.priority}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800">{alert.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href="/alerts"
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-semibold border border-blue-300"
                    >
                      Inspect →
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
