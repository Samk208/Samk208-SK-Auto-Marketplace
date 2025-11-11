'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export type UploadResult = {
  success: boolean
  error?: string
  url?: string
  publicUrl?: string
}

/**
 * Upload a file to Supabase Storage
 * This should be called after client-side compression with browser-image-compression
 */
export async function uploadCarImage(
  file: File,
  carId: string
): Promise<UploadResult> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to upload images',
      }
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      }
    }

    // Allowed MIME types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `${user.id}/${carId}/${timestamp}-${randomString}.${extension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(filename, file, {
        cacheControl: '31536000', // 1 year
        upsert: false,
      })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('car-images')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: data.path,
      publicUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

/**
 * Upload multiple car images
 */
export async function uploadCarImages(
  files: File[],
  carId: string
): Promise<{ success: boolean; error?: string; urls?: string[] }> {
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: 'No files provided',
      }
    }

    if (files.length > 10) {
      return {
        success: false,
        error: 'Maximum 10 images allowed per listing',
      }
    }

    const uploadPromises = files.map(file => uploadCarImage(file, carId))
    const results = await Promise.all(uploadPromises)

    // Check if all uploads succeeded
    const failed = results.filter(r => !r.success)
    if (failed.length > 0) {
      return {
        success: false,
        error: `Failed to upload ${failed.length} image(s): ${failed[0].error}`,
      }
    }

    const urls = results.map(r => r.publicUrl!).filter(Boolean)

    return {
      success: true,
      urls,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images',
    }
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteCarImage(imagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to delete images',
      }
    }

    // Verify the image belongs to the user
    if (!imagePath.startsWith(user.id)) {
      return {
        success: false,
        error: 'You can only delete your own images',
      }
    }

    const { error } = await supabase.storage
      .from('car-images')
      .remove([imagePath])

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}

/**
 * Delete multiple images
 */
export async function deleteCarImages(imagePaths: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (imagePaths.length === 0) {
      return { success: true }
    }

    const deletePromises = imagePaths.map(path => deleteCarImage(path))
    const results = await Promise.all(deletePromises)

    const failed = results.filter(r => !r.success)
    if (failed.length > 0) {
      return {
        success: false,
        error: `Failed to delete ${failed.length} image(s)`,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete images',
    }
  }
}
