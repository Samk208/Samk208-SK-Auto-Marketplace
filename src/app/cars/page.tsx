import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PAGINATION } from '@/lib/config/pagination';
import { logger } from '@/lib/utils/logger';
import CarsGrid from './CarsGrid';
import type { Database } from '@/types/database.types';

// Type for car with dealer relationship
type CarWithDealer = Database['public']['Tables']['cars']['Row'] & {
  profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'avatar_url'> | null;
};

interface CarsPageProps {
  searchParams: Promise<{
    page?: string;
    make?: string;
  }>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const make = params.make;

  // Create Supabase server client
  const supabase = await createServerSupabaseClient();

  // Calculate pagination
  const itemsPerPage = PAGINATION.CARS_PER_PAGE;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Build query for cars only (no join)
  let carsQuery = supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  // Add make filter if provided
  if (make) {
    carsQuery = carsQuery.ilike('make', `%${make}%`);
  }

  // Execute query
  const { data: carsData, error, count } = await carsQuery;

  if (error) {
    logger.error('cars-page', 'cars fetch failed', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Browse Cars</h1>
        <p className="text-red-500">Error loading cars. Please try again later.</p>
      </div>
    );
  }

  // Fetch dealer profiles separately
  let cars: CarWithDealer[] = [];
  if (carsData && carsData.length > 0) {
    const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', dealerIds);

    const profilesMap = new Map(
      (profilesData || []).map(profile => [profile.id, profile])
    );

    // Merge profiles into cars data
    cars = carsData.map(car => ({
      ...car,
      profiles: profilesMap.get(car.dealer_id) || null
    })) as CarWithDealer[];
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Cars</h1>
        <p className="text-muted-foreground">
          {count !== null && count !== undefined
            ? `Found ${count} ${count === 1 ? 'car' : 'cars'}`
            : 'Loading...'}
          {make && ` matching "${make}"`}
        </p>
      </div>

      {/* Car Grid */}
      {cars && cars.length > 0 ? (
        <>
          <div className="mb-8">
            <CarsGrid
              cars={cars.map((car) => ({
                id: car.id,
                make: car.make,
                model: car.model,
                year: car.year,
                price: Number(car.price),
                currency: car.currency,
                location_city: car.location_city,
                location_country: car.location_country,
                images: car.images || [],
                dealer: car.profiles
                  ? {
                      name: car.profiles.full_name || 'Unknown Seller',
                      verified: true,
                      avatarUrl: car.profiles.avatar_url || undefined,
                    }
                  : null,
              }))}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/cars?page=${page - 1}${make ? `&make=${make}` : ''}`}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-4 py-2 rounded border border-gray-300 text-gray-400 cursor-not-allowed">
                  Previous
                </span>
              )}

              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/cars?page=${page + 1}${make ? `&make=${make}` : ''}`}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Next
                </Link>
              ) : (
                <span className="px-4 py-2 rounded border border-gray-300 text-gray-400 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No cars found{make && ` for "${make}"`}. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
