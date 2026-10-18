import AlertCard from "./AlertCard";

export default function AlertList({ alerts }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
