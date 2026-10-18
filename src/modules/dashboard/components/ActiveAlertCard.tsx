import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../../types';
import Badge from '../../../shared/components/Badge';

interface ActiveAlertCardProps {
  alert: Alert;
}

export default function ActiveAlertCard({ alert }: ActiveAlertCardProps) {
  const isCritical = alert.priority === 'CRITICAL';
  const isHigh = alert.priority === 'HIGH';

  const borderColor = isCritical
    ? 'border-l-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
    : isHigh
    ? 'border-l-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
    : 'border-l-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.12)]';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] border-l-4 ${borderColor} hover:border-slate-500/40 transition-all duration-300 flex flex-col justify-between group`}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-0.5">
              {alert.id} • {alert.camera}
            </span>
            <h3 className="font-bold text-white text-xs sm:text-sm tracking-tight group-hover:text-cyan-200 transition-colors">
              {alert.title || alert.type}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{alert.location}</p>
          </div>
          <Badge
            type={
              isCritical
                ? 'danger'
                : isHigh
                ? 'warning'
                : 'info'
            }
          >
            {alert.priority}
          </Badge>
        </div>

        <p className="text-xs mt-2.5 text-slate-300 line-clamp-2 leading-relaxed">
          {alert.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] font-mono">
        <span className="text-slate-400">
          {alert.time} • <span className="text-cyan-400 font-bold">{alert.status}</span>
        </span>
        <Link
          to={`/alerts`}
          className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wider transition-colors flex items-center gap-1 group-hover:translate-x-0.5"
        >
          <span>INSPECT</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
