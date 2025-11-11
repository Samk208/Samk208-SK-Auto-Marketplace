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
  const { data: carsData } = await supabase
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

  // Transform data to match frontend types
  const featuredCars: Car[] = (carsData || []).map((car) => ({
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
    status: car.status as any, // Database uses different status values
    dealer_id: car.dealer_id,
    // Include database fields for compatibility
    images: car.images,
    specifications_raw: car.specifications,
    location_city: car.location_city,
    location_country: car.location_country,
    created_at: car.created_at,
  }));

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
