import React from 'react';
import { useSafety } from '../../../context/SafetyContext';

export default function RiskSummary() {
  const { zones, alerts } = useSafety();

  const criticalCount = alerts.filter(a => a.priority === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highCount = alerts.filter(a => a.priority === 'HIGH' && a.status !== 'RESOLVED').length;

  const highPercent = Math.min(100, Math.max(10, criticalCount * 12 + 10));
  const mediumPercent = Math.min(100 - highPercent, Math.max(20, highCount * 8 + 15));
  const lowPercent = Math.max(0, 100 - highPercent - mediumPercent);

  const riskData = [
    { label: 'Low Risk Zones', percent: lowPercent, color: 'bg-emerald-500' },
    { label: 'Medium Attention', percent: mediumPercent, color: 'bg-amber-500' },
    { label: 'High / Critical Hazard', percent: highPercent, color: 'bg-rose-500' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Risk Assessment Summary
          </h2>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            Real-time Telemetry
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3.5 mb-6">
          {riskData.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">{item.label}</span>
                <span className="font-bold font-mono text-slate-800">{item.percent}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Zones List */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Monitored Facility Zones
        </h3>
        <div className="space-y-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    zone.risk === 'HIGH'
                      ? 'bg-rose-500 ring-2 ring-rose-200'
                      : zone.risk === 'MEDIUM'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-slate-800 font-medium">{zone.name}</span>
              </div>
              <span className="text-blue-600 font-mono text-[11px] font-bold">
                {zone.cameras} Cams • {zone.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
