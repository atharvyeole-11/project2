import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';

export default function PhoneCamera() {
  const { updateCameraStatus, setActiveMobileStream, appTitle } = useSafety();
  const [status, setStatus] = useState<'OFFLINE' | 'CONNECTING' | 'LIVE' | 'ERROR'>('OFFLINE');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoResolution, setVideoResolution] = useState<{ width: number; height: number; fps: number }>({
    width: 1920,
    height: 1080,
    fps: 30,
  });
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/camera-source` : '';

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus('CONNECTING');
      setErrorMessage('');

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check track settings & torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings?.();
        if (settings) {
          setVideoResolution({
            width: settings.width || 1280,
            height: settings.height || 720,
            fps: Math.round(settings.frameRate || 30),
          });
        }
        const capabilities: any = track.getCapabilities?.();
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        }
      }

      setActiveMobileStream(stream);
      updateCameraStatus('CAM-MOBILE-001', 'online');
      setStatus('LIVE');
    } catch (err: any) {
      console.warn('Error accessing camera with ideal constraints:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        const track = fallbackStream.getVideoTracks()[0];
        if (track) {
          const settings = track.getSettings?.();
          if (settings) {
            setVideoResolution({
              width: settings.width || 1280,
              height: settings.height || 720,
              fps: Math.round(settings.frameRate || 30),
            });
          }
        }
        setActiveMobileStream(fallbackStream);
        updateCameraStatus('CAM-MOBILE-001', 'online');
        setStatus('LIVE');
      } catch (fallbackErr: any) {
        setStatus('ERROR');
        setErrorMessage(
          'Optical device permissions denied or hardware unavailable. Please allow camera permissions in your browser.'
        );
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActiveMobileStream(null);
    updateCameraStatus('CAM-MOBILE-001', 'offline');
    setTorchOn(false);
    setStatus('OFFLINE');
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (status === 'LIVE') {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  };

  const toggleTorch = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const nextState = !torchOn;
          await (track as any).applyConstraints({
            advanced: [{ torch: nextState }],
          });
          setTorchOn(nextState);
        } catch (e) {
          console.warn('Torch constraint not supported on this device/browser:', e);
        }
      }
    }
  };

  const copyJoinLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between z-10">
        <Link
          to="/"
          className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span>OPERATIONS DECK</span>
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold text-white tracking-wide">{appTitle}</h1>
          <p className="text-[10px] text-cyan-400 font-mono">Mobile Optical Node Gateway</p>
        </div>
        <button
          onClick={() => setShowQRModal(true)}
          className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono font-bold rounded-lg border border-cyan-500/30 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>📱</span>
          <span>PAIR CODE</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-xl mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* Status specs */}
        <div className="space-y-2 mb-4 text-xs font-mono rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-4 shadow-xl">
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-slate-400">Node Identifier:</span>
            <span className="text-cyan-400 font-bold">CAM-MOBILE-001</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-slate-400">Facility Sector:</span>
            <span className="text-slate-200">Construction Site — Demo Area</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.04] pb-2">
            <span className="text-slate-400">Stream Spec:</span>
            <span className="text-emerald-400 font-bold">
              {videoResolution.width}x{videoResolution.height} @ {videoResolution.fps} FPS
            </span>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-400">Uplink Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                status === 'LIVE'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : status === 'CONNECTING'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : status === 'ERROR'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border border-white/10'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Video Canvas Box with HUD Reticles */}
        <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden relative border border-cyan-500/30 flex items-center justify-center min-h-[380px] shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              display: status === 'LIVE' || status === 'CONNECTING' ? 'block' : 'none',
            }}
          />

          {/* Cyber Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-20 animate-scanline pointer-events-none" />

          {/* HUD Reticles */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

          {/* Center Crosshair */}
          <div className="absolute w-12 h-12 pointer-events-none opacity-40">
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-400" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-400" />
            <div className="absolute inset-2 border border-cyan-400/40 rounded-full" />
          </div>

          {status === 'OFFLINE' && (
            <div className="text-slate-400 text-center p-6 space-y-3">
              <span className="text-4xl block animate-bounce">📱</span>
              <p className="text-sm font-bold text-white font-mono">Mobile CCTV Node Offline</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Use your device camera as a live optical feed into SiteSentry. Click "Start Broadcast" below.
              </p>
            </div>
          )}

          {status === 'CONNECTING' && (
            <div className="text-amber-400 text-center p-6 space-y-2">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono font-semibold">Negotiating optical pipeline...</p>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="text-rose-400 text-center p-6 space-y-2 max-w-sm">
              <span className="text-3xl block">⚠️</span>
              <p className="text-xs font-mono">{errorMessage}</p>
            </div>
          )}

          {status === 'LIVE' && (
            <>
              <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-lg border border-rose-400/40 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                BROADCASTING TO COMMAND CENTER
              </div>

              <div className="absolute top-4 right-4 bg-slate-950/80 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 backdrop-blur-md">
                YOLO STREAM SYNCED
              </div>
            </>
          )}
        </div>

        {status === 'LIVE' && (
          <div className="mt-4 text-center text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 py-2.5 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            ✓ Optical stream active — Video feed bound to CAM-MOBILE-001 in Operations Deck
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 space-y-3">
          {status === 'OFFLINE' || status === 'ERROR' ? (
            <button
              onClick={startCamera}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer border border-cyan-300/40 uppercase tracking-wider"
            >
              Start Broadcast Stream
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-black text-xs rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer border border-rose-400/40 uppercase tracking-wider"
            >
              Stop Broadcast Stream
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={switchCamera}
              className="py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Switch Lens ({facingMode === 'environment' ? 'Rear' : 'Front'})
            </button>

            <button
              onClick={toggleTorch}
              className={`py-2.5 font-mono text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                torchOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10'
              }`}
            >
              🔦 {torchOn ? 'Flashlight ON' : 'Flashlight OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code / Quick Join Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 max-w-sm w-full border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-scale-in">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Pair Smartphone Node
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-4">
              {/* High-tech SVG Matrix Pattern QR Code */}
              <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-xl">
                <svg className="w-44 h-44" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="25" height="25" fill="#060913" />
                  <rect x="9" y="9" width="17" height="17" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="#060913" />

                  <rect x="70" y="5" width="25" height="25" fill="#060913" />
                  <rect x="74" y="9" width="17" height="17" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="#060913" />

                  <rect x="5" y="70" width="25" height="25" fill="#060913" />
                  <rect x="9" y="74" width="17" height="17" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="#060913" />

                  {/* Pseudo-data cells */}
                  <rect x="35" y="10" width="5" height="5" fill="#060913" />
                  <rect x="45" y="10" width="5" height="5" fill="#060913" />
                  <rect x="55" y="10" width="5" height="5" fill="#060913" />
                  <rect x="35" y="20" width="5" height="5" fill="#060913" />
                  <rect x="45" y="20" width="10" height="5" fill="#060913" />
                  <rect x="10" y="35" width="5" height="5" fill="#060913" />
                  <rect x="20" y="35" width="10" height="5" fill="#060913" />
                  <rect x="35" y="35" width="15" height="15" fill="#06b6d4" />
                  <rect x="55" y="35" width="10" height="5" fill="#060913" />
                  <rect x="70" y="35" width="5" height="10" fill="#060913" />
                  <rect x="80" y="35" width="10" height="5" fill="#060913" />

                  <rect x="10" y="45" width="10" height="5" fill="#060913" />
                  <rect x="25" y="45" width="5" height="10" fill="#060913" />
                  <rect x="55" y="45" width="5" height="10" fill="#060913" />
                  <rect x="65" y="45" width="15" height="5" fill="#060913" />

                  <rect x="10" y="55" width="5" height="10" fill="#060913" />
                  <rect x="20" y="55" width="10" height="5" fill="#060913" />
                  <rect x="35" y="55" width="5" height="5" fill="#060913" />
                  <rect x="45" y="55" width="10" height="10" fill="#060913" />
                  <rect x="70" y="55" width="10" height="5" fill="#060913" />
                  <rect x="85" y="55" width="5" height="10" fill="#060913" />

                  <rect x="35" y="70" width="10" height="5" fill="#060913" />
                  <rect x="50" y="70" width="5" height="10" fill="#060913" />
                  <rect x="60" y="70" width="10" height="5" fill="#060913" />
                  <rect x="75" y="70" width="15" height="5" fill="#060913" />

                  <rect x="35" y="80" width="5" height="10" fill="#060913" />
                  <rect x="45" y="85" width="15" height="5" fill="#060913" />
                  <rect x="65" y="80" width="10" height="10" fill="#060913" />
                  <rect x="80" y="85" width="10" height="5" fill="#060913" />
                </svg>
              </div>

              <p className="text-xs text-slate-300 font-mono">
                Scan with your smartphone camera to connect device as an optical node.
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/[0.08] text-[11px] font-mono flex items-center justify-between">
                <span className="text-cyan-400 truncate max-w-[200px]">{joinUrl}</span>
                <button
                  onClick={copyJoinLink}
                  className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                >
                  {copiedLink ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
