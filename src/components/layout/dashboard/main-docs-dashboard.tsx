
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./docs/app-sidebar";

const MainDocsDashboard = () => {
  return (
    <SidebarProvider >
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
};

export default MainDocsDashboard;