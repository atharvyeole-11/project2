export default function DetectionStats() {
  const stats = [
    ["Persons", "18"],
    ["PPE Violations", "03"],
    ["Restricted Entry", "01"],
    ["Crowd Density", "72%"],
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(([name, value]) => (
        <div
          key={name}
          className="bg-white border rounded-xl p-4"
        >
          <p className="text-sm text-gray-500">{name}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
      ))}
    </div>
  );
}