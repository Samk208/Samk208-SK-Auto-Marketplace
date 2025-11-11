
'use client';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CarCard } from '@/components/car/CarCard';
import type { Car, User, ToastMessage, NavigateHandler } from '@/types';

interface FeaturedCarsProps {
    cars?: Car[];
    sellers?: User[];
    onNavigate?: NavigateHandler;
    showToast?: (message: string, type?: ToastMessage['type']) => void;
    currentUser?: User | null;
}

export const FeaturedCars: React.FC<FeaturedCarsProps> = ({ cars = [], sellers = [], onNavigate, showToast, currentUser }) => {
  const { t } = useTranslation();
  const noopNavigate: NavigateHandler = () => {};
  const noopToast: (message: string, type?: ToastMessage['type']) => void = () => {};
  const _onNavigate = onNavigate ?? noopNavigate;
  const _showToast = showToast ?? noopToast;
  const _currentUser: User | null = currentUser ?? null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('featured_cars')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(cars || []).slice(0, 4).map((car) => (
            <CarCard
              key={car.id}
              car={car}
              sellers={sellers}
              onNavigate={_onNavigate}
              showToast={_showToast}
              currentUser={_currentUser}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

