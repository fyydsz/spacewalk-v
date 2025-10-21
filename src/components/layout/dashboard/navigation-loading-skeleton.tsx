import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./main/app-sidebar"

export default function NavigationLoadingSkeleton() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center gap-2 bg-background border-b border-black/15 dark:border-white/20">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="!mr-2 !h-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <span className="text-muted-foreground">/</span>
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </header>
        {/* MAIN CONTENT SKELETON */}
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full mt-4" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
