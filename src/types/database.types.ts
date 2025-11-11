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
          language_preference: 'en' | 'ko' | 'fr' | 'sw'
          country: string | null
          phone_number: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating: number
          business_name: string | null
          business_registration: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          role?: 'buyer' | 'seller' | 'admin' | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          phone_number?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          role?: 'buyer' | 'seller' | 'admin' | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          phone_number?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number
          business_name?: string | null
          business_registration?: string | null
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
          description_en: string | null
          description_fr: string | null
          description_sw: string | null
          location_country: string
          location_city: string
          images: string[]
          status: 'draft' | 'published' | 'sold' | 'archived'
          specifications: Json | null
          dealer_id: string
          featured: boolean
          view_count: number
          inquiry_count: number
          ai_generated: boolean
          shipping_available: boolean
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
          description_en?: string | null
          description_fr?: string | null
          description_sw?: string | null
          location_country: string
          location_city: string
          images?: string[]
          status?: 'draft' | 'published' | 'sold' | 'archived'
          specifications?: Json | null
          dealer_id: string
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
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
          description_en?: string | null
          description_fr?: string | null
          description_sw?: string | null
          location_country?: string
          location_city?: string
          images?: string[]
          status?: 'draft' | 'published' | 'sold' | 'archived'
          specifications?: Json | null
          dealer_id?: string
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          car_id: string | null
          buyer_id: string
          seller_id: string
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          car_id?: string | null
          buyer_id: string
          seller_id: string
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          car_id?: string | null
          buyer_id?: string
          seller_id?: string
          last_message_at?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          content_translated: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          content_translated?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          content_translated?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          car_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          car_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          car_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_car_views: {
        Args: { car_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
