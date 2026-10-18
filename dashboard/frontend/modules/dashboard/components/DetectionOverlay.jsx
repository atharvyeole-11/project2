import DetectionBox from "./DetectionBox";

export default function DetectionOverlay() {
  return (
    <div className="relative bg-white h-[450px] rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
        CCTV VIDEO
      </div>

      <DetectionBox
        label="Person"
        confidence={96}
        top="30%"
        left="25%"
        width={130}
        height={180}
      />

      <DetectionBox
        label="No Helmet"
        confidence={91}
        top="35%"
        left="60%"
        width={110}
        height={150}
      />

      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm">
        AI DETECTION ACTIVE
      </div>
    </div>
  );
}