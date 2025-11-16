import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Car Detail Page Loading Skeleton
 *
 * UX/UI Specs:
 * - Shows layout structure while loading car details
 * - Optimized for 3G/4G (prevents layout shift)
 * - Mobile-first responsive design
 * - Matches actual CarDetailPage layout
 */

export function CarDetailSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery Skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden mb-6">
              {/* Main Image */}
              <Skeleton className="w-full aspect-[4/3]" />

              {/* Thumbnail Strip */}
              <div className="p-4 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="flex-shrink-0 w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Vehicle Details Skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-6">
              <Skeleton className="h-7 w-48 mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <Skeleton className="h-7 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right Column - Price & Seller Info */}
          <div className="lg:col-span-1">
            {/* Price Card Skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-6">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-9 w-32 mb-6" />

              <div className="space-y-3 mb-6">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Seller Info Skeleton */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <Skeleton className="h-6 w-40 mb-4" />

              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
