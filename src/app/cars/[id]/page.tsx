import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ChevronRight,
  Home,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Eye,
  Share2,
  Package,
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { incrementCarViews } from '@/app/actions/cars';
import { CarImageGallery } from '@/components/car/CarImageGallery';
import { DealerCard } from '@/components/car/DealerCard';
import { FavoriteButton } from '@/components/car/FavoriteButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatMileage, formatRelativeTime } from '@/lib/utils/format';
import type { Database } from '@/types/database.types';

type Car = Database['public']['Tables']['cars']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface CarWithDealer extends Car {
  dealer: Profile;
}

interface PageProps {
  params: {
    id: string;
  };
}

/**
 * Fetch car data from Supabase
 * Server-side data fetching with dealer information joined
 */
async function getCarData(carId: string): Promise<CarWithDealer | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cars')
    .select(
      `
      *,
      dealer:profiles!dealer_id (
        id,
        email,
        full_name,
        avatar_url,
        role,
        phone_number,
        language_preference,
        country,
        verification_status,
        seller_rating,
        business_name,
        business_registration,
        created_at,
        updated_at
      )
    `
    )
    .eq('id', carId)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  // Type assertion for the joined data
  return data as unknown as CarWithDealer;
}

/**
 * Check if the car is favorited by the current user
 */
async function checkIsFavorited(carId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('car_id', carId)
    .single();

  return !!data;
}

/**
 * Generate metadata for the car detail page
 * Improves SEO and social sharing
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await getCarData(params.id);

  if (!car) {
    return {
      title: 'Car Not Found',
      description: 'The requested car listing could not be found.',
    };
  }

  const title = `${car.year} ${car.make} ${car.model} - ${formatCurrency(car.price)}`;
  const description =
    car.description_en ||
    `${car.year} ${car.make} ${car.model} with ${formatMileage(car.mileage)}. Located in ${car.location_city}, ${car.location_country}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.images.length > 0 ? [car.images[0]] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: car.images.length > 0 ? [car.images[0]] : [],
    },
  };
}

/**
 * Car Detail Page
 *
 * Server Component that displays comprehensive information about a specific car.
 * Features:
 * - Image gallery with fullscreen view
 * - Complete specifications
 * - Dealer information and contact options
 * - Favorite and share functionality
 * - View count tracking
 * - Responsive design for mobile and desktop
 */
export default async function CarDetailPage({ params }: PageProps) {
  const car = await getCarData(params.id);

  if (!car) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementCarViews(params.id).catch(console.error);

  // Check if favorited
  const isFavorited = await checkIsFavorited(params.id);

  const carName = `${car.year} ${car.make} ${car.model}`;

  // Parse specifications
  const specifications = (car.specifications as Record<string, unknown>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/cars" className="hover:text-primary">
            Cars
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium truncate">{carName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <CarImageGallery images={car.images} carName={carName} />

            {/* Title, Price, and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{carName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {car.location_city}, {car.location_country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {car.view_count.toLocaleString()} views
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton carId={car.id} initialIsFavorited={isFavorited} />
                <Button variant="default" outline size="icon" aria-label="Share this car">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <Card className="p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(car.price)}
                </span>
                <span className="text-gray-600">FOB Price</span>
              </div>
              {car.shipping_available && (
                <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                  <Package className="h-4 w-4" />
                  Shipping available to your location
                </div>
              )}
            </Card>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">Year</span>
                </div>
                <p className="text-lg font-semibold">{car.year}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium">Mileage</span>
                </div>
                <p className="text-lg font-semibold">{formatMileage(car.mileage)}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Fuel className="h-4 w-4" />
                  <span className="text-xs font-medium">Fuel</span>
                </div>
                <p className="text-lg font-semibold">{car.fuel_type || 'N/A'}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs font-medium">Transmission</span>
                </div>
                <p className="text-lg font-semibold">{car.transmission || 'N/A'}</p>
              </Card>
            </div>

            {/* Description */}
            {car.description_en && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {car.description_en}
                </p>
                {car.ai_generated && (
                  <Badge variant="secondary" className="mt-4">
                    AI-Generated Description
                  </Badge>
                )}
              </Card>
            )}

            {/* Detailed Specifications */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <SpecRow label="Make" value={car.make} />
                <SpecRow label="Model" value={car.model} />
                <SpecRow label="Year" value={car.year.toString()} />
                <SpecRow label="Mileage" value={formatMileage(car.mileage)} />
                <SpecRow label="Fuel Type" value={car.fuel_type || 'Not specified'} />
                <SpecRow label="Transmission" value={car.transmission || 'Not specified'} />
                <SpecRow label="Location" value={`${car.location_city}, ${car.location_country}`} />
                <SpecRow label="Status" value={car.status} capitalize />

                {/* Additional specifications from JSON */}
                {Object.entries(specifications).map(([key, value]) => (
                  <SpecRow
                    key={key}
                    label={key.replace(/_/g, ' ')}
                    value={String(value)}
                    capitalize
                  />
                ))}
              </div>
            </Card>

            {/* Listing Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Listing Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">{formatRelativeTime(car.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatRelativeTime(car.updated_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing ID</span>
                  <span className="font-mono text-xs">{car.id}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dealer Card */}
            <DealerCard dealer={car.dealer} carId={car.id} />

            {/* Safety Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Always verify the seller and inspect the vehicle</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Never send payment before seeing the car</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Use secure payment methods</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Report suspicious listings</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SpecRow Component
 * Displays a single specification row with label and value
 */
function SpecRow({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 capitalize">{label}</span>
      <span className={`font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</span>
    </div>
  );
}
