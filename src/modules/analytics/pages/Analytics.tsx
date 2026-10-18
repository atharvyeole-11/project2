import React, { useState } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';

export default function Analytics() {
  const { analytics, alerts, incidents } = useSafety();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  const hazardBreakdown = analytics.hazardBreakdown || [
    { category: 'Missing Safety Helmet', count: 48, percentage: 37.5, color: 'bg-rose-500', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]' },
    { category: 'No High-Vis Safety Vest', count: 34, percentage: 26.5, color: 'bg-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
    { category: 'Restricted Zone Intrusion', count: 28, percentage: 21.8, color: 'bg-violet-500', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.6)]' },
    { category: 'Heavy Machinery Proximity', count: 18, percentage: 14.2, color: 'bg-cyan-400', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.6)]' },
  ];

  // Hourly density data for visualization
  const hourlyData = [
    { hour: '06:00', events: 2, level: 20 },
    { hour: '08:00', events: 8, level: 65 },
    { hour: '10:00', events: 14, level: 90 },
    { hour: '12:00', events: 6, level: 45 },
    { hour: '14:00', events: 11, level: 75 },
    { hour: '16:00', events: 13, level: 85 },
    { hour: '18:00', events: 5, level: 40 },
    { hour: '20:00', events: 3, level: 25 },
    { hour: '22:00', events: 1, level: 10 },
  ];

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Time Range', timeRange],
      ['Total Detections Today', analytics.totalDetections],
      ['Total Alerts Recorded', alerts.length],
      ['Resolved Incidents', analytics.resolvedIncidents],
      ['Detection Precision', `${analytics.detectionPrecision}%`],
      ['False Alert Rate', `${analytics.falseAlertRate}%`],
      ['Avg Response Time', analytics.avgResponseTime || '1m 38s'],
      [],
      ['Hazard Category', 'Event Count', 'Percentage Ratio'],
      ...hazardBreakdown.map((h) => [h.category, h.count, `${h.percentage}%`]),
      [],
      ['Alert ID', 'Type', 'Location', 'Priority', 'Status', 'Timestamp'],
      ...alerts.map((a) => [a.id, a.type, a.location, a.priority, a.status, a.time]),
      [],
      ['Incident ID', 'Title', 'Location', 'Status', 'Assigned Officer'],
      ...incidents.map((i) => [i.id, i.title, i.location, i.status, i.assignedUser || i.assignedTo || 'Unassigned']),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((cell) => `"${cell !== undefined ? cell : ''}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sitesentry-safety-telemetry-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Predictive Safety Intelligence & Analytics"
          subtitle="Neural model precision benchmarks, temporal hazard density, and supervisor response telemetry."
        />

        {/* Time-Range Selector Pill */}
        <div className="flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] p-1 rounded-2xl shadow-lg self-start sm:self-auto">
          {(['24h', '7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Frosted Glass Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Detection Precision
            </span>
            <span className="text-cyan-400 text-xs font-mono">🎯</span>
          </div>
          <p className="text-3xl font-black text-cyan-400 font-mono mt-2 tracking-tight group-hover:text-cyan-300">
            {analytics.detectionPrecision}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-emerald-400">
            <span>▲ +1.2%</span>
            <span className="text-slate-500">• YOLO11 model accuracy</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              False Alert Rate
            </span>
            <span className="text-emerald-400 text-xs font-mono">🛡️</span>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2 tracking-tight group-hover:text-emerald-300">
            {analytics.falseAlertRate}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-emerald-400">
            <span>▼ -0.5%</span>
            <span className="text-slate-500">• Optimal false negative limit</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Avg Response Time
            </span>
            <span className="text-amber-400 text-xs font-mono">⏱️</span>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono mt-2 tracking-tight group-hover:text-amber-300">
            {analytics.avgResponseTime || '1 min 38s'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-emerald-400">
            <span>▲ 18s</span>
            <span className="text-slate-500">• Supervisor dispatch acceleration</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Docket Resolution
            </span>
            <span className="text-blue-400 text-xs font-mono">✅</span>
          </div>
          <p className="text-3xl font-black text-blue-400 font-mono mt-2 tracking-tight group-hover:text-blue-300">
            {analytics.incidentsResolved || 95.8}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
            <span>Target: &gt;90% resolved</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hazard Breakdown & Hourly Temporal Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hazard Breakdown with Glowing Meters */}
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Hazard Classification Distribution
                </h3>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">
                Period: {timeRange.toUpperCase()} (Total {alerts.length} Incidents)
              </span>
            </div>

            <div className="space-y-4">
              {hazardBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-200 font-medium">{item.category}</span>
                    <span className="text-cyan-300 font-bold">
                      {item.count} events ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/[0.06] p-0.5">
                    <div
                      className={`h-full rounded-full ${item.color} ${item.glow || ''} transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temporal Detection Activity Bar Graph */}
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Shift Hazard Frequency Timeline (24H Radar)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">PEAK SHIFT: 10:00 - 16:00</span>
            </div>

            <div className="grid grid-cols-9 gap-2 items-end h-36 pt-6 pb-2 border-b border-white/[0.06]">
              {hourlyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[9px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                    {d.events}
                  </span>
                  <div className="w-full max-w-[28px] bg-slate-950/90 rounded-t-lg p-0.5 flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-blue-400 rounded-t shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:from-cyan-400 group-hover:to-white transition-all duration-500"
                      style={{ height: `${d.level}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-2">{d.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Performance Benchmarks & Export Card */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Command Response Benchmarks</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-slate-300">
                    <span>Shift Supervisor Review:</span>
                    <span className="text-emerald-400 font-bold">98.2%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-emerald-400 shadow-[0_0_8px_#34d399] w-[98.2%]" />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-slate-300">
                    <span>Containment Compliance:</span>
                    <span className="text-cyan-400 font-bold">94.6%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] w-[94.6%]" />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-slate-300">
                    <span>Hardware Sensor Uptime:</span>
                    <span className="text-emerald-400 font-bold">99.9%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-emerald-400 shadow-[0_0_8px_#34d399] w-[99.9%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Export CSV Button */}
            <div className="pt-6 border-t border-white/[0.06] mt-6">
              <button
                onClick={handleExportCSV}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer flex items-center justify-center gap-2 border border-cyan-300/40 uppercase tracking-wider"
              >
                <span>📥</span>
                <span>Export Safety Analytics CSV</span>
              </button>
              <p className="text-[10px] font-mono text-slate-500 text-center mt-2">
                Exports structured audit logs, hazard breakdowns, and model precision metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
