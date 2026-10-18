import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSafety } from '../../context/SafetyContext';

export default function AppLayout() {
  const { alertPopup, dismissPopup } = useSafety();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex">
      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen flex flex-col">
        <Topbar />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Floating Alert Popup Notification */}
      {alertPopup && (
        <div className="fixed top-20 right-6 z-50 w-96 bg-white border-2 border-rose-500 rounded-2xl shadow-2xl p-4.5 animate-slide-up">
          <div className="flex justify-between items-start">
            <h4 className="text-rose-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              ⚠ Live Safety Alert
            </h4>
            <span className="text-[11px] font-mono text-slate-400">{alertPopup.time}</span>
          </div>

          <p className="text-slate-900 font-bold text-sm mt-2">{alertPopup.title}</p>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alertPopup.description}</p>

          <div className="text-[11px] text-slate-500 mt-2.5 space-y-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <p><span className="font-semibold text-slate-700">Camera:</span> {alertPopup.camera}</p>
            <p><span className="font-semibold text-slate-700">Location:</span> {alertPopup.location}</p>
            <p>
              <span className="font-semibold text-slate-700">Risk:</span>{' '}
              <span className="text-rose-600 font-bold">{alertPopup.priority}</span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              to="/alerts"
              onClick={dismissPopup}
              className="flex-1 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-500 text-center transition-colors shadow-md shadow-rose-600/20"
            >
              Open Alert Console
            </Link>
            <button
              onClick={dismissPopup}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
