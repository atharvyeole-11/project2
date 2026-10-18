import { useLocation } from "react-router-dom";

const routeNames = {
  "/": "Dashboard",
  "/cameras": "Cameras",
  "/detection": "AI Detection",
  "/alerts": "Alerts",
  "/incidents": "Incidents",
  "/site-map": "Site Map",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function Topbar() {
  const location = useLocation();

  const basePath = location.pathname.split("/").filter(Boolean)[0];
  const currentPage =
    routeNames[location.pathname] ||
    routeNames["/" + basePath] ||
    "SiteSentry";

  return (
    <header className="h-16 bg-white backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 font-medium">SiteSentry</span>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-blue-600">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Live System Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Safety Engine Active</span>
        </div>

        {/* Notification bell */}
        <a
          href="/alerts"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          id="notifications-btn"
          title="View Alerts"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </a>

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/20">
            S
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              Supervisor
            </p>
            <p className="text-[10px] text-slate-500">Control Room</p>
          </div>
        </div>
      </div>
    </header>
  );
}