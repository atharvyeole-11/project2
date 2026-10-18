import React, { useState, useEffect } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';

export default function Detection() {
  const { alerts, aiEngineName, triggerManualAlert } = useSafety();
  const [eventStream, setEventStream] = useState([
    { event: 'Worker Tracked: Helmet & Vest Compliant', time: '14:42:10', type: 'ok', class: 'Person #104' },
    { event: '⚠️ PPE Violation: Missing High-Vis Safety Vest', time: '14:38:05', type: 'violation', class: 'no_vest' },
    { event: 'Forklift Machine Proximity Vector Tracked', time: '14:31:18', type: 'warning', class: 'machinery' },
    { event: 'Inference Pipeline Synchronized — 30 FPS', time: '14:25:00', type: 'info', class: 'system' },
  ]);

  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[0];
      setEventStream((prev) => [
        {
          event: `${latest.type}: ${latest.title || latest.description}`,
          time: latest.time,
          type: latest.priority === 'CRITICAL' || latest.priority === 'HIGH' ? 'violation' : 'info',
          class: latest.type.toLowerCase().replace(/\s+/g, '_'),
        },
        ...prev.slice(0, 5),
      ]);
    }
  }, [alerts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Computer Vision AI Inference & Detection Canvas"
        subtitle="Real-time multi-class bounding box stream, PPE compliance tracking, and neural inference diagnostics."
      >
        <button
          onClick={() => triggerManualAlert()}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer border border-cyan-300/40"
        >
          <span>⚡</span>
          <span>EXECUTE INFERENCE SCAN</span>
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bounding Box Live Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="h-[480px] sm:h-[520px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 filter contrast-110"
              style={{
                backgroundImage: `url('/assets/demo/yolov8_inference.jpg')`,
              }}
            />

            {/* Cyber Grid & HUD Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Live Camera Tag */}
            <div className="absolute top-4 left-4 bg-slate-950/85 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-cyan-500/30 shadow-lg z-20 backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>STREAM: Warehouse - CAM-A01</span>
            </div>

            {/* Corner HUD Markers */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-white/10 z-20">
              FRAME #48,201 • 14ms
            </div>

            {/* Bounding Box 1 (Cyan - Helmet OK) */}
            <div className="absolute top-16 left-28 w-44 h-64 border-2 border-cyan-400 rounded-lg p-1 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10">
              <span className="bg-cyan-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                Worker - Helmet OK (96%)
              </span>
            </div>

            {/* Bounding Box 2 (Red - Missing Vest) */}
            <div className="absolute top-28 right-32 w-52 h-64 border-2 border-rose-500 rounded-lg p-1 bg-rose-500/15 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse z-10">
              <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow border border-rose-400/40">
                ⚠️ Violation: Missing Safety Vest (89%)
              </span>
            </div>

            {/* Bounding Box 3 (Amber - Forklift Active) */}
            <div className="absolute bottom-12 left-1/3 w-60 h-36 border-2 border-amber-400 rounded-lg p-1 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)] z-10">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                Forklift Machine (94%)
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">{aiEngineName} Active</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              30 FPS Optical Pipeline Healthy
            </span>
          </div>
        </div>

        {/* Right Analytics Side Panel */}
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Inference Metrics</span>
            </h3>

            {/* Stats list */}
            <div className="space-y-3 font-mono">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Active Detections
                </span>
                <p className="text-2xl font-black text-cyan-400 mt-1">
                  4 Tracked Objects
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  PPE Compliance Score
                </span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  94.2%
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Restricted Zone Intrusions
                </span>
                <p className="text-2xl font-black text-white mt-1">
                  0 Active Breaches
                </p>
              </div>
            </div>

            {/* Real-time Detection Event Stream */}
            <div>
              <h4 className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Real-Time Event Stream Terminal
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {eventStream.map((item, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-slate-950/60 rounded-xl border border-white/[0.05] flex justify-between items-center gap-2"
                  >
                    <span
                      className={`truncate ${
                        item.type === 'violation'
                          ? 'text-rose-400 font-bold'
                          : item.type === 'warning'
                          ? 'text-amber-400 font-semibold'
                          : 'text-slate-200'
                      }`}
                    >
                      {item.event}
                    </span>
                    <span className="text-slate-500 text-[10px] whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
            Pipeline: {aiEngineName} with sliced inference for high precision.
          </div>
        </div>
      </div>
    </div>
  );
}
