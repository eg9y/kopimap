import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { MeiliSearchCafe } from "../types";
import { useStore } from "../store";

const CLUSTER_SIZE = 0.05;
const DECIMAL_PLACES = 4;

export const useCafes = (lat: number, long: number) => {
  const { searchFilters } = useStore();

  const clusterKey = useMemo(() => {
    const latCluster = (Math.floor(lat / CLUSTER_SIZE) * CLUSTER_SIZE).toFixed(
      DECIMAL_PLACES
    );
    const longCluster = (
      Math.floor(long / CLUSTER_SIZE) * CLUSTER_SIZE
    ).toFixed(DECIMAL_PLACES);
    return `${latCluster},${longCluster}`;
  }, [lat, long]);

  const fetchCafes = useCallback(async () => {
    const filterParams = new URLSearchParams();

    // Add location parameters
    filterParams.append("lat", lat.toString());
    filterParams.append("lng", long.toString());
    filterParams.append("radius", "3000");

    // Add filter parameters
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
    return data.hits.map((cafe: MeiliSearchCafe) => ({
      gmaps_featured_image: "",
      gmaps_ratings: cafe.gmaps_rating.toString(),
      latitude: cafe._geo.lat,
      longitude: cafe._geo.lng,
      distance: cafe._geoDistance,
      ...cafe,
    }));
  }, [lat, long, searchFilters]);

  return useQuery<MeiliSearchCafe[]>({
    queryKey: ["cafes", clusterKey, searchFilters],
    queryFn: fetchCafes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
