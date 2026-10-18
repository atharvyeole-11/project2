import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';

export default function MobileCCTV() {
  const [searchParams] = useSearchParams();
  const sessionFromUrl = searchParams.get('session');

  const {
    appTitle,
    aiEngineName,
    mobileSession,
    setMobileConnected,
    disconnectMobile,
    broadcastMobileFrame,
    setActiveMobileStream,
    generateMobileSession,
  } = useSafety();

  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'LIVE' | 'ERROR'>('IDLE');
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
  const [framesBroadcastCount, setFramesBroadcastCount] = useState<number>(0);
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<any>(null);

  const activeSessionId = sessionFromUrl || mobileSession.sessionId;
  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/mobile-cctv?session=${activeSessionId}`
      : '';

  const stopCamera = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActiveMobileStream(null);
    disconnectMobile();
    setTorchOn(false);
    setStatus('IDLE');
  }, [disconnectMobile, setActiveMobileStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus('CONNECTING');
      setErrorMessage('');

      // Browser Secure Context / mediaDevices support check
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'MediaDevices API is not accessible in this context. Ensure you are accessing over HTTPS or localhost on Android Chrome.'
        );
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (idealErr) {
        console.warn('Ideal constraints failed, attempting fallback camera constraints:', idealErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Auto-play caught:', playErr);
        }
      }

      // Read capabilities & settings
      const track = stream.getVideoTracks()[0];
      let resolvedWidth = 1280;
      let resolvedHeight = 720;
      let resolvedFps = 30;

      if (track) {
        const settings = track.getSettings?.();
        if (settings) {
          resolvedWidth = settings.width || 1280;
          resolvedHeight = settings.height || 720;
          resolvedFps = Math.round(settings.frameRate || 30);
          setVideoResolution({
            width: resolvedWidth,
            height: resolvedHeight,
            fps: resolvedFps,
          });
        }

        const capabilities: any = track.getCapabilities?.();
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true);
        }
      }

      // Register live stream with context
      setActiveMobileStream(stream);
      setMobileConnected(true, {
        sessionId: activeSessionId,
        facingMode,
        resolution: { width: resolvedWidth, height: resolvedHeight, fps: resolvedFps },
        deviceLabel: `Mobile Optical Sensor (${facingMode === 'environment' ? 'Rear' : 'Front'})`,
      });

      setStatus('LIVE');

      // Start frame broadcaster for cross-tab & dashboard live sync
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 640;
      offscreenCanvas.height = 360;
      const ctx = offscreenCanvas.getContext('2d');

      let frameCounter = 0;
      frameIntervalRef.current = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 2 && ctx) {
          try {
            ctx.drawImage(videoRef.current, 0, 0, 640, 360);
            const dataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.65);
            broadcastMobileFrame(dataUrl);
            frameCounter++;
            setFramesBroadcastCount(frameCounter);
          } catch (e) {
            // ignore canvas frame drops
          }
        }
      }, 70); // ~14 FPS cross-tab broadcast
    } catch (err: any) {
      console.error('Camera startup error:', err);
      setStatus('ERROR');
      setErrorMessage(
        err.message ||
          'Failed to access device camera. Please grant camera permissions in Android Chrome settings.'
      );
    }
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (status === 'LIVE') {
      stopCamera();
      setTimeout(() => {
        setFacingMode(nextMode);
        startCamera();
      }, 350);
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
          console.warn('Torch constraint error:', e);
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
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-4 bg-slate-950/85 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between z-10 sticky top-0">
        <Link
          to="/"
          className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <span>←</span>
          <span>DASHBOARD</span>
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-white tracking-wide">SiteSentry Mobile CCTV</h1>
          <p className="text-[10px] text-cyan-400 font-mono tracking-wider">
            OPTICAL NODE • CAMERA 1 UPLINK
          </p>
        </div>
        <button
          onClick={() => setShowQRModal(true)}
          className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 text-xs font-mono font-bold rounded-lg border border-cyan-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        >
          <span>📱</span>
          <span>PAIR CODE</span>
        </button>
      </header>

      <main className="p-4 sm:p-6 max-w-xl mx-auto w-full flex-1 flex flex-col relative z-10 space-y-4">
        {/* Session & Telemetry Status Card */}
        <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-white/[0.08] p-4 shadow-xl space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
            <span className="text-slate-400">Camera Session:</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold tracking-wider">{activeSessionId}</span>
              <button
                onClick={generateMobileSession}
                className="text-[10px] text-slate-500 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Generate fresh session"
              >
                ↻ New
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
            <span className="text-slate-400">Dashboard Link:</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Bound to Camera 1
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2">
            <span className="text-slate-400">Lens / Stream Spec:</span>
            <span className="text-emerald-400 font-bold">
              {facingMode === 'environment' ? 'Rear (Wide)' : 'Front (Selfie)'} •{' '}
              {videoResolution.width}x{videoResolution.height} @ {videoResolution.fps} FPS
            </span>
          </div>

          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-400">Uplink Status:</span>
            <div className="flex items-center gap-2">
              {status === 'LIVE' && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {mobileSession.elapsedFormatted}
                </span>
              )}
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                  status === 'LIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : status === 'CONNECTING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                    : status === 'ERROR'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}
              >
                {status === 'LIVE' ? 'LIVE STREAMING' : status}
              </span>
            </div>
          </div>
        </div>

        {/* Video Canvas Box with HUD Reticles & YOLO overlay */}
        <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden relative border border-cyan-500/30 flex items-center justify-center min-h-[380px] sm:min-h-[440px] shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              display: status === 'LIVE' || status === 'CONNECTING' ? 'block' : 'none',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
          />

          {/* Cyber Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-20 animate-scanline pointer-events-none" />

          {/* HUD Reticles */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

          {/* Center Tactical Crosshair */}
          <div className="absolute w-14 h-14 pointer-events-none opacity-40">
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-400" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-400" />
            <div className="absolute inset-2 border border-cyan-400/40 rounded-full" />
          </div>

          {status === 'IDLE' && (
            <div className="text-slate-400 text-center p-6 space-y-4 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                📱
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">Mobile CCTV Node Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Turn this smartphone into a live wireless CCTV camera streaming directly to Camera 1
                  on your laptop Operations Deck.
                </p>
              </div>
              <button
                onClick={startCamera}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer border border-cyan-200/50 uppercase tracking-wider"
              >
                Grant Permission & Start Camera
              </button>
            </div>
          )}

          {status === 'CONNECTING' && (
            <div className="text-amber-400 text-center p-6 space-y-3">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono font-bold">Requesting camera permissions...</p>
              <p className="text-[11px] text-slate-400 font-mono">
                Please tap "Allow" when Chrome prompts for camera access.
              </p>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="text-rose-400 text-center p-6 space-y-3 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl mx-auto">
                ⚠️
              </div>
              <p className="text-xs font-mono font-bold leading-relaxed">{errorMessage}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Retry Camera Connection
              </button>
            </div>
          )}

          {status === 'LIVE' && (
            <>
              {/* Top HUD Badges */}
              <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-lg border border-rose-400/40 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE STREAMING TO CAMERA 1
              </div>

              <div className="absolute top-4 right-4 bg-slate-950/80 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>SYNC: {framesBroadcastCount} FRAMES</span>
              </div>

              {/* Simulated YOLO Live Bounding Box over Mobile Preview */}
              {aiOverlayEnabled && (
                <div
                  className="absolute border-2 border-cyan-400 rounded-lg bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none transition-all duration-300"
                  style={{ top: '22%', left: '26%', width: '48%', height: '56%' }}
                >
                  <div className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-black bg-cyan-500 text-slate-950 shadow-md">
                    Worker - PPE Compliant (96%)
                  </div>
                </div>
              )}

              {/* Bottom HUD Bar */}
              <div className="absolute bottom-4 inset-x-4 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-white/10 text-[10px] font-mono flex justify-between items-center text-slate-300">
                <span className="text-cyan-400 font-bold truncate">ENGINE: {aiEngineName}</span>
                <span className="text-emerald-400 font-bold">{mobileSession.elapsedFormatted}</span>
              </div>
            </>
          )}
        </div>

        {/* Live Confirmation Banner */}
        {status === 'LIVE' && (
          <div className="text-center text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 py-2.5 px-3 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Camera 1 active on laptop dashboard</span>
            </span>
            <span className="text-slate-400 text-[10px]">{mobileSession.elapsedFormatted}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-3">
          {status === 'LIVE' ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={stopCamera}
                className="py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer border border-rose-400/40 uppercase tracking-wider"
              >
                Stop Camera
              </button>
              <button
                onClick={switchCamera}
                className="py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔄</span>
                <span>Switch Lens ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
              </button>
            </div>
          ) : (
            <button
              onClick={startCamera}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer border border-cyan-300/40 uppercase tracking-wider"
            >
              Start Camera Stream
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={toggleTorch}
              className={`py-2.5 font-mono text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                torchOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10'
              }`}
            >
              <span>🔦</span>
              <span>{torchOn ? 'Torch ON' : 'Torch OFF'}</span>
            </button>

            <button
              onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              className={`py-2.5 font-mono text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                aiOverlayEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-white/10'
              }`}
            >
              <span>🎯</span>
              <span>YOLO Reticle: {aiOverlayEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* QR Code / Quick Pairing Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 max-w-sm w-full border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-scale-in">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Pair Mobile Camera Node
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-4">
              {/* High-tech SVG Matrix QR Code */}
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
                Open Android Chrome and scan this QR code or use the shareable link below:
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/[0.08] text-[11px] font-mono flex items-center justify-between">
                <span className="text-cyan-400 truncate max-w-[200px]">{joinUrl}</span>
                <button
                  onClick={copyJoinLink}
                  className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer hover:bg-cyan-400 transition-colors"
                >
                  {copiedLink ? 'COPIED!' : 'COPY'}
                </button>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                Session Token: <span className="text-white font-bold">{activeSessionId}</span> • Valid for presentation session
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
