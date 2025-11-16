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
          role: 'buyer' | 'seller'
          language_preference: 'en' | 'ko' | 'fr' | 'sw' | null
          country: string | null
          phone_number: string | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected' | null
          seller_rating: number | null
          business_name: string | null
          business_registration: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'buyer' | 'seller'
          language_preference?: 'en' | 'ko' | 'fr' | 'sw' | null
          country?: string | null
          phone_number?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected' | null
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'buyer' | 'seller'
          language_preference?: 'en' | 'ko' | 'fr' | 'sw' | null
          country?: string | null
          phone_number?: string | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected' | null
          seller_rating?: number | null
          business_name?: string | null
          business_registration?: string | null
          created_at?: string | null
          updated_at?: string | null
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
          description_en: string | null
          description_fr: string | null
          description_sw: string | null
          location_country: string
          location_city: string
          images: string[] | null
          status: string
          featured: boolean | null
          specifications: Json | null
          dealer_id: string
          view_count: number | null
          inquiry_count: number | null
          ai_generated: boolean | null
          shipping_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          price: number
          currency: string
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_sw?: string | null
          location_country: string
          location_city: string
          images?: string[] | null
          status: string
          featured?: boolean | null
          specifications?: Json | null
          dealer_id: string
          view_count?: number | null
          inquiry_count?: number | null
          ai_generated?: boolean | null
          shipping_available?: boolean | null
          created_at?: string | null
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
          images?: string[] | null
          status?: string
          featured?: boolean | null
          specifications?: Json | null
          dealer_id?: string
          view_count?: number | null
          inquiry_count?: number | null
          ai_generated?: boolean | null
          shipping_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cars_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
