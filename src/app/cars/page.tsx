import { CarCard } from '@/components/car/CarCard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Car, User } from '@/types/types';
import Link from 'next/link';

interface CarsPageProps {
  searchParams: {
    make?: string;
    model?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    location?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 12;

/**
 * Sanitize search input to prevent SQL LIKE injection
 * Escapes % and _ characters that have special meaning in LIKE patterns
 */
function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_]/g, '\\$&');
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const supabase = await createServerSupabaseClient();

  // Get current page
  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build query
  let query = supabase
    .from('cars')
    .select(
      `
      *,
      dealer:profiles!dealer_id(
        id,
        full_name,
        avatar_url,
        verification_status,
        seller_rating,
        business_name
      )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published');

  // Apply filters with sanitized input
  if (searchParams.make) {
    const sanitizedMake = sanitizeSearchInput(searchParams.make);
    query = query.ilike('make', `%${sanitizedMake}%`);
  }

  if (searchParams.model) {
    const sanitizedModel = sanitizeSearchInput(searchParams.model);
    query = query.ilike('model', `%${sanitizedModel}%`);
  }

  if (searchParams.minPrice) {
    const parsedMinPrice = parseInt(searchParams.minPrice, 10);
    if (!Number.isNaN(parsedMinPrice) && Number.isFinite(parsedMinPrice) && parsedMinPrice >= 0) {
      query = query.gte('price', parsedMinPrice);
    }
  }

  if (searchParams.maxPrice) {
    const parsedMaxPrice = parseInt(searchParams.maxPrice, 10);
    if (!Number.isNaN(parsedMaxPrice) && Number.isFinite(parsedMaxPrice) && parsedMaxPrice >= 0) {
      query = query.lte('price', parsedMaxPrice);
    }
  }

  if (searchParams.minYear) {
    const parsedMinYear = parseInt(searchParams.minYear, 10);
    if (!Number.isNaN(parsedMinYear) && Number.isFinite(parsedMinYear) && Number.isInteger(parsedMinYear)) {
      query = query.gte('year', parsedMinYear);
    }
  }

  if (searchParams.maxYear) {
    const parsedMaxYear = parseInt(searchParams.maxYear, 10);
    if (!Number.isNaN(parsedMaxYear) && Number.isFinite(parsedMaxYear) && Number.isInteger(parsedMaxYear)) {
      query = query.lte('year', parsedMaxYear);
    }
  }

  if (searchParams.location) {
    const sanitizedLocation = sanitizeSearchInput(searchParams.location);
    query = query.or(
      `location_city.ilike.%${sanitizedLocation}%,location_country.ilike.%${sanitizedLocation}%`
    );
  }

  // Execute query with pagination and error handling
  let carsData: Array<Record<string, unknown>> | null = null;
  let count: number | null = null;

  try {
    const result = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (result.error) {
      console.error('Database query error:', result.error);
      throw new Error(`Failed to fetch cars: ${result.error.message}`);
    }

    carsData = result.data;
    count = result.count;
  } catch (error) {
    console.error('Error fetching cars:', error);
    // Return safe fallback for graceful degradation
    carsData = [];
    count = 0;
  }

  // Transform data
  // Define valid car statuses with type safety
  const VALID_STATUSES = ['draft', 'published', 'sold', 'archived'] as const;
  type DbCarStatus = (typeof VALID_STATUSES)[number];

  // Map database status to frontend status
  const mapStatusToFrontend = (dbStatus: string): Car['status'] => {
    switch (dbStatus) {
      case 'published':
        return 'Active';
      case 'sold':
        return 'sold';
      case 'draft':
        return 'pending';
      case 'archived':
        return 'Sold';
      default:
        return 'available'; // Safe default
    }
  };

  const cars: Car[] = (carsData || []).map((car: Record<string, unknown>) => {
    // Map database status to frontend status
    const dbStatus = typeof car.status === 'string' ? car.status : 'draft';
    const mappedStatus = mapStatusToFrontend(dbStatus);

    return {
      id: (car.id as string) || '',
      make: (car.make as string) || '',
      model: (car.model as string) || '',
      year: (car.year as number) || new Date().getFullYear(),
      price: (car.price as number) || 0,
      currency: 'USD',
      location: {
        city: (car.location_city as string) || '',
        country: (car.location_country as string) || '',
      },
      imageUrls: (car.images as string[]) || [],
      specifications: (car.specifications as Record<string, unknown>) || {},
      description: (car.description_en as string) || '',
      status: mappedStatus,
      dealer_id: (car.dealer_id as string) || '',
      images: (car.images as string[]) || [],
      specifications_raw: car.specifications,
      location_city: (car.location_city as string) || '',
      location_country: (car.location_country as string) || '',
      created_at: (car.created_at as string) || '',
    };
  });

  // Extract unique sellers
  const sellersMap = new Map<string, User>();
  (carsData || []).forEach((car: Record<string, unknown>) => {
    const dealer = car.dealer as Record<string, unknown> | undefined;
    if (dealer && typeof dealer.id === 'string' && !sellersMap.has(dealer.id)) {
      sellersMap.set(dealer.id, {
        id: dealer.id,
        email: '',
        fullName: (dealer.full_name as string) || '',
        role: 'seller',
        avatarUrl: (dealer.avatar_url as string) || undefined,
        businessDescription: (dealer.business_name as string) || undefined,
      });
    }
  });

  const sellers = Array.from(sellersMap.values());

  // Calculate pagination
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Cars</h1>
        <p className="text-muted-foreground">
          Showing {cars.length} of {count || 0} available vehicles
        </p>
      </div>

      {/* Filters Summary */}
      {(searchParams.make ||
        searchParams.model ||
        searchParams.minPrice ||
        searchParams.maxPrice ||
        searchParams.location) && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {searchParams.make && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Make: {searchParams.make}
              </span>
            )}
            {searchParams.model && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Model: {searchParams.model}
              </span>
            )}
            {searchParams.minPrice && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Min: ${parseInt(searchParams.minPrice).toLocaleString()}
              </span>
            )}
            {searchParams.maxPrice && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Max: ${parseInt(searchParams.maxPrice).toLocaleString()}
              </span>
            )}
            {searchParams.location && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Location: {searchParams.location}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cars Grid */}
      {cars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} sellers={sellers} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {hasPrevPage && (
                <a
                  href={`/cars?${new URLSearchParams({
                    ...searchParams,
                    page: (currentPage - 1).toString(),
                  })}`}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Previous
                </a>
              )}

              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              {hasNextPage && (
                <a
                  href={`/cars?${new URLSearchParams({
                    ...searchParams,
                    page: (currentPage + 1).toString(),
                  })}`}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No cars found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or{' '}
            <Link href="/cars" className="text-primary hover:underline">
              browse all cars
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
