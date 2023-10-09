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
      cafes: {
        Row: {
          address_components: Json | null
          adr_address: string | null
          business_status: string | null
          curbside_pickup: boolean | null
          delivery: boolean | null
          dine_in: boolean | null
          editorial_summary: string | null
          formatted_address: string | null
          geometry: Json | null
          icon: string | null
          icon_background_color: string | null
          icon_mask_base_uri: string | null
          id: number
          location: unknown | null
          name: string | null
          opening_hours: Json | null
          phone_number: string | null
          photo_urls: string[] | null
          photos: string[] | null
          place_id: string | null
          price_level: number | null
          rating: number | null
          reservable: boolean | null
          reviews: Json | null
          serves_beer: boolean | null
          serves_breakfast: boolean | null
          serves_brunch: boolean | null
          serves_dinner: boolean | null
          serves_lunch: boolean | null
          serves_vegetarian_food: boolean | null
          serves_wine: boolean | null
          takeout: boolean | null
          type: string | null
          types: string[] | null
          url: string | null
          user_ratings_total: number | null
          vicinity: string | null
          website: string | null
          wheelchair_accessible_entrance: boolean | null
        }
        Insert: {
          address_components?: Json | null
          adr_address?: string | null
          business_status?: string | null
          curbside_pickup?: boolean | null
          delivery?: boolean | null
          dine_in?: boolean | null
          editorial_summary?: string | null
          formatted_address?: string | null
          geometry?: Json | null
          icon?: string | null
          icon_background_color?: string | null
          icon_mask_base_uri?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          photo_urls?: string[] | null
          photos?: string[] | null
          place_id?: string | null
          price_level?: number | null
          rating?: number | null
          reservable?: boolean | null
          reviews?: Json | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          takeout?: boolean | null
          type?: string | null
          types?: string[] | null
          url?: string | null
          user_ratings_total?: number | null
          vicinity?: string | null
          website?: string | null
          wheelchair_accessible_entrance?: boolean | null
        }
        Update: {
          address_components?: Json | null
          adr_address?: string | null
          business_status?: string | null
          curbside_pickup?: boolean | null
          delivery?: boolean | null
          dine_in?: boolean | null
          editorial_summary?: string | null
          formatted_address?: string | null
          geometry?: Json | null
          icon?: string | null
          icon_background_color?: string | null
          icon_mask_base_uri?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          photo_urls?: string[] | null
          photos?: string[] | null
          place_id?: string | null
          price_level?: number | null
          rating?: number | null
          reservable?: boolean | null
          reviews?: Json | null
          serves_beer?: boolean | null
          serves_breakfast?: boolean | null
          serves_brunch?: boolean | null
          serves_dinner?: boolean | null
          serves_lunch?: boolean | null
          serves_vegetarian_food?: boolean | null
          serves_wine?: boolean | null
          takeout?: boolean | null
          type?: string | null
          types?: string[] | null
          url?: string | null
          user_ratings_total?: number | null
          vicinity?: string | null
          website?: string | null
          wheelchair_accessible_entrance?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          aspects: Json[] | null
          author_name: string
          author_url: string | null
          id: number
          language: string | null
          place_id: string | null
          profile_photo_url: string | null
          rating: number
          relative_time_description: string
          text: string | null
          time: number | null
        }
        Insert: {
          aspects?: Json[] | null
          author_name: string
          author_url?: string | null
          id?: number
          language?: string | null
          place_id?: string | null
          profile_photo_url?: string | null
          rating: number
          relative_time_description: string
          text?: string | null
          time?: number | null
        }
        Update: {
          aspects?: Json[] | null
          author_name?: string
          author_url?: string | null
          id?: number
          language?: string | null
          place_id?: string | null
          profile_photo_url?: string | null
          rating?: number
          relative_time_description?: string
          text?: string | null
          time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_place_id_fkey"
            columns: ["place_id"]
            referencedRelation: "cafes"
            referencedColumns: ["place_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_cafes: {
        Args: {
          user_longitude: number
          user_latitude: number
          search_radius_meters: number
        }
        Returns: {
          cafe_id: number
          cafe_name: string
          cafe_address: string
          distance_meters: number
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
