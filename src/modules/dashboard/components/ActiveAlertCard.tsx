import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../../types';
import Badge from '../../../shared/components/Badge';

interface ActiveAlertCardProps {
  alert: Alert;
}

export default function ActiveAlertCard({ alert }: ActiveAlertCardProps) {
  const type =
    alert.priority === 'CRITICAL' || alert.priority === 'HIGH'
      ? 'danger'
      : alert.priority === 'MEDIUM'
      ? 'warning'
      : 'info';

  const borderColor =
    alert.priority === 'CRITICAL'
      ? 'border-l-rose-500'
      : alert.priority === 'HIGH'
      ? 'border-l-amber-500'
      : 'border-l-blue-500';

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-4 border-l-4 ${borderColor} hover:border-slate-300 transition-all duration-300 shadow-sm flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-600 block mb-0.5">
              {alert.id}
            </span>
            <h3 className="font-bold text-slate-900 text-sm">{alert.title || alert.type}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{alert.location}</p>
          </div>
          <Badge type={type}>{alert.priority}</Badge>
        </div>

        <p className="text-xs mt-2.5 text-slate-600 line-clamp-2">
          {alert.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 font-mono">
          {alert.time} • <span className="font-semibold text-slate-700">{alert.status}</span>
        </p>
        <Link
          to={`/alerts`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Inspect →
        </Link>
      </div>
    </div>
  );
}
