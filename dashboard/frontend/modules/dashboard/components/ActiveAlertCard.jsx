import Badge from "../../../shared/components/Badge";

export default function ActiveAlertCard({ alert }) {
  const type =
    alert.priority === "CRITICAL" || alert.priority === "HIGH"
      ? "danger"
      : "warning";

  const borderColor =
    alert.priority === "CRITICAL"
      ? "border-l-rose-500"
      : alert.priority === "HIGH"
      ? "border-l-amber-500"
      : "border-l-cyan-500";

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 border-l-4 ${borderColor} hover:border-slate-300 transition-all duration-300 shadow-lg shadow-black/20`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">{alert.title || alert.type}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{alert.location}</p>
        </div>
        <Badge type={type}>{alert.priority}</Badge>
      </div>

      <p className="text-xs mt-3 text-slate-700 line-clamp-2">
        {alert.description}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
        <p className="text-[11px] text-slate-500 font-mono">
          {alert.time} • {alert.status}
        </p>
        <a
          href={`/alerts/${alert.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
        >
          Inspect →
        </a>
      </div>
    </div>
  );
}