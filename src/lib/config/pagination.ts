/**
 * Pagination Configuration Constants
 *
 * Centralized pagination settings used across the application.
 * Modify these values to adjust pagination behavior globally.
 */

export const PAGINATION = {
  /**
   * Number of featured cars to display on homepage
   */
  FEATURED_CARS_LIMIT: 4,

  /**
   * Number of cars per page in car listings
   */
  CARS_PER_PAGE: 12,

  /**
   * Maximum allowed page size for any paginated query
   * Used to prevent excessive data fetching
   */
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Type-safe pagination configuration
 * Use this to ensure consistent pagination across the app
 */
export type PaginationConfig = typeof PAGINATION;
