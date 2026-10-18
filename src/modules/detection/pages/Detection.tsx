import React, { useState, useEffect } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';

export default function Detection() {
  const { alerts, triggerManualAlert } = useSafety();
  const [eventStream, setEventStream] = useState([
    { event: 'Worker Detected (Helmet & Vest OK)', time: '14:42:10', type: 'ok' },
    { event: 'Violation: Missing Safety Vest', time: '14:38:05', type: 'violation' },
    { event: 'Forklift Zone Proximity Monitored', time: '14:31:18', type: 'info' },
    { event: 'Optical Node Synced — 30 FPS', time: '14:25:00', type: 'info' },
  ]);

  // When new alerts arrive, push to event stream
  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[0];
      setEventStream((prev) => [
        {
          event: `${latest.type}: ${latest.title || latest.description}`,
          time: latest.time,
          type: latest.priority === 'CRITICAL' || latest.priority === 'HIGH' ? 'violation' : 'info',
        },
        ...prev.slice(0, 5),
      ]);
    }
  }, [alerts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center — AI Detection Canvas"
        subtitle="Real-time Computer Vision bounding box stream & instant PPE hazard detection engine."
      >
        <button
          onClick={() => triggerManualAlert()}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡</span>
          <span>Run Inference Scan</span>
        </button>
      </PageHeader>

      {/* Screen 5 Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bounding Box Live Canvas */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="h-[480px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-65 filter contrast-110"
              style={{
                backgroundImage: `url('/assets/demo/yolov8_inference.jpg')`,
              }}
            />

            {/* Live Camera Tag */}
            <div className="absolute top-4 left-4 bg-slate-900/90 text-blue-400 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-slate-700 shadow-md z-20 backdrop-blur-sm">
              STREAM: Warehouse - CAM-A01
            </div>

            {/* Bounding Box 1 (Green - Helmet OK) */}
            <div className="absolute top-16 left-28 w-44 h-64 border-2 border-emerald-400 rounded-lg p-1 bg-emerald-500/10 animate-pulse z-10">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Worker - Helmet OK (96%)
              </span>
            </div>

            {/* Bounding Box 2 (Red - Missing Vest) */}
            <div className="absolute top-28 right-32 w-48 h-60 border-2 border-rose-500 rounded-lg p-1 bg-rose-500/15 z-10">
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                ⚠️ Violation: Missing Safety Vest (89%)
              </span>
            </div>

            {/* Bounding Box 3 (Yellow - Forklift Active) */}
            <div className="absolute bottom-12 left-1/3 w-60 h-36 border-2 border-amber-400 rounded-lg p-1 bg-amber-500/10 z-10">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Forklift Machine (94%)
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono">YOLOv8 CV Engine v2.4 Active</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              30 FPS Stream Healthy
            </span>
          </div>
        </div>

        {/* Right Analytics Side Panel */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
              AI Analytics Console
            </h3>

            {/* Stats list */}
            <div className="space-y-3.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Active Detections</span>
                <p className="text-2xl font-bold text-blue-600 font-mono mt-0.5">
                  4 Tracked Objects
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">PPE Compliance Score</span>
                <p className="text-2xl font-bold text-emerald-500 font-mono mt-0.5">
                  94.2%
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Restricted Zone Intrusions</span>
                <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                  0 Active Breaches
                </p>
              </div>
            </div>

            {/* Real-time Detection Event Stream */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Real-Time Event Stream
              </h4>
              <div className="space-y-2 text-xs">
                {eventStream.map((item, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex justify-between items-center gap-2"
                  >
                    <span
                      className={`truncate ${
                        item.type === 'violation'
                          ? 'text-rose-600 font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.event}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Model pipeline: YOLOv8 Ultralytics with SAHI inference slicing.
          </div>
        </div>
      </div>
    </div>
  );
}
