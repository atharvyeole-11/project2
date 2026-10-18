import { useParams, useNavigate } from "react";
import { useEffect, useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";
import { cameras as mockCameras } from "../../../data/cameras";
import Badge from "../../../shared/components/Badge";

export default function CameraDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.getCamera(id);
      setCamera(res || mockCameras.find(c => c.id === id) || mockCameras[0]);
    }
    load();
  }, [id]);

  if (!camera) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title={`Safety Operations Center — ${camera.name}`}
          subtitle={`Node Telemetry ID: ${camera.id} | Location: ${camera.location}`}
        />
        <button
          onClick={() => navigate("/cameras")}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
        >
          ← Back to Cameras
        </button>
      </div>

      {/* Screen 4 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Stream Video Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="h-[420px] bg-slate-50 relative flex items-center justify-center">
            {/* Live Bounding Boxes Overlay */}
            <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80')` }} />

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE RTSP STREAM
            </div>

            {/* Bounding Box 1 */}
            <div className="absolute top-20 left-28 w-44 h-56 border-2 border-emerald-400 rounded p-1 bg-emerald-500/10">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Worker - Helmet OK (98%)
              </span>
            </div>

            {/* Bounding Box 2 */}
            <div className="absolute bottom-16 right-36 w-52 h-40 border-2 border-amber-400 rounded p-1 bg-amber-500/10">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Forklift Active (94%)
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
            <span>Resolution: 1080p @ 30 FPS</span>
            <span>Codec: H.264 / AI YOLO-v8</span>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Detection Telemetry
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Node Status:</span>
                <Badge type={camera.status === "online" ? "success" : "warning"}>{camera.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Zone:</span>
                <span className="text-slate-800 font-bold">{camera.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Objects:</span>
                <span className="text-blue-600 font-mono font-bold">{camera.detections} Detected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PPE Score:</span>
                <span className="text-emerald-400 font-mono font-bold">96.4%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</h4>
              <button
                onClick={() => navigate("/alerts")}
                className="w-full py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-lg transition-colors"
              >
                🚨 Trigger Manual Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
