
 'use client';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFeaturedCars } from '@/hooks/useCars';
import { CarCard } from '@/components/car/CarCard';
import { CarCardSkeletonGrid } from '@/components/car/CarCardSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Page, User, ToastMessage } from '@/types/types';

interface FeaturedCarsProps {
    onNavigate?: (page: Page, context?: any) => void;
    showToast?: (message: string, type?: ToastMessage['type']) => void;
    currentUser?: User | null;
}

export const FeaturedCars: React.FC<FeaturedCarsProps> = ({ onNavigate, showToast, currentUser }) => {
  const { t } = useTranslation();
  const { data: cars, isLoading, error, refetch } = useFeaturedCars();
  const _onNavigate: (page: Page, context?: any) => void = onNavigate ?? (() => {});
  const _showToast: (message: string, type?: ToastMessage['type']) => void = showToast ?? (() => {});
  const _currentUser: User | null = currentUser ?? null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('featured_cars')}
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && <CarCardSkeletonGrid count={4} />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            title={t('error_loading_cars') || 'Error Loading Cars'}
            message={error instanceof Error ? error.message : t('error_try_again') || 'Please try again later.'}
            onRetry={() => refetch()}
            showHomeButton={false}
          />
        )}

        {/* Success State - Cars Grid */}
        {!isLoading && !error && cars && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.slice(0, 4).map((car) => (
              <CarCard
                key={car.id}
                car={car}
                sellers={[]}
                onNavigate={_onNavigate}
                showToast={_showToast}
                currentUser={_currentUser}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!cars || cars.length === 0) && (
          <div className="col-span-full text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('no_featured_cars_title') || 'No Featured Cars Yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('no_featured_cars_message') || 'Check back soon for our latest featured vehicles.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

