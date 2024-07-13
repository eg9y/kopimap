// searchUtils.ts
import { useState, useCallback } from "react";
import { useStore } from "../store";
import { MeiliSearchCafe, SearchFilters } from "../types";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the setFetchedCafes function from the Zustand store
  const setFetchedCafes = useStore((state) => state.setFetchedCafes);

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
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      try {
        const response = await fetch(
          `${import.meta.env
            .VITE_MEILISEARCH_URL!}/api/search?${params.toString()}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();

        console.log("data", data);

        // Update the fetched cafes in the Zustand store
        const parsedCafes = data.hits.map((cafe: MeiliSearchCafe) => ({
          gmaps_featured_image: "", // Not provided in the Meilisearch response
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
    [searchTerm, filters, setFetchedCafes]
  );

  const handleFilterChange = (name: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleSearch,
    isLoading,
    error,
  };
};
