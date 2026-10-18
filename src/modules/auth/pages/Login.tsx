import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('supervisor@sitesentry.ai');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('supervisor@sitesentry.ai');
    setPassword('TacticalSecurity2026!');
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#060913] overflow-hidden font-sans p-4">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.07)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Futuristic Glassmorphism Clearance Terminal Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-cyan-500/30 animate-fade-in overflow-hidden">
        {/* Top Edge Glow */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* HUD Corner Reticles */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-xl mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-200/50">
            SS
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">SiteSentry</h1>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <p className="text-[10px] font-mono font-bold text-cyan-400/90 tracking-widest uppercase mt-1">
            AI Safety Intelligence Security Deck
          </p>
        </div>

        {demoNotice && (
          <div className="mb-4 p-2.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-xl animate-fade-in flex items-center gap-2">
            <span>✓</span>
            <span>Supervisor officer credentials loaded into terminal.</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Officer Identity / Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.08] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono transition-all"
              placeholder="supervisor@sitesentry.ai"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Security Clearance Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.08] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-white/20"
              />
              <span>Remember clearance token</span>
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              Demo Auto-Fill
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] mt-3 cursor-pointer border border-cyan-300/40 uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Authenticating Security Hash...' : 'Access Safety Command Deck'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.08] text-center">
          <p className="text-[10px] font-mono text-slate-500">
            Authorization Level: Level 4 Superintendent • Node: SOC-01
          </p>
        </div>
      </div>
    </div>
  );
}
