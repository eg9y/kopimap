import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";

const CLUSTER_SIZE = 0.05;
const DECIMAL_PLACES = 4;

export const useMapCafes = (lat: number, lng: number) => {
  const { searchFilters } = useStore();
  const allCafesRef = useRef<Map<string, MeiliSearchCafe>>(new Map());

  const clusterKey = useMemo(() => {
    const latCluster = (Math.floor(lat / CLUSTER_SIZE) * CLUSTER_SIZE).toFixed(
      DECIMAL_PLACES
    );
    const longCluster = (Math.floor(lng / CLUSTER_SIZE) * CLUSTER_SIZE).toFixed(
      DECIMAL_PLACES
    );
    return `${latCluster},${longCluster}`;
  }, [lat, lng]);


  const fetchMapCafes = useCallback(async () => {
    const filterParams = new URLSearchParams();

    filterParams.append("lat", lat.toString());
    filterParams.append("lng", lng.toString());
    filterParams.append("radius", "3000");

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
      `${import.meta.env.VITE_MEILISEARCH_URL!}/api/search?${filterParams.toString()}`,
     
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
  }, [lat, lng, searchFilters]);

  return useQuery<
    MeiliSearchCafe[],
    Error,
    { visibleCafes: MeiliSearchCafe[]; allCafes: MeiliSearchCafe[] }
  >({
    queryKey: ["mapCafes", clusterKey, searchFilters],
    queryFn: fetchMapCafes,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      // Update the cache with new cafes
      data.forEach((cafe) => {
        allCafesRef.current.set(cafe.id, cafe);
      });

      return {
        visibleCafes: Array.from(allCafesRef.current.values()),
        allCafes: Array.from(allCafesRef.current.values()),
      };
    },
  });
};
