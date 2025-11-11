'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, toggleFavorite as toggleFavoriteAction, getFavoriteIds } from '@/app/actions/favorites'

/**
 * Hook to manage user favorites with React Query
 */
export function useFavorites() {
  const queryClient = useQueryClient()

  // Fetch all favorites with car details
  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const result = await getFavorites()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data || []
    },
  })

  // Fetch favorite IDs for quick lookups
  const { data: favoriteIdsData } = useQuery({
    queryKey: ['favoriteIds'],
    queryFn: async () => {
      const result = await getFavoriteIds()
      if (!result.success) {
        throw new Error(result.error)
      }
      return new Set(result.ids || [])
    },
  })

  // Toggle favorite mutation with optimistic update
  const toggleMutation = useMutation({
    mutationFn: async (carId: string) => {
      const result = await toggleFavoriteAction(carId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onMutate: async (carId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favoriteIds'] })

      // Snapshot previous value
      const previousIds = queryClient.getQueryData<Set<string>>(['favoriteIds'])

      // Optimistically update
      queryClient.setQueryData<Set<string>>(['favoriteIds'], (old) => {
        const newSet = new Set(old || [])
        if (newSet.has(carId)) {
          newSet.delete(carId)
        } else {
          newSet.add(carId)
        }
        return newSet
      })

      return { previousIds }
    },
    onError: (err, carId, context) => {
      // Rollback on error
      if (context?.previousIds) {
        queryClient.setQueryData(['favoriteIds'], context.previousIds)
      }
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
    },
  })

  const isFavorite = (carId: string) => {
    return favoriteIdsData?.has(carId) ?? false
  }

  const toggleFavorite = (carId: string) => {
    toggleMutation.mutate(carId)
  }

  return {
    favorites: favoritesData || [],
    favoriteIds: favoriteIdsData || new Set<string>(),
    isLoading,
    isFavorite,
    toggleFavorite,
    isToggling: toggleMutation.isPending,
  }
}
