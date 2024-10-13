import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import {
	InfiniteData,
	QueryFunctionContext,
	UseInfiniteQueryResult,
	useInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useStore } from "../store";
import type { MeiliSearchCafe } from "../types";

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const SEARCH_RADIUS = 3000; // 3km radius
const SEARCH_WITH_FILTERS_RADIUS = 10000; // 10km radius
const PAGE_SIZE = 20; // Number of cafes per page

interface CafesResponse {
	cafes: MeiliSearchCafe[];
	nextPage: number | undefined;
	totalHits: number;
}

type CafesQueryKey = [
	string,
	number,
	number,
	string,
	Record<string, any>,
	boolean,
];

const transformImageUrl = (url: string) => {
	const imagePath = url.split("/storage/v1/object/public/")[1];
	if (!imagePath) return url;

	return `https://kopimap-cdn.b-cdn.net/${imagePath}?width=128&sharpen=true`;
};

export const useCafes = (
	lat: number,
	lng: number,
	searchTerm?: string,
	isIncludeDetails: boolean = true,
): UseInfiniteQueryResult<InfiniteData<CafesResponse>, Error> => {
	const { searchFilters } = useStore();

	const queryKey = useMemo((): CafesQueryKey => {
		return [
			"cafes",
			lat,
			lng,
			searchTerm || "No search term",
			searchFilters,
			isIncludeDetails,
		];
	}, [lat, lng, searchTerm, searchFilters, isIncludeDetails]);

	const fetchCafes = useCallback(
		async ({
			pageParam = 1,
		}: QueryFunctionContext<CafesQueryKey, number>): Promise<CafesResponse> => {
			const filterParams = new URLSearchParams();
			filterParams.append("lat", lat.toString());
			filterParams.append("lng", lng.toString());

			// Determine the search radius based on filters
			let searchRadius = SEARCH_RADIUS;
			for (const [key, value] of Object.entries(searchFilters)) {
				if (value && key !== "gmaps_rating" && key !== "gmaps_total_reviews") {
					searchRadius = SEARCH_WITH_FILTERS_RADIUS;
					break;
				}
			}
			filterParams.append("radius", searchRadius.toString());

			filterParams.append("page", pageParam.toString());
			filterParams.append("hitsPerPage", PAGE_SIZE.toString());
			filterParams.append("isIncludeDetails", isIncludeDetails.toString());

			if (searchTerm) {
				filterParams.append("q", searchTerm);
			}

			for (const [key, value] of Object.entries(searchFilters)) {
				if (value) {
					if (key === "gmaps_rating" || key === "gmaps_total_reviews") {
						filterParams.append(key, value);
					} else {
						filterParams.append(`${key}_mode`, value);
					}
				}
			}

			const response = await fetch(
				`${import.meta.env.VITE_MEILISEARCH_URL}/api/search?${filterParams.toString()}`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch cafes");
			}

			const data: { hits: any[]; totalHits: number } = await response.json();

			const cafes = data.hits.map((cafe: MeiliSearchCafe) => ({
				gmaps_ratings: cafe.gmaps_rating.toString(),
				latitude: cafe._geo.lat,
				longitude: cafe._geo.lng,
				distance: cafe._geoDistance,
				...cafe,
				images: [] as string[],
			}));

			try {
				const { data: gmapsImages, error } = await supabase
					.from("cafe_location_view")
					.select(
						"hosted_gmaps_images, gmaps_images,gmaps_featured_image, place_id",
					)
					.in(
						"place_id",
						cafes.map((cafe) => cafe.id),
					);
				const { data: reviewImages, error: reviewImagesError } = await supabase
					.from("images")
					.select(
						"url, place_id",
					)
					.in(
						"place_id",
						cafes.map((cafe) => cafe.id),
					);

				if (error || reviewImagesError) {
					console.error("Error fetching images from Supabase:", error, reviewImagesError);
				} else if (gmapsImages && reviewImages) {
					// Create a map of place_id to image data for efficient lookup
					const gmapsImageMap = new Map(gmapsImages.map((img) => [img.place_id, img]));
					const reviewImageMap = new Map(reviewImages.map((img) => [img.place_id, img]));

					// Connect images with cafes
					cafes.forEach((cafe) => {
						const gmapsImages = gmapsImageMap.get(cafe.id);
						const reviewImages = reviewImageMap.get(cafe.id);
						if (gmapsImages || reviewImages) {
							const images = [
								...(reviewImages?.url ? [reviewImages.url] : []),
								...((gmapsImages?.hosted_gmaps_images as string[])
									? (gmapsImages?.hosted_gmaps_images as string[]).map(
											transformImageUrl,
										)
									: []),
								...(gmapsImages?.gmaps_images
									? JSON.parse(gmapsImages?.gmaps_images as string).map(
											(gmapsImage: { link: string }) => gmapsImage.link,
										)
									: []),
							];
							cafe.images = images;
						}
					});
				}
			} catch (error) {
				console.error("Unexpected error while fetching images:", error);
			}

			return {
				cafes,
				nextPage: data.hits.length === PAGE_SIZE ? pageParam + 1 : undefined,
				totalHits: data.totalHits,
			};
		},
		[lat, lng, searchTerm, searchFilters, isIncludeDetails],
	);

	return useInfiniteQuery<
		CafesResponse,
		Error,
		InfiniteData<CafesResponse>,
		CafesQueryKey,
		number
	>({
		queryKey,
		queryFn: fetchCafes,
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextPage,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
		placeholderData: (prev) => prev,
	});
};
