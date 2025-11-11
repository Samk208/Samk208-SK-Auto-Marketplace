'use server';

import { createClient } from '@/lib/supabase';
import type { Inserts, Updates } from '@/types/database.types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema for car creation/update
const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().nonnegative('Mileage must be non-negative'),
  fuel_type: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  location_city: z.string().min(1, 'Location city is required'),
  location_country: z.string().min(1, 'Location country is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  description_en: z.string().optional().nullable(),
  description_ko: z.string().optional().nullable(),
  description_fr: z.string().optional().nullable(),
  description_sw: z.string().optional().nullable(),
  specifications: z.record(z.string(), z.any()).optional().nullable(),
  status: z.enum(['draft', 'published', 'sold', 'archived']).default('draft'),
  shipping_available: z.boolean().default(false),
});

type CarFormData = z.infer<typeof carSchema>;

/**
 * Fetches all listings for the authenticated seller
 */
export async function getSellerListings() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Fetch cars where dealer_id matches user id
  const { data: cars, error } = await supabase
    .from('cars')
    .select(
      `
      *,
      dealer:profiles!dealer_id (
        id,
        full_name,
        avatar_url,
        seller_rating,
        verification_status
      )
    `
    )
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seller listings:', error);
    return { data: null, error: error.message };
  }

  return { data: cars, error: null };
}

/**
 * Fetches a single car listing by ID (only if owned by authenticated seller)
 */
export async function getSellerListingById(carId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  const { data: car, error } = await supabase
    .from('cars')
    .select(
      `
      *,
      dealer:profiles!dealer_id (
        id,
        full_name,
        avatar_url,
        seller_rating,
        verification_status
      )
    `
    )
    .eq('id', carId)
    .eq('dealer_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    return { data: null, error: error.message };
  }

  return { data: car, error: null };
}

/**
 * Creates a new car listing
 */
export async function createCarListing(formData: CarFormData) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Validate form data
  const validationResult = carSchema.safeParse(formData);
  if (!validationResult.success) {
    return {
      data: null,
      error: validationResult.error.issues.map((e) => e.message).join(', '),
    };
  }

  const carData: Inserts<'cars'> = {
    ...validationResult.data,
    specifications: validationResult.data.specifications as any,
    dealer_id: user.id,
    view_count: 0,
    inquiry_count: 0,
    featured: false,
    ai_generated: false,
  };

  const { data: car, error } = await supabase
    .from('cars')
    .insert(carData)
    .select()
    .single();

  if (error) {
    console.error('Error creating car listing:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/seller-dashboard');
  revalidatePath('/cars');

  return { data: car, error: null };
}

/**
 * Updates an existing car listing
 */
export async function updateCarListing(carId: string, formData: Partial<CarFormData>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingCar, error: fetchError } = await supabase
    .from('cars')
    .select('dealer_id')
    .eq('id', carId)
    .single();

  if (fetchError || !existingCar) {
    return { data: null, error: 'Car not found' };
  }

  if (existingCar.dealer_id !== user.id) {
    return { data: null, error: 'Forbidden - You can only edit your own listings' };
  }

  // Validate partial data
  const partialSchema = carSchema.partial();
  const validationResult = partialSchema.safeParse(formData);
  if (!validationResult.success) {
    return {
      data: null,
      error: validationResult.error.issues.map((e) => e.message).join(', '),
    };
  }

  const updateData: Updates<'cars'> = {
    ...validationResult.data,
    specifications: validationResult.data.specifications as any,
    updated_at: new Date().toISOString(),
  };

  const { data: car, error } = await supabase
    .from('cars')
    .update(updateData)
    .eq('id', carId)
    .select()
    .single();

  if (error) {
    console.error('Error updating car listing:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/seller-dashboard');
  revalidatePath(`/cars/${carId}`);
  revalidatePath('/cars');

  return { data: car, error: null };
}

