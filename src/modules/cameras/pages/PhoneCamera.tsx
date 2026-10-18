import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';

export default function PhoneCamera() {
  const { updateCameraStatus, setActiveMobileStream } = useSafety();
  const [status, setStatus] = useState<'OFFLINE' | 'CONNECTING' | 'LIVE' | 'ERROR'>('OFFLINE');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        video: { facingMode },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setActiveMobileStream(stream);
      updateCameraStatus('CAM-MOBILE-001', 'online');
      setStatus('LIVE');
    } catch (err: any) {
      console.warn('Error accessing user camera:', err);
      // Try fallback without facingMode constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setActiveMobileStream(fallbackStream);
        updateCameraStatus('CAM-MOBILE-001', 'online');
        setStatus('LIVE');
      } catch (fallbackErr: any) {
        setStatus('ERROR');
        setErrorMessage(
          'Camera permission denied or camera device is not available. Please allow camera permissions in your browser.'
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
    setStatus('OFFLINE');
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (status === 'LIVE') {
      stopCamera();
      setTimeout(startCamera, 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <Link
          to="/"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
        <div className="text-center">
          <h1 className="text-base font-bold text-slate-900">SiteSentry</h1>
          <p className="text-[11px] text-slate-500">Mobile Optical Node Gateway</p>
        </div>
        <div className="w-16" />
      </div>

      <div className="p-6 max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Status specs */}
        <div className="space-y-2 mb-4 text-xs bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Node Identifier:</span>
            <span className="font-mono text-blue-600 font-bold">CAM-MOBILE-001</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Facility Location:</span>
            <span className="text-slate-800 font-medium">Construction Site — Demo Area</span>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-500">Uplink Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                status === 'LIVE'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : status === 'CONNECTING'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : status === 'ERROR'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Video Canvas Box */}
        <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center min-h-[340px] shadow-inner">
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

          {status === 'OFFLINE' && (
            <div className="text-slate-400 text-center p-6 space-y-2">
              <span className="text-4xl block">📹</span>
              <p className="text-sm font-semibold text-slate-300">Mobile Stream Ready</p>
              <p className="text-xs text-slate-500">
                Tap "Start Broadcast" to stream device camera video to the Safety Dashboard
              </p>
            </div>
          )}

          {status === 'CONNECTING' && (
            <div className="text-amber-400 text-center p-6 space-y-2">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">Initializing optical stream...</p>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="text-rose-400 text-center p-6 space-y-2 max-w-sm">
              <span className="text-3xl block">⚠️</span>
              <p className="text-xs font-medium">{errorMessage}</p>
            </div>
          )}

          {status === 'LIVE' && (
            <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE TO OPERATIONS CENTER
            </div>
          )}
        </div>

        {status === 'LIVE' && (
          <div className="mt-4 text-center text-xs text-emerald-700 font-bold bg-emerald-50 py-2.5 rounded-xl border border-emerald-200">
            ✓ Connected to Operations Center — Telemetry Active
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 space-y-3">
          {status === 'OFFLINE' || status === 'ERROR' ? (
            <button
              onClick={startCamera}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Start Broadcast Stream
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
            >
              Stop Broadcast Stream
            </button>
          )}

          <button
            onClick={switchCamera}
            className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Switch Lens ({facingMode === 'environment' ? 'Rear → Front' : 'Front → Rear'})
          </button>
        </div>
      </div>
    </div>
  );
}
