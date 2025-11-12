'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  location_city: string;
  location_country: string;
  images: string[];
  dealer: {
    name: string;
    verified: boolean;
    avatarUrl?: string;
  } | null;
}

interface CarsGridProps {
  cars: Car[];
}

export default function CarsGrid({ cars }: CarsGridProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Link
          key={car.id}
          href={`/cars/${car.id}`}
          className="group block"
        >
          <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
            {/* Car Image */}
            <div className="relative h-48 bg-muted">
              {car.images && car.images.length > 0 ? (
                <Image
                  src={car.images[0]}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No image</span>
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{car.year}</p>

              <p className="text-xl font-bold text-primary mb-3">
                {formatPrice(car.price, car.currency)}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {car.location_city}, {car.location_country}
                </span>

                {car.dealer?.verified && (
                  <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              {car.dealer && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Sold by {car.dealer.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
