
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Car, User, ToastMessage, NavigateHandler } from '@/types';

interface AIRecommendationsProps {
  cars: Car[];
  sellers: User[];
  onNavigate: NavigateHandler;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  currentUser: User | null;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9a6 6 0 0 0-9-9Z"/><path d="M5 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/><path d="M19 15a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/></svg>
);


export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ cars, sellers, onNavigate, showToast, currentUser }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  void cars;
  void sellers;
  void onNavigate;
  void showToast;
  void currentUser;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const SkeletonCard = () => (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );

  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('ai_recommendations')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <div className="col-span-full text-center p-12 bg-background rounded-lg shadow-sm">
                <SparklesIcon className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 font-semibold text-lg">{t('ai_recs_coming_soon')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
