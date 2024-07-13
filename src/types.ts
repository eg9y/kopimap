import { Database } from "./components/lib/database.types";

type Attribute = {
  name: string;
  options: string[];
  icon: any;
};

export type CategoryAttributes = {
  color:
    | "orange"
    | "blue"
    | "emerald"
    | "purple"
    | "fuchsia"
    | "zinc"
    | "cyan"
    | "green"
    | "indigo"
    | "lime"
    | "pink"
    | "red"
    | "teal"
    | "violet"
    | "yellow"
    | "amber"
    | "sky"
    | "rose"
    | undefined;
  category: string;
  attributes: Attribute[];
};

export type CafeDetailedInfo =
  Database["public"]["Views"]["cafe_location_view"]["Row"];

export type MeiliSearchCafe = {
  id: string;
  name: string;
  gmaps_rating: number;
  address: string;
  _geo: {
    lat: number;
    lng: number;
  };
  _geoDistance: number;
} & CafeAttributes;

export type Cafe = {
  id: string;
  name: string;
  gmaps_featured_image: string;
  gmaps_ratings: string;
  latitude: number;
  longitude: number;
  distance: number;
} & CafeAttributes;

export type CafeAttributes = {
  bathroom_availability_mode: string;
  cleanliness_mode: string;
  coffee_quality_mode: string;
  food_options_mode: string;
  instagram_worthy_mode: string;
  non_coffee_options_mode: string;
  outdoor_seating_mode: string;
  overall_vibe_mode: string;
  parking_mode: string;
  pet_friendly_mode: string;
  power_outlets_mode: string;
  seating_comfort_mode: string;
  unique_offering_mode: string;
  value_for_money_mode: string;
  wifi_reliability_mode: string;
  work_space_mode: string;
  accessibility_mode: string;
};

export type SearchFilters = {
  minRating: number;
  query: string;
} & CafeAttributes;
