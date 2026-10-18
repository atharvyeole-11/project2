import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-scale-in overflow-hidden">
        {/* Top edge glow */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex justify-between items-center p-5 border-b border-white/[0.08] bg-slate-950/40">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 text-slate-200">{children}</div>
      </div>
    </div>
  );
}
