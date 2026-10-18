import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./shared/layout/AppLayout";
import Login from "./modules/auth/pages/Login";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Cameras from "./modules/cameras/pages/Cameras";
import CameraDetails from "./modules/cameras/pages/CameraDetails";
import PhoneCamera from "./modules/cameras/pages/PhoneCamera";
import Detection from "./modules/detection/pages/Detection";
import Alerts from "./modules/alerts/pages/Alerts";
import AlertDetails from "./modules/alerts/pages/AlertDetails";
import Incidents from "./modules/incidents/pages/Incidents";
import IncidentDetails from "./modules/incidents/pages/IncidentDetails";
import SiteMap from "./modules/site/pages/SiteMap";
import Analytics from "./modules/analytics/pages/Analytics";
import Settings from "./modules/settings/pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/camera-source" element={<PhoneCamera />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/cameras/:id" element={<CameraDetails />} />
        <Route path="/detection" element={<Detection />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts/table" element={<AlertDetails />} />
        <Route path="/alerts/:id" element={<AlertDetails />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
