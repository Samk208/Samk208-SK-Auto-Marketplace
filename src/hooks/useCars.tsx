'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCars,
  getCarById,
  getFeaturedCars,
  getSellerCars,
  createCar,
  updateCar,
  deleteCar,
  updateCarStatus,
} from '@/app/actions/cars'
import type { CarFormData } from '@/app/actions/cars'

/**
 * Hook to fetch all cars with optional filters
 */
export function useCarListings(filters?: {
  make?: string
  model?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  status?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      const result = await getCars(filters)
      if (!result.success) {
        throw new Error(result.error)
      }
      return {
        cars: result.data || [],
        count: result.count || 0,
      }
    },
  })
}

/**
 * Hook to fetch a single car by ID
 */
export function useCarDetail(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const result = await getCarById(id)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: !!id, // Only fetch if ID is provided
  })
}

/**
 * Hook to fetch featured cars
 */
export function useFeaturedCars(limit: number = 6) {
  return useQuery({
    queryKey: ['cars', 'featured', limit],
    queryFn: async () => {
      const result = await getFeaturedCars(limit)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data || []
    },
  })
}

/**
 * Hook to fetch seller's own cars (for dashboard)
 */
export function useSellerCars() {
  return useQuery({
    queryKey: ['seller', 'cars'],
    queryFn: async () => {
      const result = await getSellerCars()
      if (!result.success) {
        throw new Error(result.error)
      }
      return {
        cars: result.data || [],
        count: result.count || 0,
      }
    },
  })
}

/**
 * Hook to create a new car listing
 */
export function useCreateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'cars'] })
    },
  })
}

/**
 * Hook to update an existing car listing
 */
export function useUpdateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CarFormData> }) =>
      updateCar(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['car', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'cars'] })
    },
  })
}

/**
 * Hook to delete a car listing
 */
export function useDeleteCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'cars'] })
    },
  })
}

/**
 * Hook to update car status
 */
export function useUpdateCarStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'draft' | 'published' | 'sold' | 'archived'
    }) => updateCarStatus(id, status),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['car', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'cars'] })
    },
  })
}
