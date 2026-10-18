import { alerts } from "../../../data/alerts";
import PageHeader from "../../../shared/components/PageHeader";
import AlertList from "../components/AlertList";

export default function Alerts() {
  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Monitor and manage safety alerts"
      />

      <div className="flex gap-3 mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          All
        </button>

        <button className="bg-white border px-4 py-2 rounded-lg">
          Critical
        </button>

        <button className="bg-white border px-4 py-2 rounded-lg">
          New
        </button>

        <button className="bg-white border px-4 py-2 rounded-lg">
          Resolved
        </button>
      </div>

      <AlertList alerts={alerts} />
    </div>
  );
}