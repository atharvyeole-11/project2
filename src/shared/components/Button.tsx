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
  title,
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-300/40 active:scale-95',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 hover:border-slate-500/50 backdrop-blur-md shadow-sm active:scale-95',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold border border-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95',
    warning:
      'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold border border-amber-300/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-cyan-400 hover:text-cyan-300 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
