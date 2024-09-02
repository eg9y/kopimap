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
          accessibility_mode:
            | Database["public"]["Enums"]["accessibility"]
            | null
          all_image_urls: string[] | null
          avg_rating: number | null
          cafe_id: number
          cafe_place_id: string
          cleanliness_mode: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          comfort_level_mode:
            | Database["public"]["Enums"]["comfort_level"]
            | null
          food_options_mode: Database["public"]["Enums"]["food_options"] | null
          has_musholla_mode: boolean | null
          instagram_worthiness_mode:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          last_updated: string | null
          non_coffee_options_mode:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating_mode:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability_mode:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options_mode:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly_mode: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio_mode:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          restroom_quality_mode:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_count: number | null
          seating_capacity_mode:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          wifi_quality_mode: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability_mode:
            | Database["public"]["Enums"]["work_suitability"]
            | null
        }
        Insert: {
          accessibility_mode?:
            | Database["public"]["Enums"]["accessibility"]
            | null
          all_image_urls?: string[] | null
          avg_rating?: number | null
          cafe_id: number
          cafe_place_id: string
          cleanliness_mode?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode?:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          comfort_level_mode?:
            | Database["public"]["Enums"]["comfort_level"]
            | null
          food_options_mode?: Database["public"]["Enums"]["food_options"] | null
          has_musholla_mode?: boolean | null
          instagram_worthiness_mode?:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          last_updated?: string | null
          non_coffee_options_mode?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating_mode?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability_mode?:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options_mode?:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly_mode?: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio_mode?:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          restroom_quality_mode?:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_count?: number | null
          seating_capacity_mode?:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          wifi_quality_mode?: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability_mode?:
            | Database["public"]["Enums"]["work_suitability"]
            | null
        }
        Update: {
          accessibility_mode?:
            | Database["public"]["Enums"]["accessibility"]
            | null
          all_image_urls?: string[] | null
          avg_rating?: number | null
          cafe_id?: number
          cafe_place_id?: string
          cleanliness_mode?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality_mode?:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          comfort_level_mode?:
            | Database["public"]["Enums"]["comfort_level"]
            | null
          food_options_mode?: Database["public"]["Enums"]["food_options"] | null
          has_musholla_mode?: boolean | null
          instagram_worthiness_mode?:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          last_updated?: string | null
          non_coffee_options_mode?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating_mode?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability_mode?:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options_mode?:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly_mode?: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio_mode?:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          restroom_quality_mode?:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_count?: number | null
          seating_capacity_mode?:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          wifi_quality_mode?: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability_mode?:
            | Database["public"]["Enums"]["work_suitability"]
            | null
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
          hosted_gmaps_images: Json | null
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
          hosted_gmaps_images?: Json | null
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
          hosted_gmaps_images?: Json | null
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
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          username: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          username?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          accessibility: Database["public"]["Enums"]["accessibility"] | null
          cafe_id: number | null
          cafe_place_id: string | null
          cleanliness: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality: Database["public"]["Enums"]["quality_rating"] | null
          comfort_level: Database["public"]["Enums"]["comfort_level"] | null
          created_at: string | null
          food_options: Database["public"]["Enums"]["food_options"] | null
          has_musholla: boolean | null
          id: string
          image_urls: string[] | null
          instagram_worthiness:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          non_coffee_options:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating: Database["public"]["Enums"]["outdoor_seating"] | null
          outlet_availability:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options: Database["public"]["Enums"]["parking_options"] | null
          pet_friendly: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          rating: number | null
          restroom_quality:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_text: string | null
          seating_capacity:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          updated_at: string | null
          user_id: string | null
          wifi_quality: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability:
            | Database["public"]["Enums"]["work_suitability"]
            | null
        }
        Insert: {
          accessibility?: Database["public"]["Enums"]["accessibility"] | null
          cafe_id?: number | null
          cafe_place_id?: string | null
          cleanliness?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality?: Database["public"]["Enums"]["quality_rating"] | null
          comfort_level?: Database["public"]["Enums"]["comfort_level"] | null
          created_at?: string | null
          food_options?: Database["public"]["Enums"]["food_options"] | null
          has_musholla?: boolean | null
          id?: string
          image_urls?: string[] | null
          instagram_worthiness?:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          non_coffee_options?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability?:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options?:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly?: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio?:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          rating?: number | null
          restroom_quality?:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_text?: string | null
          seating_capacity?:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          updated_at?: string | null
          user_id?: string | null
          wifi_quality?: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability?:
            | Database["public"]["Enums"]["work_suitability"]
            | null
        }
        Update: {
          accessibility?: Database["public"]["Enums"]["accessibility"] | null
          cafe_id?: number | null
          cafe_place_id?: string | null
          cleanliness?: Database["public"]["Enums"]["cleanliness"] | null
          coffee_quality?: Database["public"]["Enums"]["quality_rating"] | null
          comfort_level?: Database["public"]["Enums"]["comfort_level"] | null
          created_at?: string | null
          food_options?: Database["public"]["Enums"]["food_options"] | null
          has_musholla?: boolean | null
          id?: string
          image_urls?: string[] | null
          instagram_worthiness?:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          non_coffee_options?:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating?:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability?:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options?:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly?: Database["public"]["Enums"]["pet_friendly"] | null
          price_quality_ratio?:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          rating?: number | null
          restroom_quality?:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_text?: string | null
          seating_capacity?:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          updated_at?: string | null
          user_id?: string | null
          wifi_quality?: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability?:
            | Database["public"]["Enums"]["work_suitability"]
            | null
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
          {
            foreignKeyName: "reviews_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cafe_location_view: {
        Row: {
          accessibility_mode:
            | Database["public"]["Enums"]["accessibility"]
            | null
          address: string | null
          aggregated_reviews_last_updated: string | null
          all_image_urls: string[] | null
          avg_rating: number | null
          cleanliness_mode: Database["public"]["Enums"]["cleanliness"] | null
          closed_on: string | null
          coffee_quality_mode:
            | Database["public"]["Enums"]["quality_rating"]
            | null
          comfort_level_mode:
            | Database["public"]["Enums"]["comfort_level"]
            | null
          created_at: string | null
          description: string | null
          detailed_address: Json | null
          food_options_mode: Database["public"]["Enums"]["food_options"] | null
          gmaps_featured_image: string | null
          gmaps_featured_reviews: Json | null
          gmaps_images: Json | null
          gmaps_link: string | null
          gmaps_rating: string | null
          gmaps_reviews_link: string | null
          gmaps_reviews_per_rating: Json | null
          gmaps_total_reviews: number | null
          has_musholla_mode: boolean | null
          hosted_gmaps_images: Json | null
          hours: Json | null
          id: number | null
          instagram_worthiness_mode:
            | Database["public"]["Enums"]["instagram_worthiness"]
            | null
          latitude: number | null
          longitude: number | null
          main_category: string | null
          menu_link: string | null
          name: string | null
          non_coffee_options_mode:
            | Database["public"]["Enums"]["non_coffee_options"]
            | null
          outdoor_seating_mode:
            | Database["public"]["Enums"]["outdoor_seating"]
            | null
          outlet_availability_mode:
            | Database["public"]["Enums"]["outlet_availability"]
            | null
          parking_options_mode:
            | Database["public"]["Enums"]["parking_options"]
            | null
          pet_friendly_mode: Database["public"]["Enums"]["pet_friendly"] | null
          phone: string | null
          place_id: string | null
          plus_code: string | null
          popular_times: Json | null
          price_quality_ratio_mode:
            | Database["public"]["Enums"]["price_quality_ratio"]
            | null
          price_range: string | null
          restroom_quality_mode:
            | Database["public"]["Enums"]["restroom_quality"]
            | null
          review_count: number | null
          seating_capacity_mode:
            | Database["public"]["Enums"]["seating_capacity"]
            | null
          website: string | null
          wifi_quality_mode: Database["public"]["Enums"]["wifi_quality"] | null
          work_suitability_mode:
            | Database["public"]["Enums"]["work_suitability"]
            | null
          workday_timings: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      nearby_cafes: {
        Args: {
          long: number
          lat: number
          excluded_ids: number[]
          max_distance?: number
        }
        Returns: {
          id: number
          name: string
          gmaps_featured_image: string
          gmaps_ratings: string
          latitude: number
          longitude: number
          distance: number
        }[]
      }
      update_all_cafe_aggregated_reviews: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_single_cafe_aggregated_reviews: {
        Args: {
          p_cafe_id: number
          p_cafe_place_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      accessibility:
        | "Not Accessible"
        | "Partially Accessible"
        | "Fully Accessible"
      cleanliness: "Needs Improvement" | "Acceptable" | "Clean" | "Spotless"
      coffee_quality: "Subpar" | "Average" | "Good" | "Excellent"
      comfort_level: "Minimal" | "Adequate" | "Comfortable" | "Luxurious"
      food_options: "No Food" | "Snacks Only" | "Light Meals" | "Full Menu"
      instagram_worthiness:
        | "Not Particularly"
        | "Somewhat Photogenic"
        | "Very Instagrammable"
      non_coffee_options: "Very Limited" | "Some Options" | "Wide Variety"
      outdoor_seating: "None" | "Limited" | "Ample"
      outlet_availability: "None Visible" | "Scarce" | "Adequate" | "Plentiful"
      parking_options:
        | "No Parking"
        | "Limited Street Parking"
        | "Adequate Parking"
        | "Ample Parking"
      pet_friendly: "no" | "yes"
      price_quality_ratio:
        | "Overpriced"
        | "Fair"
        | "Good Value"
        | "Excellent Value"
      quality_rating: "Poor" | "Average" | "Good" | "Excellent"
      restroom_quality:
        | "No Restroom"
        | "Needs Improvement"
        | "Acceptable"
        | "Clean"
        | "Exceptionally Clean"
      seating_capacity: "Limited" | "Moderate" | "Spacious"
      wifi_quality: "No WiFi" | "Unreliable" | "Decent" | "Fast and Reliable"
      work_suitability: "Not Suitable" | "Tolerable" | "Good" | "Excellent"
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
