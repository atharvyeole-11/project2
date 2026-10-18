import { useNavigate } from "react-router-dom";
import IncidentStatus from "./IncidentStatus";

export default function IncidentTable({ incidents }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Assigned</th>
            <th className="text-left p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="border-t">
              <td className="p-4 font-medium">{incident.id}</td>

              <td className="p-4">{incident.type}</td>

              <td className="p-4">{incident.location}</td>

              <td className="p-4">
                <IncidentStatus status={incident.status} />
              </td>

              <td className="p-4">{incident.assignedTo}</td>

              <td className="p-4">
                <button
                  onClick={() =>
                    navigate(`/incidents/${incident.id}`)
                  }
                  className="text-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}