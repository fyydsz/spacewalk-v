import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  // SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserRegister } from "../components/main-menu"
import { useEffect } from "react"
// import RecentActivity from "./components/activity"
// import ProjectProgress from "./components/progress"
// import DashboardSummary from "./components/summary"

export default function MainDashboardPage() {
  useEffect(() => {
    document.title = "Spacewalk Dashboard"
  }, [])

  return (
    <SidebarInset className="flex flex-col">
      <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center gap-2 bg-background border-b border-black/15 dark:border-white/20">
        <div className="flex w-full items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="!mr-2 !h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Main Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center flex-1">
        <UserRegister />
      </div>
    </SidebarInset>

  )
}