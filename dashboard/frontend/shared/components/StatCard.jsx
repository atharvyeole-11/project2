export default function StatCard({ title, value, change, isPositive = true, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-lg shadow-black/20">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</span>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
