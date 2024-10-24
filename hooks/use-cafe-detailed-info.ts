import { useQuery } from "@tanstack/react-query";
import type { CafeDetailedInfo } from "../types";

const fetchCafeDetailedInfo = async (
  cafeId: string
): Promise<CafeDetailedInfo> => {
  const response = await fetch(`${import.meta.env.VITE_MEILISEARCH_URL}/api/cafe-detailed-info/${cafeId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useCafeDetailedInfo = (cafeId: string | null) => {
  return useQuery<CafeDetailedInfo>({
    queryKey: ["cafeDetailedInfo", cafeId],
    queryFn: () => fetchCafeDetailedInfo(cafeId!),
    enabled: !!cafeId,
  });
};
