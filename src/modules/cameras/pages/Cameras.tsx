import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function Cameras() {
  const { cameras, activeMobileStream } = useSafety();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = cameras.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — Camera Fleet"
        subtitle="Active CCTV node streams, location telemetry, and AI detection monitoring."
      >
        <Link
          to="/camera-source"
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
        >
          <span>📱</span>
          <span>Open Mobile CCTV Node</span>
        </Link>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'online', 'warning', 'offline'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter === status
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search cameras by ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((camera) => (
          <div
            key={camera.id}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 transition-all duration-300 shadow-sm group flex flex-col justify-between"
          >
            <div>
              {/* Simulated Video Preview Box */}
              <div className="h-44 bg-slate-950 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

                {camera.id === 'CAM-MOBILE-001' && activeMobileStream ? (
                  <video
                    ref={(v) => {
                      if (v && activeMobileStream) v.srcObject = activeMobileStream;
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* Bounding Box Visual Overlay */}
                    {camera.status === 'online' && (
                      <div className="absolute inset-6 border border-emerald-500/40 rounded flex items-start p-1 text-[9px] font-mono text-emerald-400">
                        <span className="bg-emerald-500/20 px-1 rounded border border-emerald-500/30">
                          Worker - Helmet OK (96%)
                        </span>
                      </div>
                    )}
                    {camera.status === 'warning' && (
                      <div className="absolute inset-6 border border-rose-500/40 rounded flex items-start p-1 text-[9px] font-mono text-rose-400">
                        <span className="bg-rose-500/20 px-1 rounded border border-rose-500/30">
                          ⚠️ Chemical Perimeter Warning
                        </span>
                      </div>
                    )}
                  </>
                )}

                <span className="text-slate-400 text-xs font-mono relative z-10 bg-slate-950/70 px-2 py-0.5 rounded">
                  FEED: {camera.id}
                </span>

                <span className="absolute top-3 right-3">
                  <Badge
                    type={
                      camera.status === 'online'
                        ? 'success'
                        : camera.status === 'warning'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {camera.status}
                  </Badge>
                </span>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm truncate">{camera.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{camera.location}</p>
                  </div>
                  <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap">
                    {camera.zone}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500">
                AI Detections: <span className="font-bold text-slate-800">{camera.detections}</span>
              </span>

              <Link
                to={`/cameras/${camera.id}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                View Stream →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
