import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function CameraDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cameras, activeMobileStream, triggerManualAlert } = useSafety();

  const camera = cameras.find((c) => c.id === id) || cameras[0];

  const handleTriggerAlert = () => {
    triggerManualAlert({
      camera: camera.id,
      location: camera.location,
      type: 'PPE Violation',
      title: `PPE Violation — Detected on ${camera.name}`,
      priority: 'HIGH',
      description: `Manual supervisor trigger: AI model flagged hazard condition on ${camera.id} (${camera.location}).`
    });
    navigate('/alerts');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={`Safety Operations Center — ${camera.name}`}
          subtitle={`Node Telemetry ID: ${camera.id} | Location: ${camera.location}`}
        />
        <button
          onClick={() => navigate('/cameras')}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Back to Cameras
        </button>
      </div>

      {/* Screen 4 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Stream Video Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="h-[440px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
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
              <div
                className="absolute inset-0 bg-cover bg-center opacity-65 filter contrast-110"
                style={{
                  backgroundImage: `url(${
                    camera.id === 'CAM-003'
                      ? '/assets/demo/persons_in_restricted_zones.jpg'
                      : '/assets/demo/yolov8_inference.jpg'
                  })`,
                }}
              />
            )}

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md z-10">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE RTSP STREAM
            </div>

            {/* Bounding Box 1 */}
            <div className="absolute top-20 left-28 w-44 h-56 border-2 border-emerald-400 rounded-lg p-1.5 bg-emerald-500/10 z-10 animate-pulse">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                Worker - Helmet OK (98%)
              </span>
            </div>

            {/* Bounding Box 2 */}
            <div className="absolute bottom-16 right-36 w-52 h-40 border-2 border-amber-400 rounded-lg p-1.5 bg-amber-500/10 z-10">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                Forklift Active (94%)
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>Resolution: {camera.resolution || '1080p'} @ {camera.fps || 30} FPS</span>
            <span>Codec: H.264 / AI YOLO-v8 Enhanced</span>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Detection Telemetry
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Node Status:</span>
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
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Zone:</span>
                <span className="text-slate-900 font-bold">{camera.zone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Active Objects:</span>
                <span className="text-blue-600 font-mono font-bold">
                  {camera.detections} Detected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">PPE Safety Score:</span>
                <span className="text-emerald-500 font-mono font-bold">96.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Node Source:</span>
                <span className="text-slate-700 font-mono font-semibold">
                  {camera.source || 'IP_CCTV_RTSP'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Supervisor Actions
              </h4>
              <button
                onClick={handleTriggerAlert}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🚨</span>
                <span>Trigger Manual Safety Alert</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Node connected to SiteSentry Edge Gateway cluster.
          </div>
        </div>
      </div>
    </div>
  );
}
