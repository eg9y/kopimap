import { UserReview } from "@/components/user-review";
import { useLatestReviews } from "@/hooks/use-latest-reviews";
import { Database } from "@/components/lib/database.types";

type ReviewUser = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
};

type ReviewCafe = {
  name: string | null;
  address: string | null;
  gmaps_rating: string | null;
  gmaps_total_reviews: number | null;
  price_range: string | null;
  place_id: string | null;
};

type Review = {
  id: string;
  updated_at: string | null;
  rating: number | null;
  image_urls: string[] | null;
  review_text: string | null;
  coffee_quality: Database["public"]["Enums"]["quality_rating"] | null;
  cleanliness: Database["public"]["Enums"]["cleanliness"] | null;
  comfort_level: Database["public"]["Enums"]["comfort_level"] | null;
  food_options: Database["public"]["Enums"]["food_options"] | null;
  wifi_quality: Database["public"]["Enums"]["wifi_quality"] | null;
  work_suitability: Database["public"]["Enums"]["work_suitability"] | null;
  has_musholla: boolean | null;
  user: ReviewUser | null;
  cafe: ReviewCafe | null;
};

export default function Feed() {
  const { data: reviews, isLoading, error } = useLatestReviews();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Function to split reviews into columns
  const splitReviews = (reviews: Review[], numColumns: number): Review[][] => {
    const columns: Review[][] = Array.from({ length: numColumns }, () => []);
    reviews.forEach((review, index) => {
      columns[index % numColumns].push(review);
    });
    return columns;
  };

  const columns = splitReviews(reviews || [], 3); // Change to 3 columns for desktop

  return (
    <div className="flex flex-col h-[calc(100dvh_-_56px_-0.5rem)] ">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold">Kopi Feed</h1>
        <h2 className="text-lg font-medium">What's brewing</h2>
      </div>
      <div className="flex-1 px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-4 grid-cols-1">
              {column.map((review) => (
                <UserReview
                  key={review.id}
                  id={review.id}
                  username={review.user?.username || "Anonymous"}
                  cafeName={review.cafe?.name || undefined}
                  cafeAddress={review.cafe?.address || undefined}
                  rating={review.rating || 0}
                  reviewText={review.review_text || undefined}
                  createdAt={review.updated_at || ""}
                  imageUrls={review.image_urls || undefined}
                  metadata={{
                    coffee_quality: review.coffee_quality,
                    cleanliness: review.cleanliness,
                    comfort_level: review.comfort_level,
                    food_options: review.food_options,
                    wifi_quality: review.wifi_quality,
                    work_suitability: review.work_suitability,
                    has_musholla: review.has_musholla,
                  }}
                  cafeGmapsRating={review.cafe?.gmaps_rating || undefined}
                  cafeGmapsTotalReviews={
                    review.cafe?.gmaps_total_reviews || undefined
                  }
                  cafePriceRange={review.cafe?.price_range || undefined}
                  placeId={review.cafe?.place_id || undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
