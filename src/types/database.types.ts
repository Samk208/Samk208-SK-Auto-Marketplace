// Generated from Supabase Schema
// Database: teyloksuvmmhqixjqoch
// Schema: public
// Generated: 2025-11-11
// Based on: manual_migration.sql (applied as per SUPABASE-STATUS-REPORT.md)

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
          role: 'buyer' | 'dealer'
          phone_number: string | null
          language_preference: 'en' | 'ko' | 'fr' | 'sw'
          country: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating: number | null
          business_name: string | null
          business_registration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'buyer' | 'dealer'
          phone_number?: string | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'buyer' | 'dealer'
          phone_number?: string | null
          language_preference?: 'en' | 'ko' | 'fr' | 'sw'
          country?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "cars_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey"
            columns: ["seller_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_car_id_fkey"
            columns: ["car_id"]
            referencedRelation: "cars"
            referencedColumns: ["id"]
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
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_car_id_fkey"
            columns: ["car_id"]
            referencedRelation: "cars"
            referencedColumns: ["id"]
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

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
