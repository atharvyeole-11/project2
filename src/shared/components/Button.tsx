import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  title
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/25 active:scale-95',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 ring-1 ring-slate-200 active:scale-95',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 active:scale-95',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 active:scale-95',
    warning:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 active:scale-95',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
