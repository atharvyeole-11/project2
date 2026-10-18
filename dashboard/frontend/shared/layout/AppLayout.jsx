import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <Sidebar />

      <div className="ml-64 min-h-screen flex flex-col">
        <Topbar />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}