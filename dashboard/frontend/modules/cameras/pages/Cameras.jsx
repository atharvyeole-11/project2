import { useEffect, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { cameras as mockCameras } from "../../../data/cameras";
import Badge from "../../../shared/components/Badge";

export default function Cameras() {
  const [cameras, setCameras] = useState(mockCameras);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res = await api.getCameras();
      if (res) setCameras(res);
    }
    load();
  }, []);

  const filtered = cameras.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center"
        subtitle="Active CCTV node streams, location telemetry, and AI detection monitoring."
      />

      {/* Filter & Search Bar (Matching Screen 3) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2">
          {["all", "online", "warning", "offline"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search cameras by ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Cameras Grid (Matching Screen 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((camera) => (
          <div
            key={camera.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all duration-300 shadow-lg shadow-black/20 group flex flex-col justify-between"
          >
            <div>
              {/* Simulated Video Preview Box */}
              <div className="h-44 bg-slate-50 relative flex items-center justify-center border-b border-slate-200">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Bounding Box Visual Overlay */}
                <div className="absolute inset-6 border border-emerald-500/40 rounded flex items-start p-1 text-[9px] font-mono text-emerald-400">
                  <span className="bg-emerald-500/20 px-1 rounded border border-emerald-500/30">Worker - Helmet OK (96%)</span>
                </div>

                <span className="text-slate-500 text-xs font-mono">
                  FEED: {camera.id}
                </span>

                <span className="absolute top-3 right-3">
                  <Badge type={camera.status === "online" ? "success" : camera.status === "warning" ? "warning" : "danger"}>
                    {camera.status}
                  </Badge>
                </span>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{camera.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{camera.location}</p>
                  </div>
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {camera.zone}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-200 mt-2">
              <span className="text-xs text-slate-500">
                AI Detections: <span className="font-bold text-slate-800">{camera.detections}</span>
              </span>

              <a
                href={`/cameras/${camera.id}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors"
              >
                View Stream →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
