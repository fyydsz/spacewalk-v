import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton untuk form registrasi karakter
 */
export function RegistrationFormSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-0">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Character Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Birthday Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Gender Radio */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Skeleton untuk dashboard dengan karakter yang sudah ada
 */
export function DashboardSkeleton() {
  return (
    <div className="w-full h-full max-h-[calc(100vh-4rem)] p-8 md:p-12 overflow-hidden flex flex-col">
      {/* Welcome Header */}
      <div className="mb-8 flex-shrink-0">
        <Skeleton className="h-12 w-64 mb-2 ml-2" />
        <Skeleton className="h-8 w-48 ml-2" />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left Large Card */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Card className="h-full max-h-[400px] lg:max-h-[480px] border-2 border-border/50">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Top Right Card */}
        <div className="lg:col-span-2">
          <Card className="h-full max-h-[180px] lg:max-h-[220px] border-2 border-border/50">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Right Card */}
        <div className="lg:col-span-2">
          <Card className="h-full max-h-[180px] lg:max-h-[220px] border-2 border-border/50">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton untuk loading state sederhana (bisa digunakan untuk berbagai keperluan)
 */
export function SimpleSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-0">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center p-8 space-y-4">
          <Skeleton className="h-8 w-8 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Skeleton untuk page content (full width)
 */
export function PageContentSkeleton() {
  return (
    <div className="w-full h-full p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 border-border/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
