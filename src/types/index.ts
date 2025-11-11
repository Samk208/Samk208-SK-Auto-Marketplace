/**
 * Central type definitions for SK AutoSphere
 */
import type { Database } from './database.types'

// Database table types
export type Car = Database['public']['Tables']['cars']['Row']
export type CarInsert = Database['public']['Tables']['cars']['Insert']
export type CarUpdate = Database['public']['Tables']['cars']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']

// Extended types with relations
export type CarWithSeller = Car & {
  profiles: Profile | null
}

export type FavoriteWithCar = Favorite & {
  car: CarWithSeller | null
}

// UI Component types
export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role?: 'buyer' | 'seller' | 'admin'
}

export type CarFilterParams = {
  make?: string
  model?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  status?: 'draft' | 'published' | 'sold' | 'archived'
  featured?: boolean
  limit?: number
  offset?: number
}

export type LanguageCode = 'en' | 'ko' | 'fr' | 'sw'

export type TranslationKey = string

// Search and filter types
export type SearchFilters = {
  query?: string
  make?: string
  model?: string
  yearRange?: [number, number]
  priceRange?: [number, number]
  location?: string
}

// Re-export Database type
export type { Database }
