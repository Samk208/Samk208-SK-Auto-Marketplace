import { FeaturedCars } from '@/components/home/FeaturedCars';
import { HeroSection } from '@/components/home/HeroSection';
import type { Car } from '@/types/types';

export default async function HomePage() {
  // Placeholder: fetch featured cars server-side later using Supabase
  const featuredCars: Car[] = [];
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeaturedCars cars={featuredCars} sellers={[]} currentUser={null} />
      </div>
    </>
  );
}
