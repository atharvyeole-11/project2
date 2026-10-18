import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/cameras': 'Cameras',
  '/detection': 'AI Detection',
  '/alerts': 'Alerts',
  '/alerts/table': 'Alert History Log',
  '/incidents': 'Incidents',
  '/site-map': 'Site Map',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/camera-source': 'Mobile CCTV Node',
};

export default function Topbar() {
  const location = useLocation();
  const { alerts, triggerManualAlert, isSimulating, setIsSimulating, user } = useSafety();

  const basePath = '/' + location.pathname.split('/').filter(Boolean)[0];
  const currentPage =
    routeNames[location.pathname] ||
    routeNames[basePath] ||
    (location.pathname.startsWith('/cameras/') ? 'Camera Stream Telemetry' : '') ||
    (location.pathname.startsWith('/incidents/') ? 'Incident Investigation File' : '') ||
    'SiteSentry';

  const criticalCount = alerts.filter(
    a => a.priority === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED'
  ).length;

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link to="/" className="text-slate-400 hover:text-slate-600 font-medium transition-colors">
          SiteSentry
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-blue-600 truncate">{currentPage}</span>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-3">
        {/* Real-time simulation switch */}
        <button
          onClick={() => setIsSimulating(prev => !prev)}
          className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isSimulating
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
          title="Toggle automatic AI safety hazard simulation"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span>{isSimulating ? 'Live AI Engine Active' : 'Simulation Paused'}</span>
        </button>

        {/* Trigger Demo Alert Button */}
        <button
          onClick={() => triggerManualAlert()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          title="Simulate immediate CCTV PPE or boundary violation"
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Simulate Hazard</span>
        </button>

        {/* Notification Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View Safety Alerts"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {criticalCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </>
          )}
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
