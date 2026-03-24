import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorBookingLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header placeholder */}
      <div className="h-16 border-b border-border bg-card" />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Doctor profile skeleton */}
          <div className="w-full md:w-3/5 border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
              <Skeleton className="w-[120px] h-[120px] rounded-full mb-4" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <div className="px-6 py-5 space-y-3 border-t border-border">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="px-6 py-5 space-y-3 border-t border-border">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          {/* Booking panel skeleton */}
          <div className="w-full md:w-2/5 border border-border rounded-xl bg-card shadow-sm">
            <div className="px-6 py-5 border-b border-border">
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-3 w-56 mt-2" />
            </div>
            <div className="px-6 py-6 space-y-6">
              <Skeleton className="h-10 w-full rounded-md" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
