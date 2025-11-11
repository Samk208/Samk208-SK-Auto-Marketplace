/**
 * Supabase Storage Utilities
 * Helper functions for working with Supabase Storage buckets
 */

import { createClient } from './client';

const supabase = createClient();

/**
 * Get public URL for a car image
 * @param path - The storage path (e.g., "user-id/car-id/image.jpg")
 * @returns Public URL for the image
 */
export function getCarImageUrl(path: string): string {
  if (!path) return '';

  const { data } = supabase.storage
    .from('car-images')
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get public URL for a user avatar
 * @param path - The storage path (e.g., "user-id/avatar.jpg")
 * @returns Public URL for the avatar
 */
export function getAvatarUrl(path: string): string {
  if (!path) return '';

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Upload a car image to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user ID (for folder organization)
 * @param carId - The car ID (for folder organization)
 * @returns Object with path and publicUrl, or error
 */
export async function uploadCarImage(
  file: File,
  userId: string,
  carId: string
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  try {
    // Generate unique filename with safe extension handling
    const nameParts = file.name.split('.');
    const fileExt = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : null;
    const fileName = fileExt 
      ? `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      : `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filePath = `${userId}/${carId}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const publicUrl = getCarImageUrl(data.path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return { error: 'Failed to upload image' };
  }
}

/**
 * Upload a user avatar to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user ID (for folder organization)
 * @returns Object with path and publicUrl, or error
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  try {
    // Safe extension extraction with fallback
    const nameParts = file.name.split('.');
    const hasExtension = nameParts.length > 1 && nameParts[nameParts.length - 1];
    
    // Derive extension from file.name or fallback to file.type
    let fileExt = hasExtension ? nameParts.pop()?.toLowerCase() : null;
    
    // If no extension from filename, derive from MIME type
    if (!fileExt && file.type) {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };
      fileExt = mimeToExt[file.type.toLowerCase()] || 'png';
    }
    
    // Final fallback to 'png' if still no extension
    if (!fileExt) {
      fileExt = 'png';
    }
    
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file (upsert to replace existing avatar)
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Replace existing avatar
      });

    if (error) {
      console.error('Avatar upload error:', error);
      return { error: error.message };
    }

    const publicUrl = getAvatarUrl(data.path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    console.error('Avatar upload exception:', error);
    return { error: 'Failed to upload avatar' };
  }
}

/**
 * Delete a car image from Supabase Storage
 * @param path - The storage path to delete
 * @returns Success status or error
 */
export async function deleteCarImage(
  path: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const { error } = await supabase.storage
      .from('car-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exception:', error);
    return { error: 'Failed to delete image' };
  }
}

/**
 * Delete multiple car images from Supabase Storage
 * @param paths - Array of storage paths to delete
 * @returns Success status or error
 */
export async function deleteCarImages(
  paths: string[]
): Promise<{ success: boolean } | { error: string }> {
  try {
    const { error } = await supabase.storage
      .from('car-images')
      .remove(paths);

    if (error) {
      console.error('Bulk delete error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Bulk delete exception:', error);
    return { error: 'Failed to delete images' };
  }
}

/**
 * Get download URL for a car image (for downloading files)
 * @param path - The storage path
 * @returns Download URL or error
 */
export async function getCarImageDownloadUrl(
  path: string
): Promise<{ url: string } | { error: string }> {
  try {
    const { data, error } = await supabase.storage
      .from('car-images')
      .createSignedUrl(path, 60); // 60 seconds expiry

    if (error) {
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    return { error: 'Failed to generate download URL' };
  }
}

/**
 * List all images for a specific car
 * @param userId - The user ID
 * @param carId - The car ID
 * @returns Array of image paths
 */
export async function listCarImages(
  userId: string,
  carId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from('car-images')
      .list(`${userId}/${carId}`);

    if (error) {
      console.error('List images error:', error);
      return [];
    }

    return data.map(file => `${userId}/${carId}/${file.name}`);
  } catch (error) {
    console.error('List images exception:', error);
    return [];
  }
}
