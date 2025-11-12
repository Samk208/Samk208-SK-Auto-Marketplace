/**
 * SK AutoSphere - Supabase Database Types
 * Auto-generated from database schema
 * Last updated: 2025-11-12
 */

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
          created_at?: string
        }
        Relationships: []
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
          description_en: string | null
          description_fr: string | null
          description_sw: string | null
          featured: boolean
          view_count: number
          inquiry_count: number
          ai_generated: boolean
          shipping_available: boolean
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
          description_en?: string | null
          description_fr?: string | null
          description_sw?: string | null
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
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
          description_en?: string | null
          description_fr?: string | null
          description_sw?: string | null
          featured?: boolean
          view_count?: number
          inquiry_count?: number
          ai_generated?: boolean
          shipping_available?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'cars_dealer_id_fkey'
            columns: ['dealer_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'conversations_car_id_fkey'
            columns: ['car_id']
            referencedRelation: 'cars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_buyer_id_fkey'
            columns: ['buyer_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_seller_id_fkey'
            columns: ['seller_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_car_id_fkey'
            columns: ['car_id']
            referencedRelation: 'cars'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_car_views: {
        Args: {
          car_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Convenience type exports
export type Profile = Tables<'profiles'>
export type Car = Tables<'cars'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
export type Favorite = Tables<'favorites'>