/**
 * Deletes a car listing
 */
export async function deleteCarListing(carId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingCar, error: fetchError } = await supabase
    .from('cars')
    .select('dealer_id')
    .eq('id', carId)
    .single();

  if (fetchError || !existingCar) {
    return { success: false, error: 'Car not found' };
  }

  if (existingCar.dealer_id !== user.id) {
    return { success: false, error: 'Forbidden - You can only delete your own listings' };
  }

  const { error } = await supabase.from('cars').delete().eq('id', carId);

  if (error) {
    console.error('Error deleting car listing:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/seller-dashboard');
  revalidatePath('/cars');

  return { success: true, error: null };
}

/**
 * Toggles the published/draft status of a listing
 */
export async function toggleListingStatus(carId: string, newStatus: 'draft' | 'published') {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingCar, error: fetchError } = await supabase
    .from('cars')
    .select('dealer_id')
    .eq('id', carId)
    .single();

  if (fetchError || !existingCar) {
    return { data: null, error: 'Car not found' };
  }

  if (existingCar.dealer_id !== user.id) {
    return { data: null, error: 'Forbidden - You can only edit your own listings' };
  }

  const { data: car, error } = await supabase
    .from('cars')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', carId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling listing status:', error);
    return { data: null, error: error.message };
  }

  revalidatePath('/seller-dashboard');
  revalidatePath(`/cars/${carId}`);
  revalidatePath('/cars');

  return { data: car, error: null };
}

/**
 * Fetches dashboard statistics for the authenticated seller
 */
export async function getSellerDashboardStats() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Get all seller's cars for aggregation
  const { data: cars, error } = await supabase
    .from('cars')
    .select('status, view_count, inquiry_count')
    .eq('dealer_id', user.id);

  if (error) {
    console.error('Error fetching stats:', error);
    return { data: null, error: error.message };
  }

  // Calculate statistics
  const stats = {
    total_listings: cars.length,
    active_listings: cars.filter((car) => car.status === 'published').length,
    draft_listings: cars.filter((car) => car.status === 'draft').length,
    sold_listings: cars.filter((car) => car.status === 'sold').length,
    total_views: cars.reduce((sum, car) => sum + (car.view_count || 0), 0),
    total_inquiries: cars.reduce((sum, car) => sum + (car.inquiry_count || 0), 0),
  };

  return { data: stats, error: null };
}

/**
 * Increment the view count for a specific car
 * Uses Supabase's increment_car_views RPC function
 */
export async function incrementCarViews(carId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Call the Supabase RPC function to increment views
    const { error } = await supabase.rpc('increment_car_views', {
      car_id: carId,
    });

    if (error) {
      console.error('Error incrementing car views:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the car detail page to show updated view count
    revalidatePath(`/cars/${carId}`);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error incrementing car views:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Toggle favorite status for a car
 * Adds or removes the car from the user's favorites
 */
export async function toggleFavorite(carId: string): Promise<{
  success: boolean;
  isFavorited: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        isFavorited: false,
        error: 'You must be logged in to favorite cars',
      };
    }

    // Check if car is already favorited
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('car_id', carId)
      .single();

    if (existingFavorite) {
      // Remove from favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);

      if (deleteError) {
        console.error('Error removing favorite:', deleteError);
        return { success: false, isFavorited: true, error: deleteError.message };
      }

      // Revalidate favorites page
      revalidatePath('/favorites');

      return { success: true, isFavorited: false };
    } else {
      // Add to favorites
      const { error: insertError } = await supabase.from('favorites').insert({
        user_id: user.id,
        car_id: carId,
      });

      if (insertError) {
        console.error('Error adding favorite:', insertError);
        return { success: false, isFavorited: false, error: insertError.message };
      }

      // Revalidate favorites page
      revalidatePath('/favorites');

      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error('Unexpected error toggling favorite:', error);
    return {
      success: false,
      isFavorited: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
