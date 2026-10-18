import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';

export default function Sidebar() {
  const { alerts, incidents, user, cameras } = useSafety();

  const activeAlertsCount = alerts.filter(
    a => a.status !== 'DISMISSED' && a.status !== 'RESOLVED'
  ).length;

  const openIncidentsCount = incidents.filter(
    i => i.status === 'OPEN' || i.status === 'IN_PROGRESS'
  ).length;

  const mobileCamOnline = cameras.find(c => c.id === 'CAM-MOBILE-001')?.status === 'online';

  const menu = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Cameras',
      path: '/cameras',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'AI Detection',
      path: '/detection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.002M9 17v1a3 3 0 006 0v-1M9 17H4l1.405-1.405A2.032 2.032 0 016 14.158V11a6 6 0 01.458-2.298" />
        </svg>
      ),
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
    },
    {
      name: 'Incidents',
      path: '/incidents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.001c-.77-1.333-2.694-1.333-3.464 0L3.34 16.001C2.57 17.334 3.532 19.001 5.072 19.001z" />
        </svg>
      ),
      badge: openIncidentsCount > 0 ? openIncidentsCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    {
      name: 'Site Map',
      path: '/site-map',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Mobile CCTV Node',
      path: '/camera-source',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      badge: mobileCamOnline ? 'LIVE' : undefined,
      badgeColor: 'bg-emerald-500',
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-slate-800/80">
      {/* Brand Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/30">
            SS
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">SiteSentry</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              AI Safety Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`
            }
          >
            <span className="group-hover:scale-105 transition-transform duration-200">
              {item.icon}
            </span>
            <span>{item.name}</span>

            {item.badge !== undefined && (
              <span
                className={`ml-auto text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                  item.badgeColor || 'bg-rose-500'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Supervisor Account Profile */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-emerald-500/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{user.location}</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" title="Online" />
        </div>
      </div>
    </aside>
  );
}
