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

export type SelectedCafe =
  Database["public"]["Views"]["cafe_location_view"]["Row"] &
    Database["public"]["Tables"]["cafe_aggregated_reviews"]["Row"];

export type Cafe = Database["public"]["Views"]["cafe_location_view"]["Row"];
