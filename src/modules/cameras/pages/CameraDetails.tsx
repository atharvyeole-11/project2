import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import Badge from '../../../shared/components/Badge';

export default function CameraDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cameras, activeMobileStream, aiEngineName, triggerManualAlert } = useSafety();

  const camera = cameras.find((c) => c.id === id) || cameras[0];
  const isLive = camera.status === 'online' || (camera.id === 'CAM-MOBILE-001' && activeMobileStream !== null);

  const handleTriggerAlert = () => {
    triggerManualAlert({
      camera: camera.id,
      location: camera.location,
      type: 'PPE Violation',
      title: `PPE Violation — Detected on ${camera.name}`,
      priority: 'HIGH',
      description: `Manual supervisor trigger: AI model flagged hazard condition on ${camera.id} (${camera.location}).`,
    });
    navigate('/alerts');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={`Optical Stream Telemetry — ${camera.name}`}
          subtitle={`Node Telemetry ID: ${camera.id} | Location: ${camera.location}`}
        />
        <button
          onClick={() => navigate('/cameras')}
          className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
        >
          ← Back to Fleet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Stream Video Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="h-[460px] sm:h-[500px] bg-slate-950 relative flex items-center justify-center overflow-hidden">
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
                className="absolute inset-0 bg-cover bg-center opacity-70 filter contrast-110"
                style={{ backgroundImage: `url(${camera.image})` }}
              />
            ) : (
              <div className="text-slate-600 font-mono text-sm">OFFLINE STREAM</div>
            )}

            {/* Cyber Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Corner reticles */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Live Indicator */}
            {isLive && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-600/90 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg shadow-lg border border-rose-400/40 z-20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                LIVE RTSP STREAM
              </div>
            )}

            {/* Bounding boxes */}
            {camera.detectionsList?.map((det) => (
              <div
                key={det.id}
                className={`absolute border-2 rounded-lg z-10 ${
                  det.severity === 'critical'
                    ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                    : det.severity === 'warning'
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
                style={{
                  top: `${det.box.top}%`,
                  left: `${det.box.left}%`,
                  width: `${det.box.width}%`,
                  height: `${det.box.height}%`,
                }}
              >
                <span
                  className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md ${
                    det.severity === 'critical'
                      ? 'bg-rose-600 text-white'
                      : det.severity === 'warning'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-cyan-500 text-slate-950 font-black'
                  }`}
                >
                  {det.label} ({det.confidence}%)
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Resolution: {camera.resolution || '1080p'} @ {camera.fps || 30} FPS</span>
            <span>Codec: H.264 / AI {aiEngineName}</span>
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-5">
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Node Telemetry</span>
            </h3>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Node Status:</span>
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
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Assigned Zone:</span>
                <span className="text-white font-bold">{camera.zone}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Active Objects:</span>
                <span className="text-cyan-400 font-bold">{camera.detections} Tracked</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">PPE Safety Score:</span>
                <span className="text-emerald-400 font-bold">96.4%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Protocol:</span>
                <span className="text-slate-300">{camera.source || 'IP_CCTV_RTSP'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Supervisor Override
              </span>
              <button
                onClick={handleTriggerAlert}
                className="w-full py-2.5 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:border-rose-400 font-mono font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚨</span>
                <span>TRIGGER MANUAL ALARM</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
            Node synchronized with SiteSentry Edge Inference Gateway.
          </div>
        </div>
      </div>
    </div>
  );
}
