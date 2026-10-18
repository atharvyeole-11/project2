import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'blue';
}

export default function StatCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon,
  accentColor = 'cyan',
}: StatCardProps) {
  const accentBorders: Record<string, string> = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    rose: 'hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    blue: 'hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4.5 bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 group ${
        accentBorders[accentColor] || accentBorders.cyan
      }`}
    >
      {/* Subtle top edge glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="flex justify-between items-start gap-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-800/80 border border-white/[0.06] text-cyan-400 group-hover:text-cyan-300 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight group-hover:text-cyan-100 transition-colors">
            {value}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{subtitle}</p>
          )}
        </div>

        {change && (
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border tracking-wider ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
