import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { MeiliSearchCafe } from "../types";
import { useStore } from "../store";

export const useCafes = (lat: number, lng: number, searchTerm: string) => {
  const { searchFilters } = useStore();

  const fetchCafes = useCallback(async () => {

    const filterParams = new URLSearchParams();

    filterParams.append("lat", lat.toString());
    filterParams.append("lng", lng.toString());
    if (searchTerm) {
      filterParams.append("q", searchTerm);
    }

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        filterParams.append(`${key}_mode`, value);
      }
    });

    const response = await fetch(
      `${import.meta.env.VITE_MEILISEARCH_URL!}/api/search?${filterParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cafes");
    }

    const data: { hits: any[] } = await response.json();

    console.log('Search results:', data);
    return data.hits.map((cafe: MeiliSearchCafe) => ({
      gmaps_featured_image: "",
      gmaps_ratings: cafe.gmaps_rating.toString(),
      latitude: cafe._geo.lat,
      longitude: cafe._geo.lng,
      distance: cafe._geoDistance,
      ...cafe,
    }));
  }, [lat, lng, searchTerm, searchFilters]);

  return useQuery<MeiliSearchCafe[] | null, Error>({
    queryKey: ["searchCafes", lat, lng, searchFilters, searchTerm],
    queryFn: fetchCafes,
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};