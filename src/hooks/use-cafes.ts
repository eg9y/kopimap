import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { MeiliSearchCafe } from "../types";

const CLUSTER_SIZE = 0.05; // Approximately 1km
const DECIMAL_PLACES = 4; // Number of decimal places to use for clustering

export const useCafes = (lat: number, long: number) => {
  // Cluster coordinates
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
    const response = await fetch(
      `${import.meta.env
        .VITE_MEILISEARCH_URL!}/api/search?q=&lat=${lat}&lng=${long}&radius=3000`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cafes");
    }
    const data: { hits: any[] } = (await response.json()) ?? { hits: [] };
    return data.hits.map((cafe: MeiliSearchCafe) => ({
      gmaps_featured_image: "", // Not provided in the Meilisearch response
      gmaps_ratings: cafe.gmaps_rating.toString(),
      latitude: cafe._geo.lat,
      longitude: cafe._geo.lng,
      distance: cafe._geoDistance,
      ...cafe,
    }));
  }, [lat, long]);

  return useQuery<MeiliSearchCafe[]>({
    queryKey: ["cafes", clusterKey],
    queryFn: fetchCafes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
