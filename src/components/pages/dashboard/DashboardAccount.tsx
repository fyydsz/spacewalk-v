import HeaderBreadcrumb from "@/components/layout/dashboard/main-breadcumb";
import { SidebarInset } from "@/components/ui/sidebar";

// const profile = {
//   id: "12345678910111213",
//   username: "fyy_",
//   email: "raffypradest@gmail.com",
//   joined_since: "12 days"
// }

const DashboardAccount: React.FC = () => {
  return(
    <SidebarInset>
      <HeaderBreadcrumb
        breadcrumbs={[
          { label: "Account", href: "#" },
          { label: "Profile" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Content */}
      </div>
    </SidebarInset>
  )
}

export default DashboardAccount;