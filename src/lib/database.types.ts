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
          about: Json | null
          address_components: Json | null
          adr_address: string | null
          business_status: string | null
          curbside_pickup: boolean | null
          delivery: boolean | null
          dine_in: boolean | null
          editorial_summary: string | null
          formatted_address: string
          geometry: Json | null
          id: number
          is_franchise: boolean
          location: unknown | null
          menu_link: string | null
          name: string | null
          opening_hours: string | null
          parking_availability: string | null
          parking_options: string | null
          phone_number: string | null
          photo_urls: string[] | null
          photos: string[] | null
          place_id: string | null
          plugs: string | null
          price_level: number | null
          rating: number | null
          reservable: boolean | null
          reviews: Json | null
          reviews_link: string | null
          reviews_per_rating: Json | null
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
          user_reviews: Json | null
          vicinity: string | null
          website: string | null
          wheelchair_accessible_entrance: boolean | null
          wifi_available: boolean | null
          wifi_speed: string | null
        }
        Insert: {
          about?: Json | null
          address_components?: Json | null
          adr_address?: string | null
          business_status?: string | null
          curbside_pickup?: boolean | null
          delivery?: boolean | null
          dine_in?: boolean | null
          editorial_summary?: string | null
          formatted_address: string
          geometry?: Json | null
          id?: number
          is_franchise?: boolean
          location?: unknown | null
          menu_link?: string | null
          name?: string | null
          opening_hours?: string | null
          parking_availability?: string | null
          parking_options?: string | null
          phone_number?: string | null
          photo_urls?: string[] | null
          photos?: string[] | null
          place_id?: string | null
          plugs?: string | null
          price_level?: number | null
          rating?: number | null
          reservable?: boolean | null
          reviews?: Json | null
          reviews_link?: string | null
          reviews_per_rating?: Json | null
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
          user_reviews?: Json | null
          vicinity?: string | null
          website?: string | null
          wheelchair_accessible_entrance?: boolean | null
          wifi_available?: boolean | null
          wifi_speed?: string | null
        }
        Update: {
          about?: Json | null
          address_components?: Json | null
          adr_address?: string | null
          business_status?: string | null
          curbside_pickup?: boolean | null
          delivery?: boolean | null
          dine_in?: boolean | null
          editorial_summary?: string | null
          formatted_address?: string
          geometry?: Json | null
          id?: number
          is_franchise?: boolean
          location?: unknown | null
          menu_link?: string | null
          name?: string | null
          opening_hours?: string | null
          parking_availability?: string | null
          parking_options?: string | null
          phone_number?: string | null
          photo_urls?: string[] | null
          photos?: string[] | null
          place_id?: string | null
          plugs?: string | null
          price_level?: number | null
          rating?: number | null
          reservable?: boolean | null
          reviews?: Json | null
          reviews_link?: string | null
          reviews_per_rating?: Json | null
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
          user_reviews?: Json | null
          vicinity?: string | null
          website?: string | null
          wheelchair_accessible_entrance?: boolean | null
          wifi_available?: boolean | null
          wifi_speed?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          author_url: string | null
          cafe_id: number | null
          cafe_url: string | null
          id: number
          language: string | null
          place_id: string | null
          rating: number
          relative_time_description: string
          text: string | null
          time: number | null
        }
        Insert: {
          author_name: string
          author_url?: string | null
          cafe_id?: number | null
          cafe_url?: string | null
          id?: number
          language?: string | null
          place_id?: string | null
          rating: number
          relative_time_description: string
          text?: string | null
          time?: number | null
        }
        Update: {
          author_name?: string
          author_url?: string | null
          cafe_id?: number | null
          cafe_url?: string | null
          id?: number
          language?: string | null
          place_id?: string | null
          rating?: number
          relative_time_description?: string
          text?: string | null
          time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_cafe_id_fkey"
            columns: ["cafe_id"]
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_cafe_url_fkey"
            columns: ["cafe_url"]
            referencedRelation: "cafes"
            referencedColumns: ["url"]
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
      nearby_cafes: {
        Args: {
          lat: number
          long: number
          rating_filter?: number
          page_param?: number
          count_per_page?: number
        }
        Returns: {
          name: string
          rating: number
          user_ratings_total: number
          vicinity: string
          formatted_address: string
          opening_hours: string
          website: string
          place_id: string
          photo_urls: string[]
          dist_meters: number
          id: number
          is_franchise: boolean
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
