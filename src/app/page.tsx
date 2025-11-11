import { FeaturedCars } from '@/components/home/FeaturedCars';
import { HeroSection } from '@/components/home/HeroSection';
import { getFeaturedCars } from '@/app/actions/cars';
import type { Car } from '@/types/types';

export default async function HomePage() {
  // Fetch featured cars from database
  const result = await getFeaturedCars(8);

  // Map database car format to UI car format
  const featuredCars: Car[] = result.success && result.data ? result.data.map((dbCar: any) => ({
    id: dbCar.id,
    make: dbCar.make,
    model: dbCar.model,
    year: dbCar.year,
    price: dbCar.price,
    currency: dbCar.currency || 'USD',
    location: {
      city: dbCar.location_city || 'Unknown',
      country: dbCar.location_country || 'Unknown',
    },
    imageUrls: dbCar.images || [],
    specifications: dbCar.specifications || {},
    description: dbCar.description || '',
    status: dbCar.status || 'available',
    dealer_id: dbCar.seller_id || dbCar.dealer_id,
    created_at: dbCar.created_at,
  })) : [];

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeaturedCars cars={featuredCars} sellers={[]} currentUser={null} />
      </div>
    </>
  );
}
