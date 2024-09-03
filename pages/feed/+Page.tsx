import { Star, MapPin, User } from "lucide-react";
import { useLatestReviews } from "@/hooks/use-latest-reviews";
import { UserReview } from "@/components/user-review";

export default function Feed() {
  const { data: reviews, isLoading, error } = useLatestReviews();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold">Kopi Feed</h1>
        <h2 className="text-lg font-medium">What's brewing</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {reviews?.map((review) => (
          <UserReview
            key={review.id}
            id={review.id}
            username={review.user?.username || "Anonymous"}
            cafeName={review.cafe?.name}
            cafeAddress={review.cafe?.address!}
            rating={review.rating!}
            reviewText={review.review_text!}
            createdAt={review.updated_at as string}
            imageUrls={review.image_urls!}
            metadata={{
              coffee_quality: review.coffee_quality,
              cleanliness: review.cleanliness,
              comfort_level: review.comfort_level,
              food_options: review.food_options,
              wifi_quality: review.wifi_quality,
              work_suitability: review.work_suitability,
              has_musholla: review.has_musholla,
            }}
            cafeGmapsRating={review.cafe?.gmaps_rating ?? undefined}
            cafeGmapsTotalReviews={
              review.cafe?.gmaps_total_reviews ?? undefined
            }
            cafePriceRange={review.cafe?.price_range ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
