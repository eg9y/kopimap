import { Database } from "./components/lib/database.types";

type Attribute = {
  name: string;
  options: string[];
  icon: string;
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

export type SelectedCafe = Database["public"]["Tables"]["cafes"]["Row"] &
  Database["public"]["Tables"]["cafe_aggregated_reviews"]["Row"];
