import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Settings, Menu, X, LogOut } from "lucide-react";
import axios from "axios";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path?: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);


  useEffect(() => {
    axios
      .get("https://api.spacewalk.my.id/auth/me", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUser({
            username: response.data.user.username,
            avatar: `https://cdn.discordapp.com/avatars/${response.data.user.id}/${response.data.user.avatar}.png`,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error.response?.data || error.message);

      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`${isSidebarOpen ? 'w-80' : 'w-20'} 
      backdrop-filter backdrop-blur-lg bg-white/10 border-r border-white/40
      shadow-lg transition-all duration-300 ease-in-out h-screen overflow-hidden
      fixed top-0 left-0 z-40`}
    >
      <div className={`flex ${isSidebarOpen ? 'justify-between' : 'justify-center'} border-b border-white/40 p-4`}>
        {isSidebarOpen ? (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full border border-white" />
                <h1 className="font-bold text-2xl text-white">{user.username}</h1>
              </>
            ) : (
              <h1 className="font-bold text-2xl text-white">Spacewalk</h1>
            )}
          </div>
        ) : null}
        <button
          onClick={toggleSidebar}
          className="rounded-lg hover:bg-white/20 text-white p-1 transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex-col justify-center mt-4">
        <SidebarItem
          icon={<LayoutDashboard size={24} />}
          text="Dashboard"
          path="/dashboard"
          isCollapsed={!isSidebarOpen}
        />
        <SidebarItem
          icon={<Users size={24} />}
          text="Users"
          path="/dashboard/users"
          isCollapsed={!isSidebarOpen}
        />
        <SidebarItem
          icon={<FileText size={24} />}
          text="Reports"
          path="/dashboard/reports"
          isCollapsed={!isSidebarOpen}
        />
        <SidebarItem
          icon={<Settings size={24} />}
          text="Settings"
          path="/dashboard/settings"
          isCollapsed={!isSidebarOpen}
        />
      </div>

      <div className="absolute bottom-0 w-full border-t border-white/40 p-2">
        <SidebarItem
          icon={<LogOut size={24} />}
          text="Logout"
          onClick={async () => {
            await axios.post("https://api.spacewalk.my.id/auth/logout", { withCredentials: true });
            window.location.href = "https://www.spacewalk.my.id";
          }}
          isCollapsed={!isSidebarOpen}
        />
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, path, isCollapsed, onClick }) => {
  const location = useLocation(); // Mengambil path saat ini
  const isActive = location.pathname === path; // Cek apakah item sidebar ini aktif
  const isButton = Boolean(onClick); //Cek apakah item ini button

  return isButton ? (
    <button
      onClick={onClick}
      className="flex w-full text-left items-center p-3 mx-3 my-1 rounded-lg text-white text-lg transition-all hover:bg-white/20"
    >
      <div className={isCollapsed ? "" : "mr-3"}>{icon}</div>
      {!isCollapsed && <span>{text}</span>}
    </button>
  ) : (
    <Link
      to={`${path}`}
      className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'} 
    items-center p-3 mx-3 my-1 rounded-lg text-white text-lg transition-all 
    ${isActive ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
    >
      <div className={isCollapsed ? "" : "mr-3"}>{icon}</div>
      {!isCollapsed && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
