'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  ShieldCheck,
  Star,
  MessageCircle
} from 'lucide-react';
import { useCarDetail } from '@/hooks/useCars';
import { Button } from '@/components/ui/Button';
import { CarDetailSkeleton } from '@/components/car/CarDetailSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Car as CarType } from '@/types/types';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: car, isLoading, error, refetch } = useCarDetail(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Loading state
  if (isLoading) {
    return <CarDetailSkeleton />;
  }

  // Error state
  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ErrorState
          title="Car Not Found"
          message={error instanceof Error ? error.message : 'The car you are looking for does not exist.'}
          onRetry={() => refetch()}
          showHomeButton={true}
        />
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : ['/placeholder-car.jpg'];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden mb-6">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 p-2 rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 rotate-180" />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-primary'
                          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Vehicle Specifications</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Gauge className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Mileage</div>
                    <div className="font-medium">{(car.specifications?.mileage || car.specifications?.mileage_km)?.toLocaleString() || 'N/A'} km</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Fuel className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Fuel Type</div>
                    <div className="font-medium capitalize">{car.specifications?.fuelType || car.specifications?.fuel_type || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Transmission</div>
                    <div className="font-medium capitalize">{car.specifications?.transmission || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Body Type</div>
                    <div className="font-medium capitalize">{car.specifications?.bodyType || car.specifications?.body_type || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{car.location_city && car.location_country ? `${car.location_city}, ${car.location_country}` : 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Price & Seller Info */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 mb-6 sticky top-4">
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Price (FOB)</div>
                <div className="text-3xl font-bold text-primary">
                  ${car.price?.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button className="w-full" size="lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send Inquiry
                </Button>
                <Button variant="secondary" className="w-full" size="lg">
                  Calculate Total Cost
                </Button>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>Seller Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>4.8 Rating (120 reviews)</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                  {(car.seller || car.dealer)?.avatar_url ? (
                    <Image
                      src={(car.seller || car.dealer)!.avatar_url!}
                      alt={(car.seller || car.dealer)?.full_name || 'Seller'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-500">
                      <Car className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{(car.seller || car.dealer)?.full_name || 'Seller'}</div>
                  <div className="text-sm text-muted-foreground">Professional Dealer</div>
                </div>
              </div>

              <Button variant="secondary" className="w-full">
                View Seller Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
