import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { FeaturedCars } from '@/components/home/FeaturedCars';
import { HeroSection } from '@/components/home/HeroSection';
import type { Database } from '@/types/database.types';
import type { Car, User } from '@/types/types';

async function getFeaturedCars(): Promise<{ cars: Car[]; sellers: User[] }> {
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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Fetch featured cars
  const { data: carsData, error: carsError } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (carsError || !carsData || carsData.length === 0) {
    if (carsError) {
      console.error('[home] featured cars fetch failed', carsError);
    }
    return { cars: [], sellers: [] };
  }

  // Get unique dealer IDs
  const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];

  // Fetch dealer profiles separately
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, phone_number, verification_status')
    .in('id', dealerIds);

  // Create a map of profiles for easy lookup
  const profilesMap = new Map(
    (profilesData || []).map(profile => [profile.id, profile])
  );

  const cars: Car[] = carsData.map((car) => {
    const descriptionCandidates = [
      car.description,
      (car as { description_en?: string | null }).description_en,
      (car as { description_fr?: string | null }).description_fr,
      (car as { description_sw?: string | null }).description_sw,
    ];

    return {
      id: car.id,
      make: car.make ?? '',
      model: car.model ?? '',
      year: car.year ?? 0,
      price: typeof car.price === 'number' ? car.price : Number(car.price ?? 0),
      currency: car.currency ?? 'USD',
      description: descriptionCandidates.find((value) => !!value) ?? '',
      status: (car.status as Car['status']) ?? 'available',
      dealer_id: car.dealer_id ?? '',
      images: Array.isArray(car.images) ? car.images : [],
      specifications: (car.specifications as Record<string, unknown>) ?? {},
      location: {
        city: car.location_city ?? '',
        country: car.location_country ?? '',
      },
      created_at: car.created_at ?? undefined,
      specifications_raw: car.specifications,
      location_city: car.location_city ?? undefined,
      location_country: car.location_country ?? undefined,
    };
  });

  const sellers: User[] = Array.from(profilesMap.values()).map((profile) => ({
    id: profile.id,
    email: `${profile.id}@placeholder.local`,
    fullName: profile.full_name ?? 'Unknown Seller',
    avatarUrl: profile.avatar_url ?? undefined,
    role: 'seller',
    phone: profile.phone_number ?? undefined,
    location: undefined,
    businessDescription: undefined,
  }));

  return { cars, sellers };
}

export default async function HomePage() {
  const { cars, sellers } = await getFeaturedCars();

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeaturedCars cars={cars} sellers={sellers} currentUser={null} />
      </div>
    </>
  );
}
