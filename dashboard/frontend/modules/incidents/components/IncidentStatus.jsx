import Badge from "../../../shared/components/Badge";

export default function IncidentStatus({ status }) {
  const type =
    status === "RESOLVED"
      ? "success"
      : status === "IN PROGRESS"
      ? "warning"
      : "danger";

  return <Badge type={type}>{status}</Badge>;
}