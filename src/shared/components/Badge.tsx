import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({ children, type = 'default', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    default:
      'bg-slate-800/70 text-slate-300 border border-slate-700/70 shadow-sm',
    success:
      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    warning:
      'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    danger:
      'bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    info:
      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase backdrop-blur-md transition-all ${
        styles[type] || styles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
