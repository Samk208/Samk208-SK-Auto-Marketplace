'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database.types'

type Favorite = Database['public']['Tables']['favorites']['Row']

export type FavoriteResult = {
  success: boolean
  error?: string
  data?: Favorite
}

export type FavoritesListResult = {
  success: boolean
  error?: string
  data?: Array<Favorite & { car?: any }>
}

/**
 * Add a car to favorites
 */
export async function addFavorite(carId: string): Promise<FavoriteResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to favorite a car',
      }
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single()

    if (existing) {
      return {
        success: false,
        error: 'Car is already in your favorites',
      }
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        car_id: carId,
      } as any)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/favorites')

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add favorite',
    }
  }
}

/**
 * Remove a car from favorites
 */
export async function removeFavorite(carId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to remove a favorite',
      }
    }

    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('car_id', carId)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/favorites')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove favorite',
    }
  }
}

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(carId: string): Promise<{ success: boolean; error?: string; isFavorited: boolean }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to toggle favorite',
        isFavorited: false,
      }
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single()

    if (existing) {
      // Remove favorite
      const result = await removeFavorite(carId)
      return {
        ...result,
        isFavorited: false,
      }
    } else {
      // Add favorite
      const result = await addFavorite(carId)
      return {
        ...result,
        isFavorited: true,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle favorite',
      isFavorited: false,
    }
  }
}

/**
 * Get all favorites for the current user
 */
export async function getFavorites(): Promise<FavoritesListResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view favorites',
      }
    }

    // Get favorites with car details
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        car:cars (
          *,
          profiles:dealer_id (
            id,
            full_name,
            avatar_url,
            seller_rating,
            business_name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch favorites',
    }
  }
}

/**
 * Check if a car is favorited by the current user
 */
export async function isFavorited(carId: string): Promise<{ success: boolean; error?: string; isFavorited: boolean }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: true,
        isFavorited: false,
      }
    }

    // Check if favorited
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single()

    return {
      success: true,
      isFavorited: !!data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check favorite status',
      isFavorited: false,
    }
  }
}

/**
 * Get favorite IDs for the current user (useful for checking multiple cars at once)
 */
export async function getFavoriteIds(): Promise<{ success: boolean; error?: string; ids?: string[] }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: true,
        ids: [],
      }
    }

    // Get favorite car IDs
    const { data, error } = await supabase
      .from('favorites')
      .select('car_id')
      .eq('user_id', user.id)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      ids: data?.map((f: any) => f.car_id) || [],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch favorite IDs',
    }
  }
}
