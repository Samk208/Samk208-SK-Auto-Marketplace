'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Page, ToastMessage } from '@/types/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { useSellerCars } from '@/hooks/useCars';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { MyListingsTab } from './MyListingsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ProfileTab } from './ProfileTab';

interface SellerDashboardProps {
  onNavigate?: (page: Page, context?: any) => void;
  showToast?: (message: string, type?: ToastMessage['type']) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigate, showToast }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { data: sellerCarsData, isLoading: carsLoading } = useSellerCars();

  // Redirect if not authenticated or not a seller
  React.useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'seller')) {
      router.push('/');
    }
  }, [user, profile, authLoading, router]);

  if (authLoading || carsLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const sellerListings = sellerCarsData?.cars || [];
  const displayName = profile.full_name || user.email || 'Seller';

  // Convert profile to User type for legacy components
  const userForLegacyComponents = {
    id: user.id,
    email: user.email || '',
    fullName: profile.full_name || user.email || '',
    avatarUrl: profile.avatar_url,
    role: (profile.role as 'buyer' | 'seller') || 'seller',
    phone: profile.phone_number,
    location: profile.country,
    businessDescription: profile.business_description,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('seller_dashboard')}</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {displayName}. Manage your listings and view your performance.
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
            showToast={showToast}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab
            user={userForLegacyComponents}
            onUpdateUser={() => {}}
            showToast={showToast}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
