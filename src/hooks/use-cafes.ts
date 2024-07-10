import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const CLUSTER_SIZE = 0.05; // Approximately 1km
const DECIMAL_PLACES = 4; // Number of decimal places to use for clustering

export const useCafes = (
  lat: number,
  long: number,
  fetchedCafes: {
    id: number;
    name: string;
    gmaps_featured_image: string;
    gmaps_ratings: string;
    latitude: number;
    longitude: number;
    distance: number;
  }[]
) => {
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
    const { data, error } = await supabase.rpc("nearby_cafes", {
      lat,
      long,
      excluded_ids: [],
      max_distance: 3000,
    });
    if (error) {
      console.log(error);
      return [];
    }
    return data || [];
  }, [lat, long, fetchedCafes]);

  return useQuery<
    | {
        id: number;
        name: string;
        gmaps_featured_image: string;
        gmaps_ratings: string;
        latitude: number;
        longitude: number;
        distance: number;
      }[]
    | null
  >({
    queryKey: ["cafes", clusterKey],
    queryFn: fetchCafes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
