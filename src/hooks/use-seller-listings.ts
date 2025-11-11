'use client';

import {
    createCarListing,
    deleteCarListing,
    getSellerDashboardStats,
    getSellerListingById,
    getSellerListings,
    toggleListingStatus,
    updateCarListing,
} from '@/app/actions/cars';
import type { Tables } from '@/types/database.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys for cache management
export const sellerListingsKeys = {
  all: ['seller-listings'] as const,
  lists: () => [...sellerListingsKeys.all, 'list'] as const,
  list: () => [...sellerListingsKeys.lists()] as const,
  details: () => [...sellerListingsKeys.all, 'detail'] as const,
  detail: (id: string) => [...sellerListingsKeys.details(), id] as const,
  stats: () => [...sellerListingsKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch all seller listings
 */
export function useSellerListings() {
  return useQuery({
    queryKey: sellerListingsKeys.list(),
    queryFn: async () => {
      const result = await getSellerListings();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a single seller listing by ID
 */
export function useSellerListing(carId: string | null) {
  return useQuery({
    queryKey: sellerListingsKeys.detail(carId || ''),
    queryFn: async () => {
      if (!carId) return null;
      const result = await getSellerListingById(carId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!carId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch seller dashboard statistics
 */
export function useSellerDashboardStats() {
  return useQuery({
    queryKey: sellerListingsKeys.stats(),
    queryFn: async () => {
      const result = await getSellerDashboardStats();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to create a new car listing
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Parameters<typeof createCarListing>[0]) => {
      const result = await createCarListing(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch listings
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.stats() });
    },
  });
}

/**
 * Hook to update an existing car listing
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      carId,
      formData,
    }: {
      carId: string;
      formData: Parameters<typeof updateCarListing>[1];
    }) => {
      const result = await updateCarListing(carId, formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific listing and list
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.detail(variables.carId) });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.stats() });
    },
  });
}

/**
 * Hook to delete a car listing
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: string) => {
      const result = await deleteCarListing(carId);
      if (!result.success || result.error) {
        throw new Error(result.error || 'Failed to delete listing');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate listings after deletion
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.stats() });
    },
  });
}

/**
 * Hook to toggle listing status (draft/published)
 */
export function useToggleListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      carId,
      newStatus,
    }: {
      carId: string;
      newStatus: 'draft' | 'published';
    }) => {
      const result = await toggleListingStatus(carId, newStatus);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async ({ carId, newStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: sellerListingsKeys.detail(carId) });
      await queryClient.cancelQueries({ queryKey: sellerListingsKeys.lists() });

      // Snapshot previous values
      const previousListing = queryClient.getQueryData(sellerListingsKeys.detail(carId));
      const previousListings = queryClient.getQueryData(sellerListingsKeys.lists());

      // Optimistically update cache
      queryClient.setQueryData(sellerListingsKeys.detail(carId), (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...old, status: newStatus };
      });

      queryClient.setQueryData(sellerListingsKeys.lists(), (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((car: Tables<'cars'>) =>
          car.id === carId ? { ...car, status: newStatus } : car
        );
      });

      return { previousListing, previousListings };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousListing) {
        queryClient.setQueryData(sellerListingsKeys.detail(variables.carId), context.previousListing);
      }
      if (context?.previousListings) {
        queryClient.setQueryData(sellerListingsKeys.lists(), context.previousListings);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.detail(variables.carId) });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerListingsKeys.stats() });
    },
  });
}
