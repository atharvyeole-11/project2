import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { cameras as mockCameras } from "../../../data/cameras";
import { zones as mockZones } from "../../../data/zones";

export default function SiteMap() {
  const [selectedZone, setSelectedZone] = useState("all");
  const [activeCamera, setActiveCamera] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getSiteMap();
      if (res) setData(res);
    }
    load();
  }, []);

  const camerasList = data?.cameras || mockCameras;
  const zonesList = data?.zones || mockZones;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — Interactive 3D Site Blueprint Map"
        subtitle="Facility coordinate mesh, zone hazard overlays, and CCTV node locations."
      />

      {/* Screen 10 Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facility Zones:</span>
          <button
            onClick={() => setSelectedZone("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedZone === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            All Facility Zones
          </button>
          {zonesList.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedZone === z.name ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
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
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 min-h-[460px] relative overflow-hidden flex flex-col justify-between shadow-lg shadow-black/20">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Isometric Facility Mesh & Camera Pin Overlays
            </h3>
            <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Live Coordinates Connected
            </span>
          </div>

          {/* Isometric Zone Cards */}
          <div className="relative z-10 grid grid-cols-2 gap-4 my-auto">
            {zonesList.map((zone) => {
              const zoneCams = camerasList.filter((c) => c.zone === zone.name);
              const isSelected = selectedZone === "all" || selectedZone === zone.name;

              return (
                <div
                  key={zone.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isSelected ? "opacity-100 scale-100" : "opacity-40 scale-95"
                  } ${
                    zone.riskLevel === "High"
                      ? "bg-rose-950/30 border-rose-500/50 hover:border-rose-400"
                      : zone.riskLevel === "Medium"
                      ? "bg-amber-950/30 border-amber-500/50 hover:border-amber-400"
                      : "bg-slate-50 border-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-sm">{zone.name}</h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        zone.riskLevel === "High"
                          ? "bg-rose-500/20 text-rose-400"
                          : zone.riskLevel === "Medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {zone.riskLevel} Risk
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {zoneCams.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamera(cam)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          activeCamera?.id === cam.id
                            ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20"
                            : "bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cam.status === "online" ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span>{cam.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-500 text-right mt-4 font-mono">
            Click any camera pin to inspect live node metrics.
          </div>
        </div>

        {/* Node Telemetry Inspector */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-black/20">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {activeCamera ? `Node Inspector: ${activeCamera.name}` : "Select Camera Node"}
            </h3>

            {activeCamera ? (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Node ID:</span>
                  <span className="font-mono text-blue-600 font-bold">{activeCamera.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Assigned Zone:</span>
                  <span className="text-slate-800 font-semibold">{activeCamera.zone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-800">{activeCamera.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Active Detections:</span>
                  <span className="text-slate-900 font-bold font-mono">{activeCamera.detections} Objects</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-500 text-lg">
                  📍
                </div>
                <p className="text-xs">Click on any camera pin on the site map layout.</p>
              </div>
            )}
          </div>

          {activeCamera && (
            <a
              href={`/cameras/${activeCamera.id}`}
              className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors mt-6 block"
            >
              Open Full Stream →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
