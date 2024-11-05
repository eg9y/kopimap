import {
	InfiniteData,
	QueryFunctionContext,
	UseInfiniteQueryResult,
	useInfiniteQuery,
  } from "@tanstack/react-query";
  import { useCallback, useMemo } from "react";
  import { useStore } from "../store";
  import type { MeiliSearchCafe } from "../types";
  
  const SEARCH_RADIUS = 3000; // 3km radius
  const SEARCH_WITH_FILTERS_RADIUS = 10000; // 10km radius
  const PAGE_SIZE = 20; // Number of cafes per page
  
  interface CafesResponse {
	hits: MeiliSearchCafe[];
	totalHits: number;
	page: number;
	hitsPerPage: number;
	processingTimeMs: number;
  }
  
  type CafesQueryKey = [
	string,
	number,
	number,
	string,
	Record<string, any>,
	boolean,
  ];
  
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
		const searchParams = new URLSearchParams();
		searchParams.append("lat", lat.toString());
		searchParams.append("lng", lng.toString());
  
		// Determine the search radius based on filters
		let searchRadius = SEARCH_RADIUS;
		for (const [key, value] of Object.entries(searchFilters)) {
		  if (value && key !== "gmaps_rating" && key !== "gmaps_total_reviews") {
			searchRadius = SEARCH_WITH_FILTERS_RADIUS;
			break;
		  }
		}
		searchParams.append("radius", searchRadius.toString());
  
		searchParams.append("page", pageParam.toString());
		searchParams.append("hitsPerPage", PAGE_SIZE.toString());
		searchParams.append("isIncludeDetails", isIncludeDetails.toString());
  
		if (searchTerm) {
		  searchParams.append("q", searchTerm);
		}
  
		for (const [key, value] of Object.entries(searchFilters)) {
			if (value) {
				if (key === "gmaps_rating" || key === "gmaps_total_reviews") {
					searchParams.append(key, value);
				} else {
					searchParams.append(`${key}_mode`, value);
				}
			}
		}
  
		const response = await fetch(`${import.meta.env.VITE_MEILISEARCH_URL}/api/search?${searchParams.toString()}`);
  
		if (!response.ok) {
		  throw new Error("Failed to fetch cafes");
		}
  
		const data: CafesResponse = await response.json();

		data.hits = data.hits.map((cafe: MeiliSearchCafe) => ({
			...cafe,
			images: cafe.images.map((image: { url: string, label: string | null }) => ({
				url: image.url,
				label: image.label,
			})),
		}));
		return data;
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
	  getNextPageParam: (lastPage) =>
		lastPage.hits.length === PAGE_SIZE ? lastPage.page + 1 : undefined,
	  staleTime: 1000 * 60 * 5, // 5 minutes
	  refetchOnWindowFocus: false,
	});
  };