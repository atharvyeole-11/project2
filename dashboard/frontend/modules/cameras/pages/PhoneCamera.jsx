import { useState, useRef, useEffect } from "react";
import { socket } from "../../../services/socket";

export default function PhoneCamera() {
  const [status, setStatus] = useState("OFFLINE");
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus("CONNECTING");
      
      // 1. Get Camera Media Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 2. Setup WebRTC Peer Connection
      const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      // 3. Create Offer and send to Signaling Server (Backend)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", offer);

      socket.on("answer", async (answer) => {
        if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "stable") {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("request-offer", async () => {
         if (peerConnectionRef.current) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit("offer", offer);
         }
      });

      socket.on("ice-candidate", async (candidate) => {
         if (peerConnectionRef.current && candidate) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.error("Error adding ice candidate", e);
            }
         }
      });

      socket.emit("mobile-camera-status", "online");
      setStatus("LIVE");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setStatus("ERROR");
      alert("Camera permission denied or not available. Please allow access and ensure you are on HTTPS or localhost.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    socket.emit("mobile-camera-status", "offline");
    socket.off("answer");
    socket.off("ice-candidate");
    setStatus("OFFLINE");
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
    if (status === "LIVE") {
      stopCamera();
      setTimeout(startCamera, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-white flex flex-col font-sans">
      <div className="p-4 bg-white border-b border-slate-200 text-center">
        <h1 className="text-xl font-bold text-slate-900">SiteSentry</h1>
        <p className="text-sm text-slate-500">Mobile CCTV Camera</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Camera ID:</span>
            <span className="font-mono text-blue-600 font-bold">CAM-MOBILE-001</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Location:</span>
            <span className="text-slate-800">Construction Site — Demo Area</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2 items-center">
            <span className="text-slate-500">Connection Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              status === "LIVE" ? "bg-emerald-500/20 text-emerald-400" :
              status === "CONNECTING" ? "bg-amber-500/20 text-amber-400" :
              status === "ERROR" ? "bg-rose-500/20 text-rose-400" :
              "bg-slate-100 text-slate-500"
            }`}>
              {status}
            </span>
          </div>
        </div>

        <div className="flex-1 bg-black rounded-xl overflow-hidden relative border-2 border-slate-200 flex items-center justify-center min-h-[300px]">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
            style={{ display: status === "LIVE" || status === "CONNECTING" ? "block" : "none" }}
          />
          {status === "OFFLINE" && (
            <div className="text-slate-500 text-center p-4">
              <span className="text-4xl block mb-2">📷</span>
              Press Start Camera to broadcast
            </div>
          )}
          {status === "LIVE" && (
            <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE RECORDING
            </div>
          )}
        </div>

        {status === "LIVE" && (
          <div className="mt-4 text-center text-xs text-emerald-400 font-bold bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
            Connected to Safety Operations Center
          </div>
        )}

        <div className="mt-6 space-y-3">
          {status === "OFFLINE" || status === "ERROR" ? (
            <button
              onClick={startCamera}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-rose-500/20"
            >
              Stop Camera
            </button>
          )}

          <button
            onClick={switchCamera}
            className="w-full py-3 bg-slate-100 hover:bg-slate-700 text-slate-800 font-bold text-sm rounded-xl transition-colors"
          >
            Switch Camera (Front/Rear)
          </button>
        </div>
      </div>
    </div>
  );
}
