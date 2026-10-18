import { useNavigate } from "react-router-dom";
import AlertPriority from "./AlertPriority";

export default function AlertCard({ alert }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">{alert.type}</h3>

          <p className="text-sm text-gray-500 mt-1">
            {alert.location}
          </p>
        </div>

        <AlertPriority priority={alert.priority} />
      </div>

      <p className="text-sm text-gray-600 mt-4">
        {alert.description}
      </p>

      <div className="flex justify-between items-center mt-5">
        <span className="text-xs text-gray-400">
          {alert.time} • {alert.status}
        </span>

        <button
          onClick={() => navigate(`/alerts/${alert.id}`)}
          className="text-blue-600 text-sm font-medium"
        >
          View →
        </button>
      </div>
    </div>
  );
}