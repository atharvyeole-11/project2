import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSafety } from '../../context/SafetyContext';

export default function AppLayout() {
  const { alertPopup, dismissPopup } = useSafety();

  return (
    <div className="bg-[#060913] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex relative overflow-x-hidden">
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(rgba(56,189,248,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Command Workspace */}
      <div className="ml-64 flex-1 min-h-screen flex flex-col relative z-10">
        <Topbar />

        <main className="p-6 flex-1 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Futuristic Floating Glass Alert Notification */}
      {alertPopup && (
        <div className="fixed top-20 right-6 z-50 w-96 bg-slate-900/90 backdrop-blur-2xl border-2 border-rose-500 rounded-2xl shadow-[0_0_40px_rgba(244,63,94,0.35)] p-4.5 animate-slide-up overflow-hidden">
          {/* Top pulse line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />

          <div className="flex justify-between items-start">
            <h4 className="text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>⚠ CRITICAL HAZARD DETECTED</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">{alertPopup.time}</span>
          </div>

          <p className="text-white font-black text-sm mt-2 tracking-tight">
            {alertPopup.title || alertPopup.type}
          </p>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {alertPopup.description}
          </p>

          <div className="text-[11px] text-slate-300 mt-3 space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-white/[0.08] font-mono">
            <p className="flex justify-between">
              <span className="text-slate-500">Camera Node:</span>
              <span className="text-cyan-400 font-bold">{alertPopup.camera}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Sector:</span>
              <span className="text-slate-200">{alertPopup.location}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Hazard Index:</span>
              <span className="text-rose-400 font-black">{alertPopup.priority}</span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              to="/alerts"
              onClick={dismissPopup}
              className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs rounded-xl text-center transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
            >
              DISPATCH RESPONSE
            </Link>
            <button
              onClick={dismissPopup}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl transition-colors cursor-pointer border border-white/10"
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
