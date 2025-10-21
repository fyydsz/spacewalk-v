import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NavigationLoadingSkeleton() {
  return (
    <div className="w-full h-full max-h-[calc(100vh-4rem)] p-8 md:p-20 overflow-hidden flex flex-col">
      {/* Welcome Header Skeleton */}
      <div className="mb-8 flex-shrink-0">
        <Skeleton className="h-12 w-64 mb-2 ml-2" />
        <Skeleton className="h-8 w-48 ml-2" />
      </div>

      {/* Dashboard Grid */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Large Card */}
        <div className="w-full lg:w-1/3">
          <Card className="h-full max-h-[400px] lg:max-h-none border-2 border-border/50">
            <CardContent className="p-8">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right Cards Container */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Top Right Card */}
          <Card className="flex-1 border-2 border-border/50">
            <CardContent className="p-8">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>

          {/* Bottom Right Card */}
          <Card className="flex-1 border-2 border-border/50">
            <CardContent className="p-8">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
