import React, { useState } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';

export default function Analytics() {
  const { analytics, alerts, incidents } = useSafety();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  const hazardBreakdown = analytics.hazardBreakdown || [
    { category: 'Missing Helmet', count: 48, percentage: 37.5, color: 'bg-rose-500' },
    { category: 'No Safety Vest', count: 34, percentage: 26.5, color: 'bg-amber-500' },
    { category: 'Restricted Intrusion', count: 28, percentage: 21.8, color: 'bg-purple-500' },
    { category: 'Forklift Speeding', count: 18, percentage: 14.2, color: 'bg-blue-600' }
  ];

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Time Range', timeRange],
      ['Total Detections', analytics.totalDetections],
      ['Total Alerts', alerts.length],
      ['Resolved Incidents', analytics.resolvedIncidents],
      ['Detection Precision', `${analytics.detectionPrecision}%`],
      ['False Alert Rate', `${analytics.falseAlertRate}%`],
      ['Avg Response Time', analytics.avgResponseTime || '1m 38s'],
      [],
      ['Category', 'Violation Count', 'Percentage'],
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
    link.setAttribute('download', `sitesentry-safety-analytics-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety Operations Center — Analytics & Intelligence"
          subtitle="AI model precision metrics, false alert rate analysis, and incident resolution benchmarks."
        />

        <div className="flex items-center bg-white border border-slate-200/90 p-1 rounded-2xl shadow-sm self-start sm:self-auto">
          {(['24h', '7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Screen 11 Gauges & KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl text-center shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Detection Precision
          </span>
          <p className="text-3xl font-extrabold text-blue-600 font-mono mt-2">
            {analytics.detectionPrecision}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono block mt-1">
            +1.2% model accuracy
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl text-center shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            False Alert Rate
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-2">
            {analytics.falseAlertRate}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono block mt-1">
            -0.5% lower false positives
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl text-center shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Avg Response Time
          </span>
          <p className="text-3xl font-extrabold text-amber-500 font-mono mt-2">
            {analytics.avgResponseTime || '1 min 38s'}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono block mt-1">
            18s faster supervisor dispatch
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl text-center shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Incidents Resolved
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-2">
            {analytics.incidentsResolved || 95}%
          </p>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">
            Target: &gt;90% resolution
          </span>
        </div>
      </div>

      {/* Screen 11 Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hazard Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Detected Safety Violations Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Aggregate Period: {timeRange.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4">
            {hazardBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-semibold">{item.category}</span>
                  <span className="font-mono text-blue-600 font-bold">
                    {item.count} events ({item.percentage}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color || 'bg-blue-600'} transition-all duration-700`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary Bar Widget */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Execution Performance
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Shift Supervisor Alert Review</span>
                  <span className="text-emerald-600 font-mono font-bold">98%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Incident Resolution Rate</span>
                  <span className="text-blue-600 font-mono font-bold">95%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-600 w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-blue-600 font-semibold text-xs rounded-xl transition-colors border border-slate-200 mt-6 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>↓</span>
            <span>Export Analytics CSV Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
