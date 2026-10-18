import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import ActiveAlertCard from '../components/ActiveAlertCard';
import RiskSummary from '../components/RiskSummary';

export default function Dashboard() {
  const {
    appTitle,
    aiEngineName,
    cameras,
    alerts,
    incidents,
    analytics,
    activeCameraId,
    setActiveCameraId,
    activeMobileStream,
    mobileFrameData,
    mobileSession,
    disconnectMobile,
    systemHealth,
    systemHealthState,
    triggerManualAlert,
    triggerJuryScenario,
    isCamera1Mobile,
    setIsCamera1Mobile,
    connectLaptopWebcamAsCamera1,
  } = useSafety();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const mainVideoContainerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const activeCamerasCount = cameras.filter((c) => c.status === 'online').length;
  const totalCamerasCount = cameras.length;
  const activeAlerts = alerts.filter(
    (a) => a.status !== 'DISMISSED' && a.status !== 'RESOLVED'
  );
  const criticalIncidentsCount = incidents.filter(
    (i) => i.severity === 'CRITICAL' || i.status === 'OPEN'
  ).length;

  // Selected primary camera
  const primaryCamera =
    cameras.find((c) => c.id === activeCameraId) || cameras[0];

  // Mobile camera active either directly on CAM-001 / CAM-MOBILE-001 or through stream/frame
  const isMobileFeedAvailable =
    mobileSession.isConnected && (activeMobileStream !== null || mobileFrameData !== null);

  const isPrimaryUsingMobile =
    (primaryCamera.id === 'CAM-001' && isCamera1Mobile && isMobileFeedAvailable) ||
    (primaryCamera.id === 'CAM-MOBILE-001' && isMobileFeedAvailable);

  const isPrimaryLive =
    isPrimaryUsingMobile ||
    primaryCamera.status === 'online' ||
    (primaryCamera.id === 'CAM-MOBILE-001' && activeMobileStream !== null);

  // Bind video element stream if available
  useEffect(() => {
    if (videoElementRef.current && activeMobileStream) {
      videoElementRef.current.srcObject = activeMobileStream;
    }
  }, [activeMobileStream, isPrimaryUsingMobile]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainVideoContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/mobile-cctv?session=${mobileSession.sessionId}`
      : '';

  const copyJoinLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Command Header */}
      <PageHeader
        title="Safety Operations Center"
        subtitle="Real-time optical telemetry, YOLO11 hazard inference, and command dispatcher."
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPairModal(true)}
            className="px-3.5 py-2 bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 font-mono font-bold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <span className="text-sm">📱</span>
            <span>CONNECT MOBILE CAMERA</span>
          </button>

          <Link
            to="/video-analysis"
            className="hidden sm:flex px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs rounded-xl border border-white/10 transition-all items-center gap-2"
          >
            <span className="text-sm">🎥</span>
            <span>VIDEO ANALYSIS</span>
          </Link>

          <button
            onClick={() => triggerManualAlert()}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2 cursor-pointer border border-rose-400/40"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="hidden md:inline">SIMULATE CRITICAL HAZARD</span>
            <span className="md:hidden">SIMULATE</span>
          </button>
        </div>
      </PageHeader>

      {/* Jury Presentation Quick-Fire Banner */}
      <div className="rounded-2xl p-3 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-cyan-500/25 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-[10px]">
            JURY DEMO DECK
          </span>
          <span className="text-slate-300 font-bold hidden sm:inline">
            Quick-fire hazard simulation scenarios:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => triggerJuryScenario('ppe')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-[11px] transition-colors cursor-pointer"
          >
            ⚡ Hardhat Breach
          </button>
          <button
            onClick={() => triggerJuryScenario('proximity')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition-colors cursor-pointer"
          >
            ⚠️ Forklift Proximity
          </button>
          <button
            onClick={() => triggerJuryScenario('zone')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-[11px] transition-colors cursor-pointer"
          >
            🚨 Pit Intrusion
          </button>
          <button
            onClick={() => triggerJuryScenario('reset')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-[11px] transition-colors cursor-pointer"
          >
            ↺ Reset
          </button>
          <Link
            to="/jury-demo"
            className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-[11px] hover:bg-cyan-400 transition-colors shadow-sm"
          >
            Defense Console →
          </Link>
        </div>
      </div>

      {/* 6 Compact Futuristic Glass Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Cameras"
          value={totalCamerasCount}
          subtitle="Fleet nodes"
          accentColor="blue"
          icon={<span className="text-sm">📹</span>}
        />
        <StatCard
          title="Cameras Online"
          value={activeCamerasCount}
          subtitle={`${Math.round((activeCamerasCount / Math.max(1, totalCamerasCount)) * 100)}% uptime`}
          accentColor="emerald"
          change="ACTIVE"
          isPositive={true}
          icon={<span className="text-sm">●</span>}
        />
        <StatCard
          title="Active Alerts"
          value={String(activeAlerts.length).padStart(2, '0')}
          subtitle="Unresolved"
          accentColor={activeAlerts.length > 0 ? 'rose' : 'cyan'}
          change={activeAlerts.length > 0 ? 'ATTENTION' : 'NOMINAL'}
          isPositive={activeAlerts.length === 0}
          icon={<span className="text-sm">🚨</span>}
        />
        <StatCard
          title="Critical Incidents"
          value={String(criticalIncidentsCount).padStart(2, '0')}
          subtitle="Open dockets"
          accentColor="amber"
          icon={<span className="text-sm">⚠️</span>}
        />
        <StatCard
          title="AI Detections"
          value={analytics.totalDetections}
          subtitle="Processed today"
          accentColor="cyan"
          change="+14.2%"
          isPositive={true}
          icon={<span className="text-sm">🧠</span>}
        />
        <StatCard
          title="System Health"
          value={systemHealthState === 'nominal' ? 'NOMINAL' : 'ALERT'}
          subtitle={systemHealth}
          accentColor={systemHealthState === 'nominal' ? 'emerald' : 'rose'}
          change="99.8%"
          isPositive={systemHealthState === 'nominal'}
          icon={<span className="text-sm">🛡️</span>}
        />
      </div>

      {/* Main Surveillance Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Primary Large CCTV Video Monitor + Mobile CCTV Integration */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                {isPrimaryUsingMobile ? (
                  <span className="text-cyan-300">
                    Camera 1 — Mobile Optical Feed ({mobileSession.sessionId})
                  </span>
                ) : (
                  <span>Primary Surveillance Feed — {primaryCamera.name}</span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {isPrimaryUsingMobile && (
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  UPLINK: {mobileSession.elapsedFormatted}
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Resolution:{' '}
                {isPrimaryUsingMobile
                  ? `${mobileSession.resolution.width}x${mobileSession.resolution.height}`
                  : primaryCamera.resolution || '1080p'}{' '}
                @ {primaryCamera.fps || 30} FPS
              </span>
              <Link
                to="/cameras"
                className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Fleet Grid →
              </Link>
            </div>
          </div>

          {/* Large Primary Video Feed with HUD & YOLO Bounding Boxes */}
          <div
            ref={mainVideoContainerRef}
            className="relative rounded-2xl bg-slate-950 overflow-hidden border border-cyan-500/25 shadow-[0_0_35px_rgba(0,0,0,0.8)] h-[460px] sm:h-[500px] flex items-center justify-center group"
          >
            {/* Live Stream Rendering: Direct WebRTC MediaStream OR Broadcast Frame OR Static Demo Feed */}
            {isPrimaryUsingMobile ? (
              activeMobileStream ? (
                <video
                  ref={videoElementRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : mobileFrameData ? (
                <img
                  src={mobileFrameData}
                  alt="Mobile CCTV Frame"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url(${primaryCamera.image})` }}
                />
              )
            ) : primaryCamera.id === 'CAM-MOBILE-001' && activeMobileStream ? (
              <video
                ref={videoElementRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : primaryCamera.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-75 filter contrast-115"
                style={{ backgroundImage: `url(${primaryCamera.image})` }}
              />
            ) : (
              <div className="text-slate-600 font-mono text-sm">
                OFFLINE OPTICAL FEED
              </div>
            )}

            {/* Cyber Grid & Reticle Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Scanline Sweep Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-24 animate-scanline pointer-events-none" />

            {/* HUD Corner Reticles */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

            {/* Top HUD Status Bar */}
            <div className="absolute top-4 inset-x-6 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                {isPrimaryLive && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-600/90 text-white font-mono font-bold text-xs rounded-lg shadow-lg border border-rose-400/40 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{isPrimaryUsingMobile ? 'PHONE CAMERA 1 LIVE' : 'LIVE STREAM'}</span>
                  </div>
                )}
                <div className="px-3 py-1 bg-slate-950/80 text-cyan-300 font-mono text-xs rounded-lg border border-white/10 backdrop-blur-md">
                  {primaryCamera.id} • {isPrimaryUsingMobile ? 'Mobile CCTV Node' : primaryCamera.zone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPrimaryUsingMobile && (
                  <button
                    onClick={() => disconnectMobile()}
                    className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 font-mono text-xs rounded-lg border border-rose-500/40 backdrop-blur-md transition-colors cursor-pointer"
                    title="Disconnect phone node gracefully"
                  >
                    Disconnect Node
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs rounded-lg border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? '⤢ EXIT' : '⤢ FULLSCREEN'}
                </button>
              </div>
            </div>

            {/* YOLO Detections Bounding Boxes directly over video */}
            {(isPrimaryUsingMobile
              ? [
                  {
                    id: 'live-det-1',
                    label: 'Worker - Optical Node Active',
                    confidence: 96,
                    severity: 'normal' as const,
                    timestamp: 'Just now',
                    box: { top: 22, left: 28, width: 44, height: 55 },
                  },
                ]
              : primaryCamera.detectionsList
            )?.map((det) => (
              <div
                key={det.id}
                className={`absolute border-2 rounded-lg transition-all duration-300 z-10 ${
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
                <div
                  className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md ${
                    det.severity === 'critical'
                      ? 'bg-rose-600 text-white border border-rose-400/40'
                      : det.severity === 'warning'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-cyan-500 text-slate-950 font-black'
                  }`}
                >
                  {det.label} ({det.confidence}%)
                </div>
              </div>
            ))}

            {/* Bottom HUD Metadata Banner */}
            <div className="absolute bottom-4 inset-x-6 flex justify-between items-center text-[11px] font-mono text-slate-300 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 z-20">
              <span className="flex items-center gap-1.5 truncate max-w-[220px]">
                <span className="text-slate-500">SECTOR:</span>
                <span className="text-white font-bold">
                  {isPrimaryUsingMobile ? 'Construction Site — Mobile Node' : primaryCamera.location}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-cyan-400 hidden sm:inline">ENGINE: {aiEngineName}</span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-emerald-400 font-bold">
                  {isPrimaryUsingMobile
                    ? `FPS: ${mobileSession.resolution.fps} (WEBRTC)`
                    : `FPS: ${primaryCamera.fps || 30}`}
                </span>
              </span>
            </div>
          </div>

          {/* Secondary Camera Switcher Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-widest">
                Optical Channels ({cameras.length} Feeds Available):
              </span>
              <button
                onClick={() => setShowPairModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>📱 Pair Mobile as Camera 1</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cameras.slice(0, 4).map((cam) => {
                const isCam1WithMobile = cam.id === 'CAM-001' && isPrimaryUsingMobile;
                return (
                  <button
                    key={cam.id}
                    onClick={() => {
                      setActiveCameraId(cam.id);
                      if (cam.id === 'CAM-001') {
                        setIsCamera1Mobile(true);
                      }
                    }}
                    className={`p-3 rounded-xl bg-slate-900/60 backdrop-blur-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      activeCameraId === cam.id
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-white/[0.08] hover:border-cyan-500/30'
                    }`}
                  >
                    {activeCameraId === cam.id && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-bl" />
                    )}
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-cyan-300 font-bold">
                        {cam.id} {isCam1WithMobile && '📱'}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCam1WithMobile || cam.status === 'online'
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">
                      {isCam1WithMobile ? 'Mobile Phone Stream' : cam.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {isCam1WithMobile ? `${mobileSession.elapsedFormatted} Live` : `${cam.detections} Detections`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Risk Summary + Tactical Diagnostics */}
        <div className="space-y-6">
          <RiskSummary />

          {/* Tactical Diagnostics Panel */}
          <div className="relative overflow-hidden rounded-2xl p-5 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] shadow-xl">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/[0.06]">
              <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span>
                <span>Inference Telemetry</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                NORMAL LATENCY
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Core Engine:</span>
                <span className="text-cyan-400 font-bold">{aiEngineName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inference Latency:</span>
                <span className="text-emerald-400 font-bold">14.2 ms / frame</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mobile Node Uplink:</span>
                <span
                  className={
                    mobileSession.isConnected
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-400'
                  }
                >
                  {mobileSession.isConnected
                    ? `ONLINE (${mobileSession.elapsedFormatted})`
                    : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Model Batch Pipeline:</span>
                <span className="text-slate-200">FP16 TensorRT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Detection Confidence:</span>
                <span className="text-cyan-300 font-bold">85% Minimum</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Mobile CCTV Gateway:</span>
              <button
                onClick={() => setShowPairModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
              >
                PAIR DEVICE →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Active Safety Alerts Queue */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Live Alert Ticker & Incident Queue
            </h2>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Open Alert Console →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.slice(0, 3).map((alert) => (
            <ActiveAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Connect Mobile Camera Modal with SVG QR Code */}
      {showPairModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 max-w-sm w-full border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-scale-in">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>📱</span>
                <span>Connect Phone as Camera 1</span>
              </span>
              <button
                onClick={() => setShowPairModal(false)}
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

              <div className="space-y-1">
                <p className="text-xs text-slate-200 font-mono font-bold">
                  Session Token: {mobileSession.sessionId}
                </p>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  1. Open Android Chrome and scan QR code or copy URL below.
                  <br />
                  2. Allow camera access.
                  <br />
                  3. Stream appears live in Operations Deck as Camera 1!
                </p>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/[0.08] text-[11px] font-mono flex items-center justify-between">
                <span className="text-cyan-400 truncate max-w-[200px]">{joinUrl}</span>
                <button
                  onClick={copyJoinLink}
                  className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer hover:bg-cyan-400 transition-colors"
                >
                  {copiedLink ? 'COPIED!' : 'COPY'}
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowPairModal(false);
                    connectLaptopWebcamAsCamera1();
                  }}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  📹 Or use Host Laptop Webcam
                </button>
                <Link
                  to="/mobile-cctv"
                  onClick={() => setShowPairModal(false)}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                >
                  Open Node View →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
