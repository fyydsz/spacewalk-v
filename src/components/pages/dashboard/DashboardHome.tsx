import { SidebarInset } from "@/components/ui/sidebar";
import HeaderBreadcrumb from "@/components/layout/dashboard/main-breadcumb";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart, Users, MessageCircle, ShieldCheck } from "lucide-react";

export default function DashboardHome() {
  return (
    <SidebarInset>
      <HeaderBreadcrumb
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CardTitle className="text-2xl">Roleplay Server Overview</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Members</CardTitle>
              <Users className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">1,235</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Roleplays</CardTitle>
              <MessageCircle className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">12</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Moderation Actions</CardTitle>
              <ShieldCheck className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">47</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Engagement Rate</CardTitle>
              <BarChart className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">78%</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
