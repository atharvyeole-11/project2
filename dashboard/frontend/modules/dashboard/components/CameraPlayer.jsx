export default function CameraPlayer({ camera }) {
  return (
    <div className="bg-black rounded-xl h-[450px] flex items-center justify-center relative overflow-hidden">
      <div className="text-gray-500 text-xl">
        CCTV STREAM
      </div>

      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm">
        ● LIVE
      </div>

      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/60 px-3 py-2 rounded">
        {camera.name} — {camera.location}
      </div>
    </div>
  );
}