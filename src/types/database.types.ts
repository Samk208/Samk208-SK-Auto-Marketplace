// Placeholder for Supabase-generated types
// TODO: Generate actual types using:
// npx supabase gen types typescript --project-id teyloksuvmmhqixjqoch > src/types/database.types.ts

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
          email: string
          full_name: string
          avatar_url: string | null
          role: 'buyer' | 'seller'
          phone_number: string | null
          language_preference: 'en' | 'ko' | 'fr' | 'sw'
          country: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating: number | null
          business_name: string | null
          business_registration: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'buyer' | 'seller'
          phone_number?: string | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'buyer' | 'seller'
          phone_number?: string | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          dealer_id: string
          make: string
          model: string
          year: number
          price: number
          mileage: number
          fuel_type: string | null
          transmission: string | null
          location_city: string
          location_country: string
          images: string[]
          description_en: string | null
          description_ko: string | null
          description_fr: string | null
          description_sw: string | null
          specifications: Json | null
          status: string
          featured: boolean
          view_count: number
          inquiry_count: number
          ai_generated: boolean
          shipping_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dealer_id: string
          make: string
          model: string
          year: number
          price: number
          mileage: number
          fuel_type?: string | null
          transmission?: string | null
          location_city: string
          location_country: string
          images?: string[]
          description_en?: string | null
          description_ko?: string | null
          description_fr?: string | null
          description_sw?: string | null
          specifications?: Json | null
          status?: string
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dealer_id?: string
          make?: string
          model?: string
          year?: number
          price?: number
          mileage?: number
          fuel_type?: string | null
          transmission?: string | null
          location_city?: string
          location_country?: string
          images?: string[]
          description_en?: string | null
          description_ko?: string | null
          description_fr?: string | null
          description_sw?: string | null
          specifications?: Json | null
          status?: string
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          car_id: string
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          seller_id: string
          car_id: string
          last_message_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          seller_id?: string
          car_id?: string
          last_message_at?: string | null
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
    Views: {}
    Functions: {}
    Enums: {}
  }
}
