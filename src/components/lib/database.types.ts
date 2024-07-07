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
      cafe_aggregated_reviews: {
        Row: {
          avg_rating: number | null
          cafe_id: number
          cafe_place_id: string
          cleanliness_mode: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          food_options_mode: Database["public"]["Enums"]["food_options"] | null
          last_updated: string | null
          power_outlets_mode:
            | Database["public"]["Enums"]["power_outlets"]
            | null
          review_count: number | null
          value_for_money_mode:
            | Database["public"]["Enums"]["value_rating"]
            | null
          wifi_reliability_mode:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space_mode: Database["public"]["Enums"]["work_space"] | null
        }
        Insert: {
          avg_rating?: number | null
          cafe_id: number
          cafe_place_id: string
          cleanliness_mode?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode?:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          food_options_mode?: Database["public"]["Enums"]["food_options"] | null
          last_updated?: string | null
          power_outlets_mode?:
            | Database["public"]["Enums"]["power_outlets"]
            | null
          review_count?: number | null
          value_for_money_mode?:
            | Database["public"]["Enums"]["value_rating"]
            | null
          wifi_reliability_mode?:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space_mode?: Database["public"]["Enums"]["work_space"] | null
        }
        Update: {
          avg_rating?: number | null
          cafe_id?: number
          cafe_place_id?: string
          cleanliness_mode?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode?:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          food_options_mode?: Database["public"]["Enums"]["food_options"] | null
          last_updated?: string | null
          power_outlets_mode?:
            | Database["public"]["Enums"]["power_outlets"]
            | null
          review_count?: number | null
          value_for_money_mode?:
            | Database["public"]["Enums"]["value_rating"]
            | null
          wifi_reliability_mode?:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space_mode?: Database["public"]["Enums"]["work_space"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cafe_aggregated_reviews_cafe_id_cafe_place_id_fkey"
            columns: ["cafe_id", "cafe_place_id"]
            isOneToOne: true
            referencedRelation: "cafe_location_view"
            referencedColumns: ["id", "place_id"]
          },
          {
            foreignKeyName: "cafe_aggregated_reviews_cafe_id_cafe_place_id_fkey"
            columns: ["cafe_id", "cafe_place_id"]
            isOneToOne: true
            referencedRelation: "cafes"
            referencedColumns: ["id", "place_id"]
          },
        ]
      }
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
      review_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          review_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          review_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          review_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          accessibility: Database["public"]["Enums"]["accessibility"] | null
          bathroom_availability:
            | Database["public"]["Enums"]["bathroom_availability"]
            | null
          cafe_id: number | null
          cafe_place_id: string | null
          cleanliness: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality: Database["public"]["Enums"]["quality_rating"] | null
          comment: string | null
          created_at: string | null
          food_options: Database["public"]["Enums"]["food_options"] | null
          id: string
          instagram_worthy:
            | Database["public"]["Enums"]["instagram_worthy"]
            | null
          non_coffee_options:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating: Database["public"]["Enums"]["outdoor_seating"] | null
          overall_vibe: Database["public"]["Enums"]["overall_vibe"] | null
          pet_friendly: Database["public"]["Enums"]["pet_friendly"] | null
          power_outlets: Database["public"]["Enums"]["power_outlets"] | null
          rating: number | null
          seating_comfort: Database["public"]["Enums"]["seating_comfort"] | null
          unique_offering: Database["public"]["Enums"]["unique_offering"] | null
          updated_at: string | null
          user_id: string | null
          value_for_money: Database["public"]["Enums"]["value_rating"] | null
          visit_date: string | null
          visit_time: string | null
          wifi_reliability:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space: Database["public"]["Enums"]["work_space"] | null
        }
        Insert: {
          accessibility?: Database["public"]["Enums"]["accessibility"] | null
          bathroom_availability?:
            | Database["public"]["Enums"]["bathroom_availability"]
            | null
          cafe_id?: number | null
          cafe_place_id?: string | null
          cleanliness?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality?: Database["public"]["Enums"]["quality_rating"] | null
          comment?: string | null
          created_at?: string | null
          food_options?: Database["public"]["Enums"]["food_options"] | null
          id?: string
          instagram_worthy?:
            | Database["public"]["Enums"]["instagram_worthy"]
            | null
          non_coffee_options?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          overall_vibe?: Database["public"]["Enums"]["overall_vibe"] | null
          pet_friendly?: Database["public"]["Enums"]["pet_friendly"] | null
          power_outlets?: Database["public"]["Enums"]["power_outlets"] | null
          rating?: number | null
          seating_comfort?:
            | Database["public"]["Enums"]["seating_comfort"]
            | null
          unique_offering?:
            | Database["public"]["Enums"]["unique_offering"]
            | null
          updated_at?: string | null
          user_id?: string | null
          value_for_money?: Database["public"]["Enums"]["value_rating"] | null
          visit_date?: string | null
          visit_time?: string | null
          wifi_reliability?:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space?: Database["public"]["Enums"]["work_space"] | null
        }
        Update: {
          accessibility?: Database["public"]["Enums"]["accessibility"] | null
          bathroom_availability?:
            | Database["public"]["Enums"]["bathroom_availability"]
            | null
          cafe_id?: number | null
          cafe_place_id?: string | null
          cleanliness?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality?: Database["public"]["Enums"]["quality_rating"] | null
          comment?: string | null
          created_at?: string | null
          food_options?: Database["public"]["Enums"]["food_options"] | null
          id?: string
          instagram_worthy?:
            | Database["public"]["Enums"]["instagram_worthy"]
            | null
          non_coffee_options?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          overall_vibe?: Database["public"]["Enums"]["overall_vibe"] | null
          pet_friendly?: Database["public"]["Enums"]["pet_friendly"] | null
          power_outlets?: Database["public"]["Enums"]["power_outlets"] | null
          rating?: number | null
          seating_comfort?:
            | Database["public"]["Enums"]["seating_comfort"]
            | null
          unique_offering?:
            | Database["public"]["Enums"]["unique_offering"]
            | null
          updated_at?: string | null
          user_id?: string | null
          value_for_money?: Database["public"]["Enums"]["value_rating"] | null
          visit_date?: string | null
          visit_time?: string | null
          wifi_reliability?:
            | Database["public"]["Enums"]["wifi_reliability"]
            | null
          work_space?: Database["public"]["Enums"]["work_space"] | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_cafe_id_cafe_place_id_fkey"
            columns: ["cafe_id", "cafe_place_id"]
            isOneToOne: false
            referencedRelation: "cafe_location_view"
            referencedColumns: ["id", "place_id"]
          },
          {
            foreignKeyName: "reviews_cafe_id_cafe_place_id_fkey"
            columns: ["cafe_id", "cafe_place_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id", "place_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      accessibility:
        | "Not Accessible"
        | "Partially Accessible"
        | "Fully Accessible"
      bathroom_availability: "No Bathroom" | "For Customers" | "Public Access"
      cleanliness: "Poor" | "Acceptable" | "Clean" | "Very Clean"
      food_options: "No Food" | "Snacks Only" | "Light Meals" | "Full Menu"
      instagram_worthy: "Not Really" | "Somewhat" | "Very"
      non_coffee_options: "Very Limited" | "Some Options" | "Great Variety"
      outdoor_seating: "None" | "Limited" | "Ample"
      overall_vibe: "Relaxed" | "Energetic" | "Cozy" | "Modern" | "Artistic"
      pet_friendly: "no" | "yes"
      power_outlets: "None Visible" | "Limited" | "Plenty"
      quality_rating: "Poor" | "Average" | "Good" | "Excellent"
      seating_comfort: "Basic" | "Comfortable" | "Luxurious"
      unique_offering: "Standard" | "Interesting" | "Very Unique"
      value_rating: "Poor" | "Fair" | "Good" | "Excellent"
      wifi_reliability:
        | "No WiFi"
        | "Unreliable"
        | "Mostly Reliable"
        | "Very Reliable"
      work_space: "Not Suitable" | "Okay" | "Good" | "Excellent"
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
