import { useQuery } from "@tanstack/react-query";
import { ReviewWithStringMusholla } from "@/types";


export const useUserReview = (userId: string | null, cafeId: string | null) => {
  const fetchUserReview = async (userId: string, cafeId: string): Promise<ReviewWithStringMusholla | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_MEILISEARCH_URL}/api/cafe-reviews?cafe_place_id=${cafeId}&user_id=${userId}`,
      );
  
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No review found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform has_musholla to string
    if (data) {
      data.has_musholla = data.has_musholla === true ? "Yes" : data.has_musholla === false ? "No" : null;
    }
  
      return data;
    } catch (error) {
      console.error('Error fetching user review:', error);
      throw error;
    }
  };

  
  return useQuery<ReviewWithStringMusholla | null, Error>({
    queryKey: ["userReview", userId, cafeId],
    queryFn: () => fetchUserReview(userId!, cafeId!),
    enabled: !!userId && !!cafeId,
  });
};
