// Database types - To be generated from Supabase
// Run: npx supabase gen types typescript --local > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
          role: 'buyer' | 'seller' | 'admin' | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          role?: 'buyer' | 'seller' | 'admin' | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          role?: 'buyer' | 'seller' | 'admin' | null
        }
      }
      cars: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          price: number
          currency: string
          description: string | null
          location_country: string
          location_city: string
          images: string[]
          status: 'draft' | 'published' | 'sold' | 'archived'
          specifications: Json | null
          dealer_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          price: number
          currency?: string
          description?: string | null
          location_country: string
          location_city: string
          images?: string[]
          status?: 'draft' | 'published' | 'sold' | 'archived'
          specifications?: Json | null
          dealer_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          price?: number
          currency?: string
          description?: string | null
          location_country?: string
          location_city?: string
          images?: string[]
          status?: 'draft' | 'published' | 'sold' | 'archived'
          specifications?: Json | null
          dealer_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
