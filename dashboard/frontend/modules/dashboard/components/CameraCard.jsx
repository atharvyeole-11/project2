import { useNavigate } from "react-router-dom";
import CameraStatus from "./CameraStatus";

export default function CameraCard({ camera }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="h-44 bg-white flex items-center justify-center text-gray-500">
        CCTV FEED
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-semibold">{camera.name}</h3>

          <CameraStatus status={camera.status} />
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {camera.location}
        </p>

        <button
          onClick={() => navigate(`/cameras/${camera.id}`)}
          className="mt-4 text-blue-600 text-sm font-medium hover:underline"
        >
          View Camera →
        </button>
      </div>
    </div>
  );
}