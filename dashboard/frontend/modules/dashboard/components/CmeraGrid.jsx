import CameraCard from "./CameraCard";

export default function CameraGrid({ cameras }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {cameras.map((camera) => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
}