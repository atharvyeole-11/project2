import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    async function load() {
      const res = await api.getAnalytics();
      if (res) setData(res);
    }
    load();
  }, []);

  const hazardBreakdown = data?.hazardBreakdown || [
    { category: "Missing Helmet", count: 48, percentage: 37.5, color: "bg-rose-500" },
    { category: "No Safety Vest", count: 34, percentage: 26.5, color: "bg-amber-500" },
    { category: "Restricted Intrusion", count: 28, percentage: 21.8, color: "bg-purple-500" },
    { category: "Forklift Speeding", count: 18, percentage: 14.2, color: "bg-blue-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Safety Operations Center — Analytics & Intelligence"
          subtitle="AI model precision metrics, false alert rate analysis, and incident resolution benchmarks."
        />

        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl">
          {["24h", "7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                timeRange === r ? "bg-blue-600 text-white" : "text-slate-500"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Screen 11 Gauges & KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-lg shadow-black/20">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Detection Precision</span>
          <p className="text-3xl font-extrabold text-blue-600 font-mono mt-2">{data?.detectionPrecision || 97}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">+1.2% model accuracy</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-lg shadow-black/20">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">False Alert Rate</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{data?.falseAlertRate || 2}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">-0.5% lower false positives</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-lg shadow-black/20">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Avg Response Time</span>
          <p className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{data?.avgResponseTime || "1 min 38s"}</p>
          <span className="text-[10px] text-emerald-400 font-mono">18s faster supervisor dispatch</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl text-center shadow-lg shadow-black/20">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Incidents Resolved</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{data?.incidentsResolved || 95}%</p>
          <span className="text-[10px] text-slate-500 font-mono">Target: &gt;90% resolution</span>
        </div>
      </div>

      {/* Screen 11 Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hazard Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-lg shadow-black/20">
          <h3 className="text-base font-bold text-slate-900 mb-4">Detected Safety Violations Breakdown</h3>

          <div className="space-y-4">
            {hazardBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">{item.category}</span>
                  <span className="font-mono text-blue-600 font-bold">{item.count} events ({item.percentage}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color || "bg-blue-600"}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary Bar Widget */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-black/20">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">Execution Performance</h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Shift Supervisor Alert Review</span>
                  <span className="text-emerald-400 font-mono">98%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[98%]" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Incident Resolution Rate</span>
                  <span className="text-blue-600 font-mono">95%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-2 bg-slate-100 hover:bg-slate-700 text-blue-600 font-semibold text-xs rounded-lg transition-colors border border-slate-300 mt-4">
            Export Analytics CSV Data ↓
          </button>
        </div>
      </div>
    </div>
  );
}
