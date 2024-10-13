import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
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

  const [aggregatedReview, reviews, images, cafeDetails] = await Promise.all([
    supabase
      .from("cafe_aggregated_reviews")
      .select("*")
      .eq("cafe_place_id", placeId)
      .single(),
    supabase
      .from("reviews")
      .select(`
         id,
        updated_at,
        rating,
        user_id,
        review_text,
        coffee_quality,
        cleanliness,
        comfort_level,
        food_options,
        wifi_quality,
        work_suitability,
        has_musholla,
       profiles(username)
      `)
      .eq("cafe_place_id", placeId)
      .order("created_at", { ascending: false }),
    supabase
      .from("images")
      .select("*")
      .eq("place_id", placeId),
    supabase
      .from("cafes")
      .select(`
        popular_times,
        gmaps_reviews_per_rating,
        phone,
        hours,
        workday_timings
      `)
      .eq("place_id", placeId)
      .single(),
  ]);

  if (aggregatedReview.error && aggregatedReview.error.code !== "PGRST116") {
    throw new Error(aggregatedReview.error.message);
  }
  if (reviews.error) {
    throw new Error(reviews.error.message);
  }

  if (images.error) {
    throw new Error(images.error.message);
  }

  return {
    aggregatedReview: aggregatedReview.data,
    reviews: reviews.data?.map((review) => ({
      ...review,
      image_urls: images.data?.filter((img) => img.review_id === review.id).map((img) => img.url!),
    })),
    cafeDetails: cafeDetails.data,
  };
};
