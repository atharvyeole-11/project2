import Badge from "../../../shared/components/Badge";

export default function AlertPriority({ priority }) {
  const type =
    priority === "CRITICAL" || priority === "HIGH"
      ? "danger"
      : priority === "MEDIUM"
      ? "warning"
      : "info";

  return <Badge type={type}>{priority}</Badge>;
}