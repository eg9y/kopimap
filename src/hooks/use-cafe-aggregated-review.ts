import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
export const useCafeAggregatedReview = (placeId: string | null) => {
  return useQuery({
    queryKey: ["cafeAggregatedReview", placeId],
    queryFn: () => fetchCafeAggregatedReview(placeId),
    enabled: !!placeId,
  });
};

const fetchCafeAggregatedReview = async (placeId: string | null) => {
  if (!placeId) {
    return null;
  }
  const { data, error } = await supabase
    .from("cafe_aggregated_reviews")
    .select("*")
    .eq("cafe_place_id", placeId)
    .single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
};
