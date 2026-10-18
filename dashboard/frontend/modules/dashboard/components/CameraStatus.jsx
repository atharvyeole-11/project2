import Badge from "../../../shared/components/Badge";

export default function CameraStatus({ status }) {
  const type =
    status === "online"
      ? "success"
      : status === "warning"
      ? "warning"
      : "danger";

  return <Badge type={type}>{status}</Badge>;
}