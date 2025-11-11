'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Database } from '@/types/database.types'

type Car = Database['public']['Tables']['cars']['Row']
type CarInsert = Database['public']['Tables']['cars']['Insert']
type CarUpdate = Database['public']['Tables']['cars']['Update']

// Validation schema for car creation/update
const CarSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1990).max(2030, 'Invalid year'),
  price: z.number().positive('Price must be positive'),
  currency: z.enum(['USD', 'KRW', 'EUR'], 'Invalid currency').default('USD'),
  description: z.string().optional(),
  description_en: z.string().optional(),
  description_fr: z.string().optional(),
  description_sw: z.string().optional(),
  location_country: z.string().min(1, 'Country is required'),
  location_city: z.string().min(1, 'City is required'),
  images: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'sold', 'archived']).default('draft'),
  specifications: z.record(z.any()).optional(),
  featured: z.boolean().default(false),
  shipping_available: z.boolean().default(true),
  ai_generated: z.boolean().default(false),
})

export type CarFormData = z.infer<typeof CarSchema>

export type CarResult = {
  success: boolean
  error?: string
  data?: Car
}

export type CarsListResult = {
  success: boolean
  error?: string
  data?: Car[]
  count?: number
}

/**
 * Create a new car listing
 */
export async function createCar(formData: CarFormData): Promise<CarResult> {
  try {
    const validated = CarSchema.parse(formData)

    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to create a listing',
      }
    }

    // Verify user is a seller
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if ((profile as any)?.role !== 'seller') {
      return {
        success: false,
        error: 'Only sellers can create listings',
      }
    }

    // Insert car listing
    const { data: car, error } = await supabase
      .from('cars')
      .insert({
        ...validated,
        dealer_id: user.id,
      } as any)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/dashboard/listings')
    revalidatePath('/cars')

    return {
      success: true,
      data: car,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create listing',
    }
  }
}

/**
 * Update an existing car listing
 */
export async function updateCar(id: string, formData: Partial<CarFormData>): Promise<CarResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to update a listing',
      }
    }

    // Verify ownership
    const { data: existingCar } = await supabase
      .from('cars')
      .select('dealer_id')
      .eq('id', id)
      .single()

    if (!existingCar || (existingCar as any).dealer_id !== user.id) {
      return {
        success: false,
        error: 'You can only update your own listings',
      }
    }

    // Update car listing
    const { data: car, error } = await supabase
      .from('cars')
      .update(formData as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/dashboard/listings')
    revalidatePath('/cars')
    revalidatePath(`/cars/${id}`)

    return {
      success: true,
      data: car,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update listing',
    }
  }
}

/**
 * Delete a car listing
 */
export async function deleteCar(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to delete a listing',
      }
    }

    // Verify ownership
    const { data: existingCar } = await supabase
      .from('cars')
      .select('dealer_id')
      .eq('id', id)
      .single()

    if (!existingCar || (existingCar as any).dealer_id !== user.id) {
      return {
        success: false,
        error: 'You can only delete your own listings',
      }
    }

    // Delete car listing
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath('/dashboard/listings')
    revalidatePath('/cars')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete listing',
    }
  }
}

/**
 * Get all cars with optional filters
 */
export async function getCars(filters?: {
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
}): Promise<CarsListResult> {
  try {
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('cars')
      .select(`
        *,
        profiles:dealer_id (
          id,
          full_name,
          avatar_url,
          seller_rating,
          business_name,
          verification_status
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters?.make) {
      query = query.ilike('make', `%${filters.make}%`)
    }
    if (filters?.model) {
      query = query.ilike('model', `%${filters.model}%`)
    }
    if (filters?.minYear) {
      query = query.gte('year', filters.minYear)
    }
    if (filters?.maxYear) {
      query = query.lte('year', filters.maxYear)
    }
    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    } else {
      // By default, only show published cars for public
      query = query.eq('status', 'published')
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    // Pagination
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cars',
    }
  }
}

/**
 * Get a single car by ID
 */
export async function getCarById(id: string): Promise<CarResult> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: car, error } = await supabase
      .from('cars')
      .select(`
        *,
        profiles:dealer_id (
          id,
          full_name,
          avatar_url,
          seller_rating,
          business_name,
          verification_status,
          phone_number
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Increment view count
    await (supabase as any).rpc('increment_car_views', { car_id: id })

    return {
      success: true,
      data: car,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch car',
    }
  }
}

/**
 * Get featured cars for homepage
 */
export async function getFeaturedCars(limit: number = 6): Promise<CarsListResult> {
  return getCars({
    featured: true,
    status: 'published',
    limit,
  })
}

/**
 * Get cars by seller (for seller dashboard)
 */
export async function getSellerCars(): Promise<CarsListResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in',
      }
    }

    const { data, error, count } = await supabase
      .from('cars')
      .select('*', { count: 'exact' })
      .eq('dealer_id', user.id)
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
      count: count || 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch your cars',
    }
  }
}

/**
 * Update car status (publish, archive, mark as sold)
 */
export async function updateCarStatus(
  id: string,
  status: 'draft' | 'published' | 'sold' | 'archived'
): Promise<CarResult> {
  return updateCar(id, { status })
}
