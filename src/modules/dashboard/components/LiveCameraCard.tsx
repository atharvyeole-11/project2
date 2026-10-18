import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from '../../../types';
import Badge from '../../../shared/components/Badge';

interface LiveCameraCardProps {
  camera: Camera;
  stream?: MediaStream | null;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function LiveCameraCard({
  camera,
  stream,
  isSelected,
  onSelect,
}: LiveCameraCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const isLive = camera.status === 'online' || (camera.id === 'CAM-MOBILE-001' && stream !== null);

  return (
    <div
      onClick={onSelect}
      className={`relative overflow-hidden rounded-2xl bg-slate-900/70 backdrop-blur-xl border transition-all duration-300 group flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
          : 'border-white/[0.08] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]'
      }`}
    >
      {/* Top subtle glow edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* Video / Snapshot Surface */}
      <div className="h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : camera.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65 filter contrast-110 group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${camera.image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
            <span className="text-slate-600 font-mono text-xs">OFFLINE FEED</span>
          </div>
        )}

        {/* Cyber HUD Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md shadow-lg border border-rose-400/40 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </div>
        )}

        {/* Camera Node Identifier */}
        <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 z-10">
          {camera.id}
        </span>

        {/* Hover Action */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Link
            to={`/cameras/${camera.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-[10px] rounded shadow-md transition-colors"
          >
            EXPAND →
          </Link>
        </div>
      </div>

      {/* Camera Meta Card Footer */}
      <div className="p-3.5 bg-slate-950/40 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
              {camera.name}
            </h3>
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
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{camera.location}</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] font-mono">
          <span className="text-slate-400">
            Detections: <span className="font-bold text-cyan-400">{camera.detections}</span>
          </span>
          <span className="text-slate-500 uppercase">{camera.zone}</span>
        </div>
      </div>
    </div>
  );
}
