import { useParams } from "react-router-dom";
import { cameras } from "../../../data/cameras";
import PageHeader from "../../../shared/components/PageHeader";
import CameraPlayer from "../components/CameraPlayer";
import Button from "../../../shared/components/Button";

export default function CameraDetails() {
  const { id } = useParams();

  const camera = cameras.find((item) => item.id === id);

  if (!camera) {
    return <div>Camera not found.</div>;
  }

  return (
    <div>
      <PageHeader
        title={camera.name}
        subtitle={`${camera.id} • ${camera.location}`}
      />

      <CameraPlayer camera={camera} />

      <div className="bg-white border rounded-xl p-5 mt-5">
        <h2 className="font-bold mb-4">
          Camera Controls
        </h2>

        <div className="flex gap-3">
          <Button>Start Stream</Button>
          <Button variant="secondary">Capture</Button>
          <Button variant="danger">Disable Camera</Button>
        </div>
      </div>
    </div>
  );
}