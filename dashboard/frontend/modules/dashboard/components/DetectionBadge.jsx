import Badge from "../../../shared/components/Badge";

export default function DetectionBadge({ status }) {
  return (
    <Badge type={status === "PASS" ? "success" : "danger"}>
      {status}
    </Badge>
  );
}