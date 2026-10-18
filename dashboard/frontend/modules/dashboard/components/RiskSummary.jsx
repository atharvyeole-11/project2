import { zones } from "../../../data/zones";

export default function RiskSummary() {
  const riskData = [
    { label: "Low Risk", percent: 62, color: "bg-emerald-500" },
    { label: "Medium Risk", percent: 25, color: "bg-amber-500" },
    { label: "High Risk", percent: 13, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg shadow-black/20">
      <h2 className="font-bold text-base text-slate-900 mb-5">
        Risk Assessment Summary
      </h2>

      <div className="space-y-4 mb-6">
        {riskData.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">{item.label}</span>
              <span className="font-bold font-mono text-slate-800">{item.percent}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Facility Zones</h3>
        <div className="space-y-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    zone.riskLevel === "High"
                      ? "bg-rose-500"
                      : zone.riskLevel === "Medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="text-slate-800 font-medium">{zone.name}</span>
              </div>
              <span className="text-blue-600 font-mono text-[11px]">{zone.riskLevel} Risk</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}