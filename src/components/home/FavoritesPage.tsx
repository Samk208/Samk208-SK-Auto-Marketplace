
import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import type { Car, Page, User, ToastMessage } from '@/types/types';
import { useTranslation } from '@/hooks/useTranslation';
import { CarCard } from '../car/CarCard';
import { Button } from '../ui/Button';

interface FavoritesPageProps {
  allCars: Car[];
  sellers: User[];
  onNavigate: (page: Page, context?: any) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  currentUser: User | null;
}

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);


export const FavoritesPage: React.FC<FavoritesPageProps> = ({ allCars, sellers, onNavigate, showToast, currentUser }) => {
  const { t } = useTranslation();
  const { favoriteIds } = useFavorites();
  const favoritedCars = allCars.filter(car => favoriteIds.has(car.id));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('my_favorites')}</h1>
      </div>

      {favoritedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoritedCars.map((car) => (
            <CarCard key={car.id} car={car} sellers={sellers} onNavigate={onNavigate} showToast={showToast} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/40 rounded-lg">
            <HeartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
            <h2 className="mt-6 text-xl font-semibold">{t('no_favorites_title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('no_favorites_desc')}</p>
            <Button className="mt-6" onClick={() => onNavigate('cars')}>{t('browse_cars')}</Button>
        </div>
      )}
    </div>
  );
};
