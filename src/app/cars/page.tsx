import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
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
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle cookie setting errors (can happen in Server Components)
          }
        },
      },
    }
  );

  // Calculate pagination
  const itemsPerPage = 12;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // Build query
  let query = supabase
    .from('cars')
    .select(
      `
      *,
      profiles!dealer_id (
        full_name,
        avatar_url
      )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  // Add make filter if provided
  if (make) {
    query = query.ilike('make', `%${make}%`);
  }

  // Execute query
  const { data: cars, error, count } = await query;

  if (error) {
    console.error('Error fetching cars:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Browse Cars</h1>
        <p className="text-red-500">Error loading cars. Please try again later.</p>
      </div>
    );
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
