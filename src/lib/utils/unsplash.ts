/**
 * Unsplash Image Utilities
 *
 * Provides high-quality placeholder images from Unsplash API
 * Used for development and as fallback for missing car images
 */

interface UnsplashImageOptions {
  width?: number;
  height?: number;
  query?: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

/**
 * Get a random photo URL from Unsplash
 *
 * @param options - Image configuration options
 * @returns URL string for the Unsplash image
 *
 * @example
 * ```typescript
 * // Get a random car image
 * const carImage = getUnsplashImage({ query: 'car', width: 800, height: 600 });
 *
 * // Get a Korean car image
 * const hyundaiImage = getUnsplashImage({ query: 'hyundai car' });
 * ```
 */
export function getUnsplashImage(options: UnsplashImageOptions = {}): string {
  const {
    width = 800,
    height = 600,
    query = 'car',
    orientation = 'landscape',
  } = options;

  // Note: source.unsplash.com is deprecated. This is a fallback implementation.
  // For production, consider using the official Unsplash API with authentication.
  const baseUrl = 'https://source.unsplash.com';
  const params = new URLSearchParams();

  if (query) {
    params.append('q', query);
  }

  if (orientation) {
    params.append('orientation', orientation);
  }

  return `${baseUrl}/${width}x${height}/?${params.toString()}`;
}

/**
 * Simple string hash function for deterministic seeds
 * @param str - String to hash
 * @returns Numeric hash
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get multiple car images for a listing
 *
 * @param carMake - Make of the car (e.g., 'Hyundai', 'Kia')
 * @param carModel - Model of the car (e.g., 'Sonata', 'Sportage')
 * @param count - Number of images to generate (default: 6)
 * @returns Array of image URLs
 *
 * @example
 * ```typescript
 * const images = getCarImages('Hyundai', 'Sonata', 8);
 * // Returns 8 different Hyundai Sonata images
 * ```
 */
export function getCarImages(
  carMake: string,
  carModel: string,
  count: number = 6
): string[] {
  const images: string[] = [];
  const query = `${carMake} ${carModel}`;

  for (let i = 0; i < count; i++) {
    // Use deterministic seed based on car make, model, and index
    const seed = simpleHash(`${carMake}-${carModel}-${i}`);
    images.push(
      getUnsplashImage({
        query,
        width: 1200,
        height: 800,
      }) + `&sig=${seed}`
    );
  }

  return images;
}

/**
 * Get Korean car brand images
 * Specifically for Korean automotive brands (Hyundai, Kia, Genesis)
 */
export function getKoreanCarImage(
  brand: 'Hyundai' | 'Kia' | 'Genesis',
  model?: string
): string {
  const query = model ? `${brand} ${model}` : `${brand} car`;

  return getUnsplashImage({
    query,
    width: 1200,
    height: 800,
    orientation: 'landscape',
  });
}

/**
 * Get avatar/profile image from Unsplash
 *
 * @param seed - Unique identifier to ensure consistent image for same user
 * @returns URL string for avatar image
 */
export function getAvatarImage(seed: string): string {
  return `https://source.unsplash.com/200x200/?portrait&sig=${seed}`;
}

/**
 * Popular car models for Korean brands
 * Used for generating realistic test data
 */
export const KOREAN_CAR_MODELS = {
  Hyundai: [
    'Sonata',
    'Elantra',
    'Tucson',
    'Santa Fe',
    'Palisade',
    'Kona',
    'Venue',
    'Ioniq 5',
    'Ioniq 6',
    'Grandeur',
  ],
  Kia: [
    'Sportage',
    'Sorento',
    'Telluride',
    'Seltos',
    'Soul',
    'Forte',
    'K5',
    'Carnival',
    'EV6',
    'Niro',
  ],
  Genesis: [
    'G70',
    'G80',
    'G90',
    'GV60',
    'GV70',
    'GV80',
  ],
} as const;

/**
 * Get a random Korean car model
 */
export function getRandomKoreanCar(): {
  make: keyof typeof KOREAN_CAR_MODELS;
  model: string;
} {
  const makes = Object.keys(KOREAN_CAR_MODELS) as Array<keyof typeof KOREAN_CAR_MODELS>;
  const randomMake = makes[Math.floor(Math.random() * makes.length)];
  const models = KOREAN_CAR_MODELS[randomMake];
  const randomModel = models[Math.floor(Math.random() * models.length)];

  return {
    make: randomMake,
    model: randomModel,
  };
}

/**
 * Optimize Unsplash image URL with specific parameters
 * Useful for responsive images and performance optimization
 *
 * @param url - Base Unsplash URL
 * @param options - Optimization options
 * @returns Optimized URL
 */
export function optimizeUnsplashUrl(
  url: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'jpg' | 'webp' | 'auto';
  } = {}
): string {
  const { width, quality = 80, format = 'auto' } = options;

  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  params.append('q', quality.toString());
  params.append('fm', format);

  // Merge new params with existing ones using URL API
  const urlObj = new URL(url);
  
  params.forEach((value, key) => {
    urlObj.searchParams.set(key, value);
  });

  return urlObj.toString();
}
