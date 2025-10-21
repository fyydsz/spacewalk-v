import { SidebarInset } from "@/components/ui/sidebar";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardNotFound() {
  const navigate = useNavigate();
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col items-center justify-center h-screen gap-4">
        <CardTitle className="text-4xl font-bold">404 Not Found</CardTitle>
        <Button variant="default" onClick={() => navigate("/dashboard/main")}>Back to dashboard?</Button>
      </div>
    </SidebarInset>
  );
}
