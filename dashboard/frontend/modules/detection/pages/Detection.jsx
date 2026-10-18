import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";

export default function Detection() {
  const [detectionData, setDetectionData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getDetection();
      if (res) setDetectionData(res);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center"
        subtitle="Real-time Computer Vision bounding box stream & instant PPE hazard detection."
      />

      {/* Screen 5 Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bounding Box Live Canvas */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-black/20">
          <div className="h-[460px] bg-slate-50 relative flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80')`
              }}
            />

            {/* Live Camera Tag */}
            <div className="absolute top-4 left-4 bg-white/90 text-blue-600 text-xs font-mono font-bold px-3 py-1 rounded-md border border-slate-300">
              STREAM: Warehouse - CAM-A01
            </div>

            {/* Bounding Box 1 (Green - Helmet OK) */}
            <div className="absolute top-16 left-32 w-44 h-64 border-2 border-emerald-400 rounded p-1 bg-emerald-500/10 animate-pulse">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Worker - Helmet OK (96%)
              </span>
            </div>

            {/* Bounding Box 2 (Red - Missing Vest) */}
            <div className="absolute top-28 right-40 w-48 h-60 border-2 border-rose-500 rounded p-1 bg-rose-500/15">
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                ⚠️ Violation: Missing Safety Vest (89%)
              </span>
            </div>

            {/* Bounding Box 3 (Yellow - Forklift Active) */}
            <div className="absolute bottom-12 left-1/3 w-60 h-36 border-2 border-amber-400 rounded p-1 bg-amber-500/10">
              <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Forklift Machine (94%)
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono">YOLOv8 CV Engine v2.4 Active</span>
            <span className="text-emerald-400 font-semibold">● 30 FPS Stream Healthy</span>
          </div>
        </div>

        {/* Right Analytics Side Panel (Matching Screen 5) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 uppercase tracking-wider">
              AI Analytics Console
            </h3>

            {/* Stats list */}
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Active Detections</span>
                <p className="text-2xl font-bold text-blue-600 font-mono">
                  {detectionData?.activeDetectionsCount || 4} Objects
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">PPE Compliance Score</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono">
                  {detectionData?.ppeCompliance || 94.2}%
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Restricted Zone Intrusions</span>
                <p className="text-2xl font-bold text-slate-900 font-mono">
                  {detectionData?.restrictedZoneBreaches || 0} Breaches
                </p>
              </div>
            </div>

            {/* Real-time Detection Event Stream */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Real-Time Event Stream
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-300 flex justify-between">
                  <span className="text-slate-800">Worker Detected</span>
                  <span className="text-emerald-400 font-mono">14:42:10</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-300 flex justify-between">
                  <span className="text-rose-400 font-semibold">Missing Vest</span>
                  <span className="text-rose-400 font-mono">14:38:05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
