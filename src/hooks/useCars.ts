import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Car } from '@/types/types';
import type { CarListingInput, CarUpdateInput, CarSearchInput } from '@/lib/validations/car';

/**
 * Car Data Fetching Hooks
 * 
 * Following PRD tech stack:
 * - TanStack Query for server state management
 * - Supabase for database queries
 * - Type-safe with database types
 * 
 * Optimized for:
 * - 3G/4G connectivity (caching, stale times)
 * - Mobile-first UX (skeleton screens, optimistic updates)
 * - Real-time updates (query invalidation)
 */

// Query keys for consistent caching
export const carKeys = {
  all: ['cars'] as const,
  lists: () => [...carKeys.all, 'list'] as const,
  list: (filters: CarSearchInput) => [...carKeys.lists(), filters] as const,
  details: () => [...carKeys.all, 'detail'] as const,
  detail: (id: string) => [...carKeys.details(), id] as const,
  featured: () => [...carKeys.all, 'featured'] as const,
  byDealer: (dealerId: string) => [...carKeys.all, 'dealer', dealerId] as const,
};

/**
 * Fetch featured cars for homepage
 *
 * UX: Shows 6 featured vehicles with seller info
 * Performance: Cached for 5 minutes, prefetch on hover
 *
 * NOTE: Uses FK-free pattern (fetch cars and profiles separately)
 * to avoid Supabase FK relationship errors (PGRST200)
 */
export function useFeaturedCars() {
  return useQuery({
    queryKey: carKeys.featured(),
    queryFn: async () => {
      const supabase = createClient();

      // Step 1: Fetch cars without joins
      const { data: carsData, error } = await supabase
        .from('cars')
        .select('*')
        .eq('featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured cars:', error);
        throw new Error('Failed to load featured vehicles');
      }

      if (!carsData || carsData.length === 0) {
        return [];
      }

      // Step 2: Fetch dealer profiles separately
      const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .in('id', dealerIds);

      // Step 3: Create a map for efficient lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Step 4: Merge profiles into cars
      const carsWithDealers = carsData.map(car => ({
        ...car,
        dealer: profilesMap.get(car.dealer_id) || null
      })) as Car[];

      return carsWithDealers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single car details
 *
 * UX: Car detail page with full specifications
 * Performance: Cached per car ID, prefetch from list view
 *
 * NOTE: Uses FK-free pattern (fetch car and profile separately)
 * to avoid Supabase FK relationship errors (PGRST200)
 */
export function useCarDetail(id: string | null) {
  return useQuery({
    queryKey: carKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Car ID required');

      const supabase = createClient();

      // Step 1: Fetch car without joins
      const { data: carData, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching car details:', error);
        throw new Error('Failed to load vehicle details');
      }

      // Step 2: Fetch dealer profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .eq('id', carData.dealer_id)
        .single();

      // Step 3: Merge profile into car
      const carWithDealer = {
        ...carData,
        dealer: profileData || null
      } as Car;

      // Increment view count (fire and forget)
      void supabase
        .from('cars')
        .update({ view_count: (carData.view_count || 0) + 1 })
        .eq('id', id);

      return carWithDealer;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes (car details don't change often)
  });
}

/**
 * Search/filter cars
 *
 * UX: Search page with filters
 * Performance: Debounced queries, cached by filter combination
 *
 * NOTE: Uses FK-free pattern (fetch cars and profiles separately)
 * to avoid Supabase FK relationship errors (PGRST200)
 */
export function useCarSearch(filters: CarSearchInput) {
  return useQuery({
    queryKey: carKeys.list(filters),
    queryFn: async () => {
      const supabase = createClient();

      // Step 1: Fetch cars without joins
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'published');

      // Apply filters
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.minYear) {
        query = query.gte('year', filters.minYear);
      }
      if (filters.maxYear) {
        query = query.lte('year', filters.maxYear);
      }
      if (filters.location_country) {
        query = query.eq('location_country', filters.location_country);
      }
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      const { data: carsData, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching cars:', error);
        throw new Error('Failed to search vehicles');
      }

      if (!carsData || carsData.length === 0) {
        return [];
      }

      // Step 2: Fetch dealer profiles separately
      const dealerIds = [...new Set(carsData.map(car => car.dealer_id))];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, seller_rating, verification_status')
        .in('id', dealerIds);

      // Step 3: Create a map for efficient lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Step 4: Merge profiles into cars
      const carsWithDealers = carsData.map(car => ({
        ...car,
        dealer: profilesMap.get(car.dealer_id) || null
      })) as Car[];

      return carsWithDealers;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (search results can change)
  });
}

/**
 * Fetch cars by dealer
 * 
 * UX: Seller dashboard, seller profile page
 */
export function useCarsByDealer(dealerId: string | null) {
  return useQuery({
    queryKey: carKeys.byDealer(dealerId || ''),
    queryFn: async () => {
      if (!dealerId) throw new Error('Dealer ID required');
      
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching dealer cars:', error);
        throw new Error('Failed to load dealer vehicles');
      }
      
      return (data || []) as Car[];
    },
    enabled: !!dealerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create new car listing
 * 
 * UX: Seller creates listing, optimistic update
 */
export function useCreateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: Omit<CarListingInput, 'id'>) => {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('cars')
        .insert([{
          ...input,
          dealer_id: user.id,
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating car:', error);
        throw new Error('Failed to create listing');
      }
      
      return data as Car;
    },
    onSuccess: (newCar) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
      queryClient.invalidateQueries({ queryKey: carKeys.byDealer(newCar.dealer_id) });
      
      // Optionally add to featured if applicable
      if (newCar.featured) {
        queryClient.invalidateQueries({ queryKey: carKeys.featured() });
      }
    },
  });
}

/**
 * Update existing car listing
 * 
 * UX: Seller edits listing, optimistic update
 */
export function useUpdateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CarUpdateInput) => {
      const supabase = createClient();
      
      const { id, ...updates } = input;
      
      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating car:', error);
        throw new Error('Failed to update listing');
      }
      
      return data as Car;
    },
    onSuccess: (updatedCar) => {
      // Update cache immediately
      queryClient.setQueryData(carKeys.detail(updatedCar.id), updatedCar);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
      queryClient.invalidateQueries({ queryKey: carKeys.byDealer(updatedCar.dealer_id) });
      
      if (updatedCar.featured) {
        queryClient.invalidateQueries({ queryKey: carKeys.featured() });
      }
    },
  });
}

/**
 * Delete car listing
 * 
 * UX: Seller removes listing, optimistic update
 */
export function useDeleteCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting car:', error);
        throw new Error('Failed to delete listing');
      }
      
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: carKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
      queryClient.invalidateQueries({ queryKey: carKeys.featured() });
    },
  });
}
