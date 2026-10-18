import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({ children, type = 'default', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
        styles[type] || styles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
