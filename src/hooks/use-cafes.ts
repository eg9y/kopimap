import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";
import { useQuery, useQueryClient } from "react-query";
import { useCallback, useRef } from "react";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const useCafes = (lat: number, long: number) => {
  const queryClient = useQueryClient();
  const excludedIdsRef = useRef<number[]>([]);

  const fetchCafes = useCallback(async () => {
    const { data, error } = await supabase.rpc("nearby_cafes", {
      lat,
      long,
      excluded_ids: excludedIdsRef.current,
    });

    if (error) throw new Error(error.message);

    // Sort the cafes by distance
    const sortedCafes = data.sort((a, b) => {
      const distanceA = calculateDistance(lat, long, a.latitude, a.longitude);
      const distanceB = calculateDistance(lat, long, b.latitude, b.longitude);
      return distanceA - distanceB;
    });

    // Update excluded IDs
    excludedIdsRef.current = [
      ...excludedIdsRef.current,
      ...sortedCafes.map((cafe) => cafe.id),
    ];

    return sortedCafes;
  }, [lat, long]);

  const { data: newCafes, ...rest } = useQuery(
    ["cafes", lat, long],
    fetchCafes,
    {
      // keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Combine new cafes with existing ones
  const allCafes = useCallback(() => {
    const existingCafes = queryClient.getQueryData<any[]>(["allCafes"]) || [];
    if (newCafes) {
      const updatedCafes = [...existingCafes, ...newCafes].filter(
        (cafe, index, self) => index === self.findIndex((t) => t.id === cafe.id)
      );
      queryClient.setQueryData(["allCafes"], updatedCafes);
      return updatedCafes;
    }
    return existingCafes;
  }, [newCafes, queryClient]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(["cafes", lat, long]);
  }, [queryClient, lat, long]);

  return {
    data: allCafes(),
    ...rest,
    refetch,
  };
};

// The useCafeAggregatedReview hook remains unchanged
export const useCafeAggregatedReview = (placeId: string | null) => {
  return useQuery(
    ["cafeAggregatedReview", placeId],
    () => fetchCafeAggregatedReview(placeId),
    {
      enabled: !!placeId,
    }
  );
};

const fetchCafeAggregatedReview = async (placeId: string | null) => {
  if (!placeId) {
    return null;
  }
  const { data, error } = await supabase
    .from("cafe_aggregated_reviews")
    .select("*")
    .eq("cafe_place_id", placeId)
    .single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return data;
};
