import { useParams } from "react-router-dom";
import { alerts } from "../../../data/alerts";
import PageHeader from "../../../shared/components/PageHeader";
import AlertPriority from "../components/AlertPriority";
import Button from "../../../shared/components/Button";

export default function AlertDetails() {
  const { id } = useParams();

  const alert = alerts.find((item) => item.id === id);

  if (!alert) return <div>Alert not found.</div>;

  return (
    <div>
      <PageHeader
        title={`Alert ${alert.id}`}
        subtitle="Alert investigation and response"
      />

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {alert.type}
          </h2>

          <AlertPriority priority={alert.priority} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-gray-500 text-sm">Location</p>
            <p className="font-medium">{alert.location}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Camera</p>
            <p className="font-medium">{alert.camera}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-medium">{alert.status}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="font-medium">{alert.time}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <p className="text-gray-600">
            {alert.description}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="success">
            Acknowledge
          </Button>

          <Button>
            Assign
          </Button>

          <Button variant="danger">
            Escalate
          </Button>
        </div>
      </div>
    </div>
  );
}