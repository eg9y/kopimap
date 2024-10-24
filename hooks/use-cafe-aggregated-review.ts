import { useQuery } from "@tanstack/react-query";

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

  try {
    const response = await fetch(`${import.meta.env.VITE_MEILISEARCH_URL}/api/cafe-aggregated-review/${placeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cafe aggregated review:", error);
    throw new Error("Failed to fetch cafe aggregated review");
  }
};