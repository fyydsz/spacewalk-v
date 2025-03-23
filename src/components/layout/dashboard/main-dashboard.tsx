import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const MainDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main>
          <Outlet /> {/* Halaman lain akan dirender di sini */}
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;