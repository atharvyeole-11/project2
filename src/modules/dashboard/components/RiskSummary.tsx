import React from 'react';
import { useSafety } from '../../../context/SafetyContext';

export default function RiskSummary() {
  const { zones, alerts, systemHealth, systemHealthState } = useSafety();

  const criticalCount = alerts.filter(
    (a) => a.priority === 'CRITICAL' && a.status !== 'RESOLVED'
  ).length;
  const highCount = alerts.filter(
    (a) => a.priority === 'HIGH' && a.status !== 'RESOLVED'
  ).length;

  const highPercent = Math.min(100, Math.max(10, criticalCount * 14 + 10));
  const mediumPercent = Math.min(100 - highPercent, Math.max(20, highCount * 10 + 15));
  const lowPercent = Math.max(0, 100 - highPercent - mediumPercent);

  const riskData = [
    { label: 'Low Risk Clear Sectors', percent: lowPercent, color: 'bg-emerald-500', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]' },
    { label: 'Medium Attention Buffer', percent: mediumPercent, color: 'bg-amber-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]' },
    { label: 'Critical Hazard Breaches', percent: highPercent, color: 'bg-rose-500', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] shadow-xl flex flex-col justify-between">
      {/* Top subtle glow edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
              Site Risk Index & Radar
            </h2>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              systemHealthState === 'nominal'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : systemHealthState === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {systemHealth}
          </span>
        </div>

        {/* Futuristic Meter Bars */}
        <div className="space-y-3.5 mb-6">
          {riskData.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-mono text-[11px]">{item.label}</span>
                <span className="font-bold font-mono text-white text-[11px]">
                  {item.percent}%
                </span>
              </div>
              <div className="h-2 bg-slate-950/80 rounded-full overflow-hidden border border-white/[0.05] p-0.5">
                <div
                  className={`h-full ${item.color} ${item.glow} rounded-full transition-all duration-700`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Zones Status List */}
      <div className="border-t border-white/[0.06] pt-4">
        <h3 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
          Perimeter Grid Zones
        </h3>
        <div className="space-y-1.5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/50 border border-white/[0.04] hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    zone.risk === 'HIGH'
                      ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                      : zone.risk === 'MEDIUM'
                      ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  }`}
                />
                <span className="text-slate-200 font-medium text-xs">{zone.name}</span>
              </div>
              <span className="text-cyan-400 font-mono text-[10px] font-bold">
                {zone.cameras} Cams • {zone.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
