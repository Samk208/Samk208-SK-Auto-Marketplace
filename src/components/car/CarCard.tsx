'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from '@/hooks/useTranslation';
import type { Car, ToastMessage, User, NavigateHandler } from '@/types';
import Image from 'next/image';
import React from 'react';

interface CarCardProps {
  car: Car;
  sellers: User[];
  onNavigate?: NavigateHandler;
  showToast?: (message: string, type?: ToastMessage['type']) => void;
  currentUser?: User | null;
}

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement> & { isFavorite: boolean }> = ({ isFavorite, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);


export const CarCard: React.FC<CarCardProps> = ({ car, sellers, onNavigate, showToast, currentUser }) => {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const seller = sellers.find(s => s.id === car.dealer_id);
  const isVerified = seller && seller.phone && seller.location;
  const primaryImage = car.imageUrls[0] || '/placeholder-car.jpg';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
        showToast?.('Please log in to save favorites.', 'info');
        return;
    }
    toggleFavorite(car.id);
    showToast?.(t('favorites_coming_soon'), 'info');
  };
  
  return (
    <Card className="overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl dark:hover:shadow-purple-500/20">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={primaryImage}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized
          />
          {isVerified && (
            <div className="absolute top-2 left-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
              {t('verified_seller')}
            </div>
          )}
          {currentUser && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 rounded-full bg-background/70 hover:bg-background text-red-500 transition-colors"
            >
              <HeartIcon isFavorite={isFavorite(car.id)} className="w-5 h-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg font-bold">{car.make} {car.model}</CardTitle>
                 <CardDescription>{car.year}</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground text-right flex-shrink-0">
                <MapPinIcon className="w-4 h-4" />
                <span>{car.location.city}, {car.location.country}</span>
            </div>
        </div>
         {seller && (
            <div className="mt-2 text-xs text-muted-foreground">
                {t('sold_by')} <span className="font-semibold text-foreground">{seller.fullName}</span>
                <div className="flex items-center gap-1 mt-1" title={t('rating_system_launching_soon')}>
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                </div>
            </div>
        )}
        <div className="mt-4 flex-grow flex items-end">
            <p className="text-2xl font-extrabold">
                {car.currency} {car.price.toLocaleString()}
            </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onNavigate?.('car-detail', { carId: car.id })} className="w-full">{t('view_details')}</Button>
      </CardFooter>
    </Card>
  );
};
