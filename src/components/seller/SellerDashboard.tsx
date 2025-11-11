
'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Car, ToastMessage, User, NavigateHandler } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AnalyticsTab } from './AnalyticsTab';
import { MyListingsTab } from './MyListingsTab';
import { ProfileTab } from './ProfileTab';

interface SellerDashboardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: NavigateHandler;
  cars: Car[];
  onDeleteCar: (carId: string) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onUpdateUser, onNavigate, cars, onDeleteCar, showToast }) => {
  const { t } = useTranslation();
  const sellerListings = cars.filter(car => car.dealer_id === user.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('seller_dashboard')}</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.fullName}. Manage your listings and view your performance.
        </p>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="listings">{t('my_listings')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
        </TabsList>
        <TabsContent value="listings">
          <MyListingsTab
            listings={sellerListings}
            onNavigate={onNavigate}
            onDeleteCar={onDeleteCar}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab user={user} onUpdateUser={onUpdateUser} showToast={showToast}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};
