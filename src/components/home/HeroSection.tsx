 'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onFindCar?: () => void;
  onStartSelling?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onFindCar, onStartSelling }) => {
  const { t } = useTranslation();
  const _onFindCar = onFindCar ?? (() => {});
  const _onStartSelling = onStartSelling ?? (() => {});

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 z-10">
        <img
          src="https://picsum.photos/seed/hero-bg/1920/1080"
          alt="Modern car on a road"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
       <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-transparent z-10"></div>
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-in-down">
          {t('hero_title')}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
          <Link href="/cars">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              {t('get_started')}
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              {t('start_selling')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
