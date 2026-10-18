import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';

const routeNames: Record<string, string> = {
  '/': 'Tactical Operations Deck',
  '/cameras': 'Optical Sensor Fleet',
  '/detection': 'Computer Vision Inference',
  '/alerts': 'Real-Time Alert Dispatch',
  '/alerts/table': 'Audit Log & Detection Records',
  '/incidents': 'Incident Investigation Desk',
  '/site-map': '3D Isometric Facility Grid',
  '/analytics': 'Predictive Safety Intelligence',
  '/settings': 'Detection Thresholds & Neural Rules',
  '/camera-source': 'Mobile Optical Node Gateway',
};

export default function Topbar() {
  const location = useLocation();
  const {
    appTitle,
    aiEngineName,
    socketStatus,
    searchQuery,
    setSearchQuery,
    cameras,
    alerts,
    systemHealth,
    systemHealthState,
    currentTime,
    user,
    triggerManualAlert,
    isSimulating,
    setIsSimulating,
  } = useSafety();

  const [showNotifications, setShowNotifications] = useState(false);

  const basePath = '/' + location.pathname.split('/').filter(Boolean)[0];
  const currentPage =
    routeNames[location.pathname] ||
    routeNames[basePath] ||
    (location.pathname.startsWith('/cameras/') ? 'Camera Stream Telemetry' : '') ||
    (location.pathname.startsWith('/incidents/') ? 'Investigation File' : '') ||
    'SiteSentry';

  const onlineCamerasCount = cameras.filter((c) => c.status === 'online').length;
  const totalCamerasCount = cameras.length;

  const criticalAlerts = alerts.filter(
    (a) => a.priority === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED'
  );

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30 flex items-center justify-between px-6 shadow-xl">
      {/* Breadcrumb & Section Name */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider"
        >
          {appTitle}
        </Link>
        <span className="text-slate-600 font-mono">/</span>
        <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          {currentPage}
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden xl:flex items-center relative w-72">
        <span className="absolute left-3 text-slate-500 text-xs font-mono">🔍</span>
        <input
          type="text"
          placeholder="Global telemetry search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Live System Indicators */}
      <div className="flex items-center gap-3">
        {/* Optical Sensor Status */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-[11px] font-mono text-slate-300"
          title="Active optical camera sensors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              onlineCamerasCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>
            {onlineCamerasCount}/{totalCamerasCount} CAMS
          </span>
        </div>

        {/* AI Engine Status Indicator */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          title="YOLO Computer Vision inference state"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="truncate max-w-[130px]">{aiEngineName}</span>
        </div>

        {/* Socket.IO Connection */}
        <div
          className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-[10px] font-mono text-slate-400"
          title="Signaling WebSocket bus"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>SOCKET.IO</span>
        </div>

        {/* Live Digital Clock */}
        <div className="hidden sm:block px-3 py-1 bg-slate-900/80 border border-white/[0.08] rounded-xl text-[11px] font-mono text-slate-300 tracking-wider">
          {currentTime || 'SYNCHRONIZING...'}
        </div>

        {/* Test Hazard Simulation Action */}
        <button
          onClick={() => triggerManualAlert()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:border-rose-400/50 rounded-xl text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)] cursor-pointer"
          title="Simulate immediate CV hazard detection"
        >
          <span className="animate-pulse">⚡</span>
          <span className="hidden sm:inline">TRIGGER HAZARD</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] hover:border-cyan-500/30 transition-all cursor-pointer"
            title="View Safety Alerts"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {criticalAlerts.length > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </>
            )}
          </button>

          {/* Quick Notification Glass Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-scale-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.08] mb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Tactical Notifications
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                  {alerts.length} ALERTS
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/[0.05] transition-colors"
                  >
                    <div className="flex justify-between items-start text-[11px]">
                      <span className="font-mono text-rose-400 font-bold">{a.id}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{a.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold truncate mt-0.5">
                      {a.title || a.type}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{a.location}</p>
                  </Link>
                ))}
              </div>

              <Link
                to="/alerts"
                onClick={() => setShowNotifications(false)}
                className="block text-center mt-3 pt-2 border-t border-white/[0.08] text-xs font-mono text-cyan-400 hover:text-cyan-300"
              >
                Open Full Alert Console →
              </Link>
            </div>
          )}
        </div>

        {/* Supervisor Officer Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)] border border-cyan-200/40">
            {user.callsign.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
            <p className="text-[10px] text-cyan-400 font-mono">{user.callsign}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
