import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from '../../../types';
import Badge from '../../../shared/components/Badge';

interface LiveCameraCardProps {
  camera: Camera;
  stream?: MediaStream | null;
}

export default function LiveCameraCard({ camera, stream }: LiveCameraCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const statusColors: Record<string, string> = {
    online: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
    offline: 'from-slate-400 to-slate-500',
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 transition-all duration-300 group shadow-sm flex flex-col justify-between">
      <div className="h-44 bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            {/* Grid mesh effect */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Bounding box simulation for online cameras */}
            {camera.status === 'online' && (
              <div className="absolute inset-6 border border-emerald-500/30 rounded flex items-start p-1 text-[9px] font-mono text-emerald-400 pointer-events-none">
                <span className="bg-emerald-500/20 px-1 rounded border border-emerald-500/30">
                  Worker - Helmet OK (97%)
                </span>
              </div>
            )}
            {camera.status === 'warning' && (
              <div className="absolute inset-8 border border-amber-500/50 rounded flex items-start p-1 text-[9px] font-mono text-amber-400 pointer-events-none animate-pulse">
                <span className="bg-amber-500/20 px-1 rounded border border-amber-500/30">
                  ⚠️ Restricted Area Proximity
                </span>
              </div>
            )}
          </div>
        )}

        <span
          className={`text-slate-400 text-xs font-mono tracking-wider relative z-10 ${
            stream ? 'bg-slate-950/80 px-2 py-0.5 rounded' : ''
          }`}
        >
          {camera.id}
        </span>

        {camera.status === 'online' && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </span>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/cameras/${camera.id}`}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors block shadow-md"
          >
            Expand Node →
          </Link>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-slate-900 text-sm truncate">{camera.name}</h3>
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

          <p className="text-xs text-slate-500 mt-1">{camera.location}</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            AI Detections:{' '}
            <span className="font-bold text-blue-600 font-mono">{camera.detections}</span>
          </p>
          <div
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusColors[camera.status]}`}
          />
        </div>
      </div>
    </div>
  );
}
