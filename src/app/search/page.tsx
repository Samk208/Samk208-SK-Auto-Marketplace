'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCarSearch } from '@/hooks/useCars';
import { carSearchSchema, type CarSearchInput } from '@/lib/validations/car';
import { CarCardSkeletonGrid } from '@/components/car/CarCardSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import Link from 'next/link';

/**
 * Search & Filter Page
 * 
 * UX/UI Specs:
 * - Mobile-first design with collapsible filters
 * - Debounced search (saves bandwidth on 3G/4G)
 * - Clear filter indicators
 * - Thumb-friendly touch targets (44x44px)
 * - React Hook Form + Zod validation
 * - React Query for data fetching
 */

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  
  const { register, watch, reset, formState: { errors } } = useForm<CarSearchInput>({
    resolver: zodResolver(carSearchSchema),
    defaultValues: {
      make: '',
      model: '',
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
    },
  });

  // Watch all form values for real-time filtering
  const filters = watch();
  
  // Fetch cars with current filters
  const { data: cars, isLoading, error, refetch } = useCarSearch(filters);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  const handleClearFilters = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header with search and filter toggle */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by make or model..."
                {...register('make')}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500"
                aria-label="Search cars by make or model"
              />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors min-h-[44px]"
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel (collapsible on mobile) */}
      {showFilters && (
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                  aria-label="Clear all filters"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Model filter */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Model
                </label>
                <input
                  id="model"
                  type="text"
                  placeholder="e.g., Sonata"
                  {...register('model')}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Price range */}
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Min Price (USD)
                </label>
                <input
                  id="minPrice"
                  type="number"
                  placeholder="10,000"
                  {...register('minPrice', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Max Price (USD)
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  placeholder="50,000"
                  {...register('maxPrice', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Year range */}
              <div>
                <label htmlFor="minYear" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Min Year
                </label>
                <input
                  id="minYear"
                  type="number"
                  placeholder="2020"
                  {...register('minYear', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results count */}
        {!isLoading && cars && (
          <div className="mb-6">
            <p className="text-neutral-600 dark:text-neutral-400">
              Found <span className="font-semibold text-neutral-900 dark:text-neutral-100">{cars.length}</span> vehicles
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <CarCardSkeletonGrid count={6} />}

        {/* Error state */}
        {error && <ErrorState onRetry={() => refetch()} />}

        {/* Results grid */}
        {!isLoading && !error && cars && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Car image */}
                  <div className="relative h-48 bg-neutral-200 dark:bg-neutral-700">
                    {car.images && car.images[0] && (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Car info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {car.year} • {car.location_city}, {car.location_country}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${car.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && cars && cars.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No vehicles found matching your criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
