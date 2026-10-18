import { cameras } from "../../../data/cameras";
import PageHeader from "../../../shared/components/PageHeader";
import CameraGrid from "../components/CameraGrid";

export default function Cameras() {
  return (
    <div>
      <PageHeader
        title="Cameras"
        subtitle="Monitor connected CCTV/IP cameras"
      />

      <CameraGrid cameras={cameras} />
    </div>
  );
}