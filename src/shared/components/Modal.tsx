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
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200/80 animate-scale-in overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
