import {
  SidebarInset,
} from "@/components/ui/sidebar"
import HeaderBreadcrumb from "@/components/layout/dashboard/main-breadcumb"
import { CardTitle } from "@/components/ui/card"

export default function DashboardRegisterRP() {
  return (

    <SidebarInset>
     <HeaderBreadcrumb
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Register Roleplay"}
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CardTitle>Register RP</CardTitle>
      </div>
    </SidebarInset>
  )
}
