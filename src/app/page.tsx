import { FeaturedCars } from '@/components/home/FeaturedCars';
import { HeroSection } from '@/components/home/HeroSection';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Car, User } from '@/types/types';

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
    .select(
      `
      *,
      dealer:profiles!dealer_id(
        id,
        full_name,
        avatar_url,
        verification_status,
        seller_rating
      )
    `
    )
    .eq('featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  // Handle query error
  if (carsError) {
    console.error('Error fetching featured cars:', carsError);
  }

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

  // Transform data to match frontend types
  const featuredCars: Car[] = (carsData || []).map((car) => {
    // Map database status to frontend status with validation
    const dbStatus = typeof car.status === 'string' ? car.status : 'draft';
    const validatedStatus = mapStatusToFrontend(dbStatus);

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      currency: 'USD', // Default currency
      location: {
        city: car.location_city,
        country: car.location_country,
      },
      imageUrls: car.images || [],
      specifications: car.specifications || {},
      description: car.description_en || '', // Default to English description
      status: validatedStatus,
      dealer_id: car.dealer_id,
      // Include database fields for compatibility
      images: car.images,
      specifications_raw: car.specifications,
      location_city: car.location_city,
      location_country: car.location_country,
      created_at: car.created_at,
    };
  });

  // Extract unique sellers from cars
  const sellersMap = new Map<string, User>();
  (carsData || []).forEach((car) => {
    if (car.dealer && !sellersMap.has(car.dealer.id)) {
      sellersMap.set(car.dealer.id, {
        id: car.dealer.id,
        email: '', // Email not needed for display
        fullName: car.dealer.full_name || '',
        role: 'seller', // Dealers are sellers in the frontend
        avatarUrl: car.dealer.avatar_url || undefined,
        businessDescription: car.dealer.business_name || undefined,
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
