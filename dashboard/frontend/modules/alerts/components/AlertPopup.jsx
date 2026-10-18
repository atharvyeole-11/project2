import { useState } from "react";
import Modal from "../../../shared/components/Modal";
import Button from "../../../shared/components/Button";
import AlertPriority from "./AlertPriority";

export default function AlertPopup({ alert }) {
  const [open, setOpen] = useState(true);

  if (!alert) return null;

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="🚨 Safety Alert"
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="font-bold">{alert.type}</h3>

          <AlertPriority priority={alert.priority} />
        </div>

        <p className="text-gray-600">
          {alert.description}
        </p>

        <p className="text-sm">
          <strong>Location:</strong> {alert.location}
        </p>

        <Button
          className="w-full"
          onClick={() => setOpen(false)}
        >
          Acknowledge Alert
        </Button>
      </div>
    </Modal>
  );
}