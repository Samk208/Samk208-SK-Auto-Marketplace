import { CarCard } from '@/components/car/CarCard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Car, User } from '@/types/types';
import Link from 'next/link';

type CarsSearchParams = {
  make?: string;
  model?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  location?: string;
  page?: string;
};

interface CarsPageProps {
  searchParams: Promise<CarsSearchParams>;
}

const ITEMS_PER_PAGE = 12;

function validateSearchInput(input: string): string | null {
  const trimmed = input.trim().substring(0, 50);
  if (!/^[a-zA-Z0-9\s\-'.]+$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

const buildQueryString = (
  base: CarsSearchParams,
  overrides: Partial<Record<keyof CarsSearchParams, string>> = {}
) => {
  const merged: CarsSearchParams = { ...base, ...overrides };
  const query = new URLSearchParams();
  (Object.entries(merged) as Array<[keyof CarsSearchParams, string | undefined]>).forEach(
    ([key, value]) => {
      if (value && value.length > 0) {
        query.set(key, value);
      }
    }
  );
  return query.toString();
};

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
      return 'available';
  }
};

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10));
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let query = supabase.from('cars').select('*', { count: 'exact' }).eq('status', 'published');

  if (params.make) {
    const validatedMake = validateSearchInput(params.make);
    if (validatedMake) {
      query = query.eq('make', validatedMake);
    }
  }

  if (params.model) {
    const validatedModel = validateSearchInput(params.model);
    if (validatedModel) {
      query = query.eq('model', validatedModel);
    }
  }

  if (params.minPrice) {
    const parsedMinPrice = parseInt(params.minPrice, 10);
    if (!Number.isNaN(parsedMinPrice) && parsedMinPrice >= 0) {
      query = query.gte('price', parsedMinPrice);
    }
  }

  if (params.maxPrice) {
    const parsedMaxPrice = parseInt(params.maxPrice, 10);
    if (!Number.isNaN(parsedMaxPrice) && parsedMaxPrice >= 0) {
      query = query.lte('price', parsedMaxPrice);
    }
  }

  if (params.minYear) {
    const parsedMinYear = parseInt(params.minYear, 10);
    if (!Number.isNaN(parsedMinYear)) {
      query = query.gte('year', parsedMinYear);
    }
  }

  if (params.maxYear) {
    const parsedMaxYear = parseInt(params.maxYear, 10);
    if (!Number.isNaN(parsedMaxYear)) {
      query = query.lte('year', parsedMaxYear);
    }
  }

  if (params.location) {
    const validatedLocation = validateSearchInput(params.location);
    if (validatedLocation) {
      query = query.or(
        `location_city.eq.${validatedLocation},location_country.eq.${validatedLocation}`
      );
    }
  }

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
    carsData = [];
    count = 0;
  }

  const dealerIds = Array.from(
    new Set(
      (carsData || [])
        .map((car) => (typeof car.dealer_id === 'string' ? car.dealer_id : null))
        .filter((id): id is string => Boolean(id))
    )
  );

  type DealerProfile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    business_name: string | null;
  };

  let dealerProfiles: DealerProfile[] = [];
  if (dealerIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, business_name')
      .in('id', dealerIds);
    if (profilesError) {
      console.error('Error fetching dealer profiles:', profilesError);
    } else if (profilesData) {
      dealerProfiles = profilesData as DealerProfile[];
    }
  }

  const dealerProfileMap = new Map<string, DealerProfile>();
  dealerProfiles.forEach((profile) => {
    dealerProfileMap.set(profile.id, profile);
  });

  const cars: Car[] = (carsData || []).map((car) => {
    const dbStatus = typeof car.status === 'string' ? car.status : 'draft';
    const mappedStatus = mapStatusToFrontend(dbStatus);
    const currency = typeof car.currency === 'string' ? car.currency : 'USD';
    const imageArray = Array.isArray(car.images) ? (car.images as string[]) : [];
    const specifications =
      (car.specifications as Record<string, unknown> | null | undefined) ?? {};

    return {
      id: (car.id as string) || '',
      make: (car.make as string) || '',
      model: (car.model as string) || '',
      year: typeof car.year === 'number' ? (car.year as number) : new Date().getFullYear(),
      price: typeof car.price === 'number' ? (car.price as number) : 0,
      currency,
      location: {
        city: (car.location_city as string) || '',
        country: (car.location_country as string) || '',
      },
      imageUrls: imageArray,
      specifications,
      description: (car.description_en as string) || '',
      status: mappedStatus,
      dealer_id: (car.dealer_id as string) || '',
      images: imageArray,
      specifications_raw: specifications,
      location_city: (car.location_city as string) || '',
      location_country: (car.location_country as string) || '',
      created_at: (car.created_at as string) || '',
    };
  });

  const sellersMap = new Map<string, User>();
  dealerProfiles.forEach((profile) => {
    if (!sellersMap.has(profile.id)) {
      sellersMap.set(profile.id, {
        id: profile.id,
        email: '',
        fullName: profile.full_name || '',
        role: 'seller',
        avatarUrl: profile.avatar_url || undefined,
        businessName: profile.business_name || undefined,
      });
    }
  });

  const sellers = Array.from(sellersMap.values());
  const totalPages = Math.max(1, Math.ceil((count || 0) / ITEMS_PER_PAGE));
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Cars</h1>
        <p className="text-muted-foreground">
          Showing {cars.length} of {count || 0} available vehicles
        </p>
      </div>

      {(params.make || params.model || params.minPrice || params.maxPrice || params.location) && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {params.make && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Make: {params.make}
              </span>
            )}
            {params.model && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Model: {params.model}
              </span>
            )}
            {params.minPrice && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Min: ${parseInt(params.minPrice, 10).toLocaleString()}
              </span>
            )}
            {params.maxPrice && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Max: ${parseInt(params.maxPrice, 10).toLocaleString()}
              </span>
            )}
            {params.location && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Location: {params.location}
              </span>
            )}
          </div>
        </div>
      )}

      {cars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} sellers={sellers} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {hasPrevPage && (
                <a
                  href={`/cars?${buildQueryString(params, {
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
                  href={`/cars?${buildQueryString(params, {
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
          <p className="text-lg text-muted-foreground">No cars found matching your criteria.</p>
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
