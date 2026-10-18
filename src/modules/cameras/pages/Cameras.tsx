import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function Cameras() {
  const { cameras, activeMobileStream, searchQuery, setSearchQuery } = useSafety();
  const [filter, setFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery || '');

  const effectiveSearch = localSearch || searchQuery;

  const filtered = cameras.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.location.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.zone.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Optical Sensor Fleet & Live Cameras"
        subtitle="Manage distributed camera telemetry nodes, real-time FPS feeds, and optical surveillance perimeters."
      >
        <Link
          to="/camera-source"
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 border border-cyan-300/40"
        >
          <span>📱</span>
          <span>PAIR MOBILE CCTV NODE</span>
        </Link>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] shadow-lg">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'online', 'warning', 'offline'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === status
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80 relative">
          <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-mono">🔍</span>
          <input
            type="text"
            placeholder="Filter by ID, zone, or location..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-all"
          />
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((camera) => {
          const isLive = camera.status === 'online' || (camera.id === 'CAM-MOBILE-001' && activeMobileStream !== null);

          return (
            <div
              key={camera.id}
              className="relative overflow-hidden rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Video / Snapshot Surface */}
                <div className="h-48 bg-slate-950 relative flex items-center justify-center border-b border-white/[0.06] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

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
                  ) : camera.image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-65 filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${camera.image})` }}
                    />
                  ) : (
                    <div className="text-slate-600 font-mono text-xs">FEED INACTIVE</div>
                  )}

                  {/* Corner reticles */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/50" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/50" />

                  {/* Node ID */}
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10 z-10">
                    {camera.id}
                  </span>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
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
                  </div>

                  {isLive && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </div>
                  )}
                </div>

                {/* Metadata content */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {camera.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{camera.location}</p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                      {camera.zone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-white/[0.06] mt-2 text-xs font-mono">
                <span className="text-slate-400">
                  Detections:{' '}
                  <span className="font-bold text-cyan-400">{camera.detections}</span>
                </span>

                <Link
                  to={`/cameras/${camera.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold text-xs rounded-xl transition-all border border-white/10 hover:border-cyan-400"
                >
                  Inspect Feed →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
