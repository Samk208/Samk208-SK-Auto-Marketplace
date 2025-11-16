import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Car Card Loading Skeleton
 * 
 * UX/UI Specs:
 * - Shows layout structure while loading (better than spinners)
 * - Optimized for 3G/4G (prevents layout shift)
 * - Mobile-first responsive design
 * - Matches actual CarCard dimensions
 */

export function CarCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 md:h-56" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Verified badge */}
        <Skeleton className="h-6 w-28" />
        
        {/* Car title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Location */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Seller info */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Rating */}
        <Skeleton className="h-4 w-32" />
        
        {/* Price */}
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

/**
 * Grid of car card skeletons
 * Shows 6 cards by default (matches featured cars limit)
 */
export function CarCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}
