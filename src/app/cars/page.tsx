import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CarCard } from '@/components/car/CarCard';
import type { Car, User } from '@/types/types';

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

  // Apply filters
  if (searchParams.make) {
    query = query.ilike('make', `%${searchParams.make}%`);
  }

  if (searchParams.model) {
    query = query.ilike('model', `%${searchParams.model}%`);
  }

  if (searchParams.minPrice) {
    query = query.gte('price', parseInt(searchParams.minPrice));
  }

  if (searchParams.maxPrice) {
    query = query.lte('price', parseInt(searchParams.maxPrice));
  }

  if (searchParams.minYear) {
    query = query.gte('year', parseInt(searchParams.minYear));
  }

  if (searchParams.maxYear) {
    query = query.lte('year', parseInt(searchParams.maxYear));
  }

  if (searchParams.location) {
    query = query.or(
      `location_city.ilike.%${searchParams.location}%,location_country.ilike.%${searchParams.location}%`
    );
  }

  // Execute query with pagination
  const { data: carsData, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  // Transform data
  const cars: Car[] = (carsData || []).map((car) => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    currency: 'USD',
    location: {
      city: car.location_city,
      country: car.location_country,
    },
    imageUrls: car.images || [],
    specifications: car.specifications || {},
    description: car.description_en || '',
    status: car.status as any,
    dealer_id: car.dealer_id,
    images: car.images,
    specifications_raw: car.specifications,
    location_city: car.location_city,
    location_country: car.location_country,
    created_at: car.created_at,
  }));

  // Extract unique sellers
  const sellersMap = new Map<string, User>();
  (carsData || []).forEach((car) => {
    if (car.dealer && !sellersMap.has(car.dealer.id)) {
      sellersMap.set(car.dealer.id, {
        id: car.dealer.id,
        email: '',
        fullName: car.dealer.full_name || '',
        role: 'seller',
        avatarUrl: car.dealer.avatar_url || undefined,
        businessDescription: car.dealer.business_name || undefined,
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
            <a href="/cars" className="text-primary hover:underline">
              browse all cars
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
