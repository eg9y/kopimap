export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cafes: {
        Row: {
          address: string | null
          closed_on: string | null
          created_at: string
          description: string | null
          detailed_address: Json | null
          gmaps_featured_image: string | null
          gmaps_featured_reviews: Json | null
          gmaps_images: Json | null
          gmaps_link: string | null
          gmaps_rating: string | null
          gmaps_reviews_link: string | null
          gmaps_reviews_per_rating: Json | null
          gmaps_total_reviews: number | null
          hours: Json | null
          id: number
          location: unknown
          main_category: string | null
          menu_link: string | null
          name: string
          phone: string | null
          place_id: string
          plus_code: string | null
          popular_times: Json | null
          price_range: string | null
          website: string | null
          workday_timings: string | null
        }
        Insert: {
          address?: string | null
          closed_on?: string | null
          created_at?: string
          description?: string | null
          detailed_address?: Json | null
          gmaps_featured_image?: string | null
          gmaps_featured_reviews?: Json | null
          gmaps_images?: Json | null
          gmaps_link?: string | null
          gmaps_rating?: string | null
          gmaps_reviews_link?: string | null
          gmaps_reviews_per_rating?: Json | null
          gmaps_total_reviews?: number | null
          hours?: Json | null
          id?: number
          location: unknown
          main_category?: string | null
          menu_link?: string | null
          name: string
          phone?: string | null
          place_id: string
          plus_code?: string | null
          popular_times?: Json | null
          price_range?: string | null
          website?: string | null
          workday_timings?: string | null
        }
        Update: {
          address?: string | null
          closed_on?: string | null
          created_at?: string
          description?: string | null
          detailed_address?: Json | null
          gmaps_featured_image?: string | null
          gmaps_featured_reviews?: Json | null
          gmaps_images?: Json | null
          gmaps_link?: string | null
          gmaps_rating?: string | null
          gmaps_reviews_link?: string | null
          gmaps_reviews_per_rating?: Json | null
          gmaps_total_reviews?: number | null
          hours?: Json | null
          id?: number
          location?: unknown
          main_category?: string | null
          menu_link?: string | null
          name?: string
          phone?: string | null
          place_id?: string
          plus_code?: string | null
          popular_times?: Json | null
          price_range?: string | null
          website?: string | null
          workday_timings?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      cafe_location_view: {
        Row: {
          address: string | null
          closed_on: string | null
          created_at: string | null
          description: string | null
          detailed_address: Json | null
          gmaps_featured_image: string | null
          gmaps_featured_reviews: Json | null
          gmaps_images: Json | null
          gmaps_link: string | null
          gmaps_rating: string | null
          gmaps_reviews_link: string | null
          gmaps_reviews_per_rating: Json | null
          gmaps_total_reviews: number | null
          hours: Json | null
          id: number | null
          latitude: number | null
          longitude: number | null
          main_category: string | null
          menu_link: string | null
          name: string | null
          phone: string | null
          place_id: string | null
          plus_code: string | null
          popular_times: Json | null
          price_range: string | null
          website: string | null
          workday_timings: string | null
        }
        Insert: {
          address?: string | null
          closed_on?: string | null
          created_at?: string | null
          description?: string | null
          detailed_address?: Json | null
          gmaps_featured_image?: string | null
          gmaps_featured_reviews?: Json | null
          gmaps_images?: Json | null
          gmaps_link?: string | null
          gmaps_rating?: string | null
          gmaps_reviews_link?: string | null
          gmaps_reviews_per_rating?: Json | null
          gmaps_total_reviews?: number | null
          hours?: Json | null
          id?: number | null
          latitude?: never
          longitude?: never
          main_category?: string | null
          menu_link?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          plus_code?: string | null
          popular_times?: Json | null
          price_range?: string | null
          website?: string | null
          workday_timings?: string | null
        }
        Update: {
          address?: string | null
          closed_on?: string | null
          created_at?: string | null
          description?: string | null
          detailed_address?: Json | null
          gmaps_featured_image?: string | null
          gmaps_featured_reviews?: Json | null
          gmaps_images?: Json | null
          gmaps_link?: string | null
          gmaps_rating?: string | null
          gmaps_reviews_link?: string | null
          gmaps_reviews_per_rating?: Json | null
          gmaps_total_reviews?: number | null
          hours?: Json | null
          id?: number | null
          latitude?: never
          longitude?: never
          main_category?: string | null
          menu_link?: string | null
          name?: string | null
          phone?: string | null
          place_id?: string | null
          plus_code?: string | null
          popular_times?: Json | null
          price_range?: string | null
          website?: string | null
          workday_timings?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      nearby_cafes: {
        Args: {
          lat: number
          long: number
          max_distance?: number
          limit_count?: number
          excluded_ids?: number[]
        }
        Returns: {
          id: number
          created_at: string
          name: string
          description: string
          gmaps_rating: string
          gmaps_total_reviews: number
          gmaps_reviews_link: string
          price_range: string
          phone: string
          website: string
          menu_link: string
          gmaps_link: string
          address: string
          plus_code: string
          detailed_address: Json
          gmaps_featured_image: string
          gmaps_images: Json
          gmaps_featured_reviews: Json
          gmaps_reviews_per_rating: Json
          main_category: string
          closed_on: string
          workday_timings: string
          hours: Json
          popular_times: Json
          place_id: string
          location: unknown
          latitude: number
          longitude: number
          distance: number
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
