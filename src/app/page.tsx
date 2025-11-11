import { FeaturedCars } from '@/components/home/FeaturedCars';
import { HeroSection } from '@/components/home/HeroSection';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Car, User } from '@/types/types';

interface DealerProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  verification_status: string | null;
  seller_rating: number | null;
  business_name: string | null;
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUser: User | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      currentUser = {
        id: profile.id,
        email: user.email || '',
        fullName: profile.full_name || '',
        role: profile.role === 'dealer' ? 'seller' : 'buyer',
        avatarUrl: profile.avatar_url || undefined,
        phone: profile.phone_number || undefined,
        location: profile.country || undefined,
        businessDescription: profile.business_name || undefined,
      };
    }
  }

  // Fetch featured cars with seller information
  const { data: carsData, error: carsError } = await supabase
    .from('cars')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  // Handle query error
  if (carsError) {
    console.error('Error fetching featured cars:', carsError);
  }

  // Define valid car statuses for documentation (not used in runtime)
  // const VALID_STATUSES = ['draft', 'published', 'sold', 'archived'] as const;
  // type DbCarStatus = (typeof VALID_STATUSES)[number];

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

  const dealerIds = Array.from(
    new Set(
      (carsData || [])
        .map((car) => (typeof car.dealer_id === 'string' ? car.dealer_id : null))
        .filter((id): id is string => Boolean(id))
    )
  );

  let dealerProfiles: DealerProfile[] = [];
  if (dealerIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, verification_status, seller_rating, business_name')
      .in('id', dealerIds);
    if (profilesError) {
      console.error('Error fetching dealer profiles:', profilesError);
    } else if (profilesData) {
      dealerProfiles = profilesData as DealerProfile[];
    }
  }

  const featuredCars: Car[] = (carsData || []).map((car) => {
    // Map database status to frontend status with validation
    const dbStatus = typeof car.status === 'string' ? car.status : 'draft';
    const validatedStatus = mapStatusToFrontend(dbStatus);
    const imageArray = Array.isArray(car.images) ? (car.images as string[]) : [];
    const specifications =
      (car.specifications as Record<string, unknown> | null | undefined) ?? {};
    const currency = typeof car.currency === 'string' ? (car.currency as string) : 'USD';

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price ?? 0,
      currency,
      location: {
        city: (car.location_city as string) || '',
        country: (car.location_country as string) || '',
      },
      imageUrls: imageArray,
      specifications,
      description: (car.description_en as string) || '',
      status: validatedStatus,
      dealer_id: car.dealer_id,
      // Include database fields for compatibility
      images: imageArray,
      specifications_raw: specifications,
      location_city: (car.location_city as string) || '',
      location_country: (car.location_country as string) || '',
      created_at: (car.created_at as string) || '',
    };
  });

  // Extract unique sellers from cars
  const sellersMap = new Map<string, User>();
  dealerProfiles.forEach((profile) => {
    if (!sellersMap.has(profile.id)) {
      sellersMap.set(profile.id, {
        id: profile.id,
        email: '', // Email not needed for display
        fullName: profile.full_name || '',
        role: 'seller', // Dealers are sellers in the frontend
        avatarUrl: profile.avatar_url || undefined,
        businessName: profile.business_name || undefined,
      });
    }
  });

  const sellers = Array.from(sellersMap.values());

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeaturedCars
          cars={featuredCars}
          sellers={sellers}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}
