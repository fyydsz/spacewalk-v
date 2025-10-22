import * as React from "react"
import { Home } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSwitcher({
  app,
}: {
  app: {
    name: string
    logo: React.ElementType
    plan: string
    url: string
  }[]
}) {
  const activeApp = app[0]

  const handleGoToDashboard = () => {
    window.location.href = activeApp.url;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleGoToDashboard}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <activeApp.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeApp.name}</span>
            <span className="truncate text-xs">{activeApp.plan}</span>
          </div>
          <Home className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

