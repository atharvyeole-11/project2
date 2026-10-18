export default function ActionLog() {
  const logs = [
    "10:43 — Alert acknowledged",
    "10:44 — Supervisor assigned",
    "10:46 — Security team notified",
    "10:49 — Incident inspected",
  ];

  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-bold mb-4">Action Log</h2>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log}
            className="border-l-2 border-blue-500 pl-3 text-sm text-gray-600"
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}