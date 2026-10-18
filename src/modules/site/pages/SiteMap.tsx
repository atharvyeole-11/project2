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
        title="Safety Operations Center — Interactive 3D Site Blueprint Map"
        subtitle="Facility coordinate mesh, zone hazard overlays, and CCTV node locations."
      />

      {/* Screen 10 Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Facility Zones:
          </span>
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedZone === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Facility Zones
          </button>
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedZone === z.name
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> Low Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk / Breach
          </span>
        </div>
      </div>

      {/* Screen 10 3D Blueprint Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 min-h-[480px] relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Isometric Facility Mesh & Camera Pin Overlays
            </h3>
            <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-bold">
              ● Live Coordinates Connected
            </span>
          </div>

          {/* Isometric Zone Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
            {zones.map((zone) => {
              const zoneCams = cameras.filter((c) => c.zone === zone.name);
              const isSelected = selectedZone === 'all' || selectedZone === zone.name;

              return (
                <div
                  key={zone.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  } ${
                    zone.risk === 'HIGH'
                      ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400'
                      : zone.risk === 'MEDIUM'
                      ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-sm">{zone.name}</h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        zone.risk === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : zone.risk === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {zone.risk} Risk
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zoneCams.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamera(cam)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          activeCamera?.id === cam.id
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cam.status === 'online'
                              ? 'bg-emerald-400'
                              : cam.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
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
            Click any camera pin on the facility grid to inspect live telemetry.
          </div>
        </div>

        {/* Node Telemetry Inspector */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {activeCamera ? `Node Inspector: ${activeCamera.name}` : 'Select Camera Node'}
            </h3>

            {activeCamera ? (
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Node Identifier:</span>
                  <span className="font-mono text-blue-600 font-bold">{activeCamera.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Facility Zone:</span>
                  <span className="text-slate-800 font-semibold">{activeCamera.zone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Exact Location:</span>
                  <span className="text-slate-800">{activeCamera.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span
                    className={`font-bold font-mono ${
                      activeCamera.status === 'online'
                        ? 'text-emerald-600'
                        : activeCamera.status === 'warning'
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {activeCamera.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Active AI Detections:</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {activeCamera.detections} Objects
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-500 text-lg">
                  📍
                </div>
                <p className="text-xs">Click on any camera pin on the site map layout.</p>
              </div>
            )}
          </div>

          {activeCamera && (
            <Link
              to={`/cameras/${activeCamera.id}`}
              className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors mt-6 block shadow-md shadow-blue-600/20"
            >
              Open Full Stream →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
