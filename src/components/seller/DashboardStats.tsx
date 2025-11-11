'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSellerDashboardStats } from '@/hooks/use-seller-listings';
import { BarChart3, Eye, FileText, MessageSquare, Package, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <TrendingUp
              className={`h-3 w-3 mr-1 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
              }`}
            />
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
};

export const DashboardStats: React.FC = () => {
  const { data: stats, isLoading, isError, error } = useSellerDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <BarChart3 className="h-5 w-5" />
            <p>Failed to load statistics: {error?.message || 'Unknown error'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Listings"
        value={stats.total_listings}
        icon={<FileText className="h-4 w-4" />}
        description="All your car listings"
      />
      <StatCard
        title="Active Listings"
        value={stats.active_listings}
        icon={<Package className="h-4 w-4" />}
        description="Currently published"
      />
      <StatCard
        title="Draft Listings"
        value={stats.draft_listings}
        icon={<FileText className="h-4 w-4" />}
        description="Not yet published"
      />
      <StatCard
        title="Total Views"
        value={stats.total_views.toLocaleString()}
        icon={<Eye className="h-4 w-4" />}
        description="Across all listings"
      />
      <StatCard
        title="Total Inquiries"
        value={stats.total_inquiries.toLocaleString()}
        icon={<MessageSquare className="h-4 w-4" />}
        description="Buyer messages received"
      />
      <StatCard
        title="Sold Listings"
        value={stats.sold_listings}
        icon={<BarChart3 className="h-4 w-4" />}
        description="Successfully sold"
      />
    </div>
  );
};
