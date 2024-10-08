import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { useInfiniteQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL!,
	import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export const useLatestReviews = (pageSize = 10) => {
	const {
		status,
		data,
		error,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["latestReviews"],
		queryFn: ({ pageParam = 0 }) => fetchLatestReviews(pageSize, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < pageSize) {
				return undefined; // No more pages
			}
			return allPages.length * pageSize;
		},
		initialPageParam: 0,
	});

	const allReviews = data ? data.pages.flatMap((page) => page) : [];

	return {
		status,
		data: allReviews,
		error,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	};
};

async function fetchLatestReviews(
	limit: number,
	offset: number,
	maxImages = 3,
) {
	// Fetch reviews with more metadata
	const { data: reviews, error: reviewsError } = await supabase
		.from("reviews")
		.select(`
      id,
      updated_at,
      rating,
      image_urls,
      user_id,
      review_text,
      coffee_quality,
      cleanliness,
      comfort_level,
      food_options,
      wifi_quality,
      work_suitability,
      has_musholla,
      cafe:cafes(
        id,
        name,
        address,
        gmaps_rating,
        gmaps_total_reviews,
        price_range,
        place_id
      )
    `)
		.order("updated_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (reviewsError) {
		throw new Error("Error fetching latest reviews");
	}

	// Limit image_urls to maxImages
	const reviewsWithLimitedImages = reviews.map((review) => ({
		...review,
		image_urls: review.image_urls?.slice(0, maxImages) || [],
	}));

	console.log("reviewsWithLimitedImages", reviewsWithLimitedImages);

	// Fetch user profiles
	const userIds = reviewsWithLimitedImages.map((review) => review.user_id);
	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("id, first_name, last_name, username")
		.in("id", userIds);

	if (profilesError) {
		throw new Error("Error fetching user profiles");
	}

	// Combine review and profile data
	const reviewsWithProfiles = reviewsWithLimitedImages.map((review) => {
		const profile = profiles.find((p) => p.id === review.user_id);
		return {
			...review,
			user: profile
				? {
						username: profile.username,
						first_name: profile.first_name,
						last_name: profile.last_name,
					}
				: null,
		};
	});

	return reviewsWithProfiles;
}
