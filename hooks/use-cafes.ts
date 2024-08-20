import { useInfiniteQuery, UseInfiniteQueryResult, QueryFunctionContext, InfiniteData } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useStore } from "../store";
import type { MeiliSearchCafe } from "../types";

const SEARCH_RADIUS = 3000; // 3km radius
const PAGE_SIZE = 20; // Number of cafes per page

interface CafesResponse {
  cafes: MeiliSearchCafe[];
  nextPage: number | undefined;
  totalHits: number;
}

type CafesQueryKey = [string, number, number, string, Record<string, any>, boolean];

export const useCafes = (
  lat: number,
  lng: number,
  searchTerm?: string,
  isIncludeDetails: boolean = true
): UseInfiniteQueryResult<InfiniteData<CafesResponse>, Error> => {
  const { searchFilters } = useStore();

  const queryKey = useMemo((): CafesQueryKey => {
    return ["cafes", lat, lng, searchTerm || "No search term", searchFilters, isIncludeDetails];
  }, [lat, lng, searchTerm, searchFilters, isIncludeDetails]);

  const fetchCafes = useCallback(async ({ pageParam = 1 }: QueryFunctionContext<CafesQueryKey, number>): Promise<CafesResponse> => {
    const filterParams = new URLSearchParams();
    filterParams.append("lat", lat.toString());
    filterParams.append("lng", lng.toString());
    filterParams.append("radius", SEARCH_RADIUS.toString());
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
      `${import.meta.env.VITE_MEILISEARCH_URL}/api/search?${filterParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cafes");
    }

    const data: { hits: any[]; totalHits: number } = await response.json();

    return {
      cafes: data.hits.map((cafe: MeiliSearchCafe) => ({
        gmaps_ratings: cafe.gmaps_rating.toString(),
        latitude: cafe._geo.lat,
        longitude: cafe._geo.lng,
        distance: cafe._geoDistance,
        ...cafe,
      })),
      nextPage: data.hits.length === PAGE_SIZE ? pageParam + 1 : undefined,
      totalHits: data.totalHits,
    };
  }, [lat, lng, searchTerm, searchFilters, isIncludeDetails]);

  return useInfiniteQuery<CafesResponse, Error, InfiniteData<CafesResponse>, CafesQueryKey, number>({
    queryKey,
    queryFn: fetchCafes,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev
  });
};
