import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-sm">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-xl">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</span>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
