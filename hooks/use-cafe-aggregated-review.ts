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
    queryFn: () => fetchCafeAggregatedReviewAndReviews(placeId),
    enabled: !!placeId,
  });
};

const fetchCafeAggregatedReviewAndReviews = async (placeId: string | null) => {
  if (!placeId) {
    return null;
  }

  const [aggregatedReview, reviews] = await Promise.all([
    supabase
      .from("cafe_aggregated_reviews")
      .select("*")
      .eq("cafe_place_id", placeId)
      .single(),
    supabase
      .from("reviews")
      .select(`
        id,
        created_at,
        rating,
        review_text,
        image_urls,
        user_id,
       profiles(username)
      `)
      .eq("cafe_place_id", placeId)
      .order("created_at", { ascending: false })
  ]);

  if (aggregatedReview.error && aggregatedReview.error.code !== "PGRST116") {
    throw new Error(aggregatedReview.error.message);
  }
  if (reviews.error) {
    throw new Error(reviews.error.message);
  }

  return {
    aggregatedReview: aggregatedReview.data,
    reviews: reviews.data
  };
};
