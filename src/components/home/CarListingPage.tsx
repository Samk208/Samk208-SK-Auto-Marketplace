
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CarCard } from '@/components/car/CarCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Label } from '@/components/ui/Label';
import type { Car, User, ToastMessage, NavigateHandler } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';

interface CarListingPageProps {
    cars: Car[];
    sellers: User[];
    onNavigate: NavigateHandler;
    initialSearchTerm?: string;
    showToast: (message: string, type?: ToastMessage['type']) => void;
    currentUser: User | null;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

type RawCarRow = Tables<'cars'> & {
    currency?: string | null;
    description?: string | null;
};

const STATUS_MAP: Record<string, Car['status']> = {
    active: 'Active',
    available: 'available',
    sold: 'sold',
    pending: 'pending',
};

const mapStatus = (status: string | null | undefined): Car['status'] => {
    if (!status) return 'available';
    const normalized = status.toLowerCase();
    return STATUS_MAP[normalized] ?? 'available';
};


export const CarListingPage: React.FC<CarListingPageProps> = ({ cars, sellers, onNavigate, initialSearchTerm = '', showToast, currentUser }) => {
  const supabase = createClient();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [location, setLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [items, setItems] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);
  void cars;

  const locations = useMemo(
    () => ['all', ...Array.from(new Set(items.map(car => `${car.location.city}, ${car.location.country}`)))],
    [items]
  );
  
  const mapDbCar = (c: RawCarRow): Car => ({
    id: c.id,
    make: c.make,
    model: c.model,
    year: Number(c.year),
    price: Number(c.price),
    currency: c.currency ?? 'USD',
    location: {
      city: c.location_city ?? '',
      country: c.location_country ?? '',
    },
    imageUrls: Array.isArray(c.images) ? c.images : [],
    specifications: (typeof c.specifications === 'object' && c.specifications !== null
      ? c.specifications
      : {}) as Car['specifications'],
    description: c.description ?? '',
    status: mapStatus(c.status),
    dealer_id: c.dealer_id,
    created_at: c.created_at ?? undefined,
  });

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('cars')
      .select('*')
      .eq('status', 'available');

    if (searchTerm.trim()) {
      const term = searchTerm.trim();
      query = query.or(`make.ilike.%${term}%,model.ilike.%${term}%`);
    }
    if (location !== 'all' && location.includes(', ')) {
      const [city, country] = location.split(', ').map(s => s.trim());
      if (city) query = query.eq('location_city', city);
      if (country) query = query.eq('location_country', country);
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    query = query.order('created_at', { ascending: false });
    return query;
  }, [searchTerm, location, maxPrice]);

  const fetchPage = useCallback(async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await buildQuery().range(from, to);
      if (error) throw error;
      const mapped = (data || []).map(mapDbCar);
      if (pageIndex === 0) setItems(mapped);
      else setItems(prev => [...prev, ...mapped]);
      setHasMore((data || []).length === pageSize);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to load cars';
      setError(message);
      if (pageIndex === 0) setItems([]);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(0);
    fetchPage(0);
  }, [searchTerm, location, maxPrice, fetchPage]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loading) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) {
        const next = page + 1;
        setPage(next);
        fetchPage(next);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [page, hasMore, loading, fetchPage]);
  
  const resetFilters = () => {
      setSearchTerm('');
      setLocation('all');
      setMaxPrice(100000);
  }
  
  const handleSaveSearch = () => {
    showToast(t('saved_searches_coming_soon'), 'info');
  }

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Our Collection</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">Find the perfect Korean car for your African journey.</p>
        </div>

        <div className="p-6 mb-12 border rounded-lg bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="lg:col-span-2">
                    <Label htmlFor="search">Search by Make or Model</Label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="search"
                            type="text"
                            placeholder="e.g., Hyundai Sonata" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                            <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map(loc => (
                                <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="price">Max Price</Label>
                        <span className="text-sm font-medium text-primary">${maxPrice.toLocaleString()}</span>
                    </div>
                    <Slider 
                        id="price"
                        min={10000} 
                        max={100000} 
                        step={1000}
                        value={[maxPrice]}
                        onValueChange={([val]) => setMaxPrice(val)}
                    />
                </div>
                <div className="col-span-full flex justify-end gap-2">
                     <Button onClick={handleSaveSearch} variant="secondary" outline size="sm" disabled={!currentUser}>
                         <SaveIcon className="h-4 w-4 mr-2" />
                         {t('save_search')}
                     </Button>
                     <Button onClick={resetFilters} variant="ghost" size="sm">
                         <XIcon className="h-4 w-4 mr-2" />
                         Reset Filters
                     </Button>
                </div>
            </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((car) => (
              <CarCard key={car.id} car={car} sellers={sellers} onNavigate={onNavigate} showToast={showToast} currentUser={currentUser} />
            ))}
          </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-xl font-semibold">No cars match your criteria.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find your perfect car.</p>
                <Button onClick={resetFilters} className="mt-4">Clear Filters</Button>
            </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse h-72 bg-muted rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
