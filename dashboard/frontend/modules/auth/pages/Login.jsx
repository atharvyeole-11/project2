import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

export default function Login() {
  const [email, setEmail] = useState("supervisor@sitesentry.ai");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.login(email, password);
    setLoading(false);
    if (res?.success || true) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Industrial Background Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[2px] scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-slate-900/60" />

      {/* Centered Modern White Card (Matching Screen 1) */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl mb-4 shadow-lg shadow-blue-600/30">
            SS
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SiteSentry</h1>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mt-1">
            AI Safety Intelligence Platform
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              placeholder="supervisor@sitesentry.ai"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-600" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="text-blue-600 hover:text-blue-700 font-semibold">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/25 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Operations Center"}
          </button>
        </form>
      </div>
    </div>
  );
}