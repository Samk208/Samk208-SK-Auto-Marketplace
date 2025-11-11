'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardStats } from '@/components/seller/DashboardStats';
import { ListingsTable } from '@/components/seller/ListingsTable';
import type { Tables } from '@/types/database.types';
import { Button } from '@/components/ui/Button';
import { Plus, User, BarChart3, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

type Profile = Tables<'profiles'>;

interface SellerDashboardClientProps {
  profile: Profile;
}

export const SellerDashboardClient: React.FC<SellerDashboardClientProps> = ({ profile }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleCreateListing = () => {
    // Navigate to create listing page (to be implemented)
    router.push('/seller-dashboard/listings/new');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile.full_name}. Manage your listings and track performance.
            </p>
          </div>
          <Button onClick={handleCreateListing} size="lg" className="sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Listings</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          <ListingsTable onCreateNew={handleCreateListing} />
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <ListingsTable onCreateNew={handleCreateListing} />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information Card */}
            <div className="space-y-4 p-6 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="mt-1">{profile.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1">{profile.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                  <p className="mt-1">{profile.country || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Business Information Card */}
            <div className="space-y-4 p-6 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Business Name
                  </label>
                  <p className="mt-1">{profile.business_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Registration Number
                  </label>
                  <p className="mt-1">{profile.business_registration || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Verification Status
                  </label>
                  <p className="mt-1 capitalize">{profile.verification_status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Seller Rating
                  </label>
                  <p className="mt-1">
                    {profile.seller_rating ? `${profile.seller_rating.toFixed(1)} / 5.0` : 'No ratings yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="default" outline onClick={() => router.push('/profile/edit')}>
              Edit Profile
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
