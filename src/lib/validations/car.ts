import { z } from 'zod';

/**
 * Car Listing Validation Schemas
 * 
 * Following PRD requirements:
 * - React Hook Form + Zod for form validation
 * - Type-safe form inputs
 * - Multi-language error messages support
 * 
 * Aligned with database schema (src/types/database.types.ts)
 */

// Specifications sub-schema (JSONB field in database)
export const carSpecificationsSchema = z.object({
  engine: z.string().min(1, 'Engine specification required').max(100).optional(),
  transmission: z.enum(['Automatic', 'Manual']),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']).optional(),
  fuel_type: z.string().optional(), // Alternative field name from DB
  bodyType: z.enum(['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe']).optional(),
  body_type: z.string().optional(), // Alternative field name from DB
  mileage: z.union([
    z.number().positive('Mileage must be positive'),
    z.string().min(1, 'Mileage required'),
  ]).optional(),
  mileage_km: z.number().positive().optional(),
  color: z.string().max(50).optional(),
});

// Main car listing schema
export const carListingSchema = z.object({
  // Required fields
  make: z.string()
    .min(1, 'Make is required')
    .max(50, 'Make too long')
    .trim(),
  
  model: z.string()
    .min(1, 'Model is required')
    .max(50, 'Model too long')
    .trim(),
  
  year: z.number()
    .int('Year must be a whole number')
    .min(1900, 'Year too old')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  
  price: z.number()
    .positive('Price must be positive')
    .max(10000000, 'Price exceeds maximum'),
  
  currency: z.enum(['USD', 'KRW', 'EUR', 'GBP']),
  
  location_city: z.string()
    .min(1, 'City is required')
    .max(100, 'City name too long')
    .trim(),
  
  location_country: z.string()
    .length(2, 'Country code must be 2 characters (e.g., KR, NG)')
    .toUpperCase(),
  
  // Optional description fields (multi-language support)
  description: z.string()
    .min(50, 'Description too short (minimum 50 characters)')
    .max(2000, 'Description too long (maximum 2000 characters)')
    .optional(),
  
  description_en: z.string().max(2000).optional(),
  description_fr: z.string().max(2000).optional(),
  description_sw: z.string().max(2000).optional(),
  
  // Images (array of URLs)
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least 1 image required')
    .max(15, 'Maximum 15 images allowed'),
  
  // Status
  status: z.enum(['draft', 'published', 'sold', 'archived']).default('draft'),
  
  // Optional fields
  featured: z.boolean().default(false),
  shipping_available: z.boolean().default(false),
  ai_generated: z.boolean().default(false),
  
  // Specifications (JSONB)
  specifications: carSpecificationsSchema.optional(),
});

// Update car schema (all fields optional except ID)
export const carUpdateSchema = carListingSchema.partial().extend({
  id: z.string().uuid('Invalid car ID'),
});

// Search/filter schema
export const carSearchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minYear: z.number().int().min(1900).optional(),
  maxYear: z.number().int().max(new Date().getFullYear() + 1).optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  location_country: z.string().length(2).optional(),
  featured: z.boolean().optional(),
  status: z.string().optional(),
});

// Type exports for TypeScript
export type CarListingInput = z.infer<typeof carListingSchema>;
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;
export type CarSearchInput = z.infer<typeof carSearchSchema>;
export type CarSpecifications = z.infer<typeof carSpecificationsSchema>;
