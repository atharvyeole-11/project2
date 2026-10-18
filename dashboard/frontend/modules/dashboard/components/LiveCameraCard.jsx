import Badge from "../../../shared/components/Badge";
import { useEffect, useRef } from "react";

export default function LiveCameraCard({ camera, stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const statusColors = {
    online: "from-emerald-500 to-emerald-600",
    warning: "from-amber-500 to-amber-600",
    offline: "from-slate-500 to-slate-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all duration-300 group shadow-lg shadow-black/20">
      <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-white relative overflow-hidden">
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />
        )}

        <span className={`text-slate-500 text-xs font-mono tracking-widest relative z-10 ${stream ? 'bg-white px-2 rounded' : ''}`}>
          CCTV FEED — {camera.id}
        </span>

        {camera.status === "online" && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </span>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={`/cameras/${camera.id}`}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors block"
          >
            Expand Node →
          </a>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-slate-900 text-sm">{camera.name}</h3>
          <Badge type={camera.status === "online" ? "success" : camera.status === "warning" ? "warning" : "danger"}>
            {camera.status}
          </Badge>
        </div>

        <p className="text-xs text-slate-500 mt-1">{camera.location}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            AI Detections: <span className="font-bold text-blue-600 font-mono">{camera.detections}</span>
          </p>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusColors[camera.status]}`} />
        </div>
      </div>
    </div>
  );
}