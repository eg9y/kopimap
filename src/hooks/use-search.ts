import { useState, useCallback } from "react";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { searchFilters, setFetchedCafes } = useStore();

  const handleSearch = useCallback(
    async (userLocation: { lat: number | null; lng: number | null }) => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        q: searchTerm,
        ...(userLocation.lat &&
          userLocation.lng && {
            lat: userLocation.lat.toString(),
            lng: userLocation.lng.toString(),
          }),
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, v]) => v !== "").map((key, value) => [`${key}_mode`,value])
        ),
      });

      console.log('params', params);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_MEILISEARCH_URL!}/api/search?${params.toString()}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();

        console.log("data", data);

        const parsedCafes = data.hits.map((cafe: MeiliSearchCafe) => ({
          gmaps_featured_image: "",
          gmaps_ratings: cafe.gmaps_rating.toString(),
          latitude: cafe._geo.lat,
          longitude: cafe._geo.lng,
          distance: cafe._geoDistance,
          ...cafe,
        }));

        setFetchedCafes(parsedCafes);
      } catch (error) {
        console.error("Search error:", error);
        setError("An error occurred while searching. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, searchFilters, setFetchedCafes]
  );

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    isLoading,
    error,
  };
};
