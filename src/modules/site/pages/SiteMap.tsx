import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import { Camera } from '../../../types';
import PageHeader from '../../../shared/components/PageHeader';

export default function SiteMap() {
  const { cameras, zones } = useSafety();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeCamera, setActiveCamera] = useState<Camera | null>(cameras[0] || null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive 3D Isometric Site Blueprint Map"
        subtitle="Facility spatial coordinate mesh, perimeter hazard boundary overlays, and optical camera node matrix."
      />

      {/* Screen 10 Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
            Facility Zones:
          </span>
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedZone === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
            }`}
          >
            All Facility Zones
          </button>
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedZone === z.name
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/[0.05]'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Low Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" /> Medium Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" /> High Hazard / Breach
          </span>
        </div>
      </div>

      {/* Screen 10 3D Blueprint Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 min-h-[500px] relative overflow-hidden flex flex-col justify-between shadow-xl">
          {/* Cyber Coordinate Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.1)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Radar Sweep Animation in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none">
            <div className="w-full h-full rounded-full border border-dashed border-cyan-500/20 animate-radar pointer-events-none" />
          </div>

          <div className="relative z-10 flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Isometric Spatial Mesh & Optical Sensor Pins</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
              ● Coordinates Locked (42.3601° N, 71.0589° W)
            </span>
          </div>

          {/* Isometric Zone Cards with glowing borders */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
            {zones.map((zone) => {
              const zoneCams = cameras.filter((c) => c.zone === zone.name);
              const isSelected = selectedZone === 'all' || selectedZone === zone.name;

              return (
                <div
                  key={zone.id}
                  className={`p-4.5 rounded-2xl border transition-all duration-300 ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-35 scale-95'
                  } ${
                    zone.risk === 'HIGH'
                      ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : zone.risk === 'MEDIUM'
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-slate-950/60 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide">
                      {zone.name}
                    </h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        zone.risk === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : zone.risk === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {zone.risk} RISK
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zoneCams.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamera(cam)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          activeCamera?.id === cam.id
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cam.status === 'online'
                              ? 'bg-emerald-400 animate-pulse'
                              : cam.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-slate-500'
                          }`}
                        />
                        <span>{cam.name.split('-')[0].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 text-right mt-4 font-mono">
            Click on any sensor pin to activate live node telemetry inspection.
          </div>
        </div>

        {/* Node Telemetry Inspector */}
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{activeCamera ? `Sensor: ${activeCamera.name}` : 'Select Sensor Pin'}</span>
            </h3>

            {activeCamera ? (
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">Node Identifier:</span>
                  <span className="text-cyan-400 font-bold">{activeCamera.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">Facility Sector:</span>
                  <span className="text-slate-200 font-semibold">{activeCamera.zone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">Exact Coordinates:</span>
                  <span className="text-slate-200">{activeCamera.location}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">Operating Status:</span>
                  <span
                    className={`font-bold ${
                      activeCamera.status === 'online'
                        ? 'text-emerald-400'
                        : activeCamera.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {activeCamera.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Active AI Detections:</span>
                  <span className="text-cyan-400 font-bold">
                    {activeCamera.detections} Tracked Objects
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2 font-mono">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400 text-lg border border-white/10">
                  📍
                </div>
                <p className="text-xs">Click on any sensor pin on the site map grid.</p>
              </div>
            )}
          </div>

          {activeCamera && (
            <Link
              to={`/cameras/${activeCamera.id}`}
              className="w-full text-center py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] mt-6 block border border-cyan-300/40 uppercase tracking-wider"
            >
              Open Full Optical Stream →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
