export default function DetectionBox({
  label,
  confidence,
  top,
  left,
  width = 120,
  height = 100,
}) {
  return (
    <div
      className="absolute border-2 border-red-500"
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      <div className="absolute -top-7 left-0 bg-red-600 text-white text-xs px-2 py-1">
        {label} {confidence}%
      </div>
    </div>
  );
}