'use client';

import { Search, Heart, Car, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';

/**
 * Empty State Component
 *
 * UX/UI Specs:
 * - Clear messaging for empty data scenarios
 * - Actionable CTAs to guide users
 * - Mobile-friendly layout
 * - Accessible with proper ARIA labels
 */

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'search' | 'heart' | 'car' | 'filter';
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your filters or search criteria.',
  icon = 'search',
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const icons = {
    search: Search,
    heart: Heart,
    car: Car,
    filter: Filter,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      {/* Icon */}
      <div className="mb-6 p-6 rounded-full bg-neutral-100 dark:bg-neutral-800">
        <Icon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
        {message}
      </p>

      {/* Action */}
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button size="lg">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} size="lg">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}

/**
 * No Search Results State
 * For empty search/filter results
 */
export function NoSearchResultsState({
  searchTerm,
  onClearFilters
}: {
  searchTerm?: string;
  onClearFilters?: () => void;
}) {
  return (
    <EmptyState
      icon="search"
      title="No cars found"
      message={
        searchTerm
          ? `We couldn't find any cars matching "${searchTerm}". Try different keywords or filters.`
          : "We couldn't find any cars matching your filters. Try adjusting your search criteria."
      }
      actionLabel={onClearFilters ? "Clear Filters" : "Browse All Cars"}
      actionHref={!onClearFilters ? "/cars" : undefined}
      onAction={onClearFilters}
    />
  );
}

/**
 * No Favorites State
 * For empty favorites list
 */
export function NoFavoritesState() {
  return (
    <EmptyState
      icon="heart"
      title="No favorites yet"
      message="Start adding cars to your favorites to keep track of vehicles you're interested in."
      actionLabel="Browse Cars"
      actionHref="/cars"
    />
  );
}

/**
 * No Featured Cars State
 * For empty featured cars section
 */
export function NoFeaturedCarsState() {
  return (
    <EmptyState
      icon="car"
      title="No featured cars available"
      message="Check back soon for our latest featured vehicles from verified sellers."
      actionLabel="View All Cars"
      actionHref="/cars"
    />
  );
}

/**
 * No Listings State
 * For seller with no listings
 */
export function NoListingsState({ onCreateListing }: { onCreateListing?: () => void }) {
  return (
    <EmptyState
      icon="car"
      title="No listings yet"
      message="Create your first car listing to start connecting with buyers across Africa."
      actionLabel="List Your Car"
      actionHref={!onCreateListing ? "/seller-dashboard" : undefined}
      onAction={onCreateListing}
    />
  );
}
