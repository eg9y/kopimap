// useSubmitReview.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "../components/lib/database.types";
import { useUser } from "./use-user";
import { ReviewWithStringMusholla } from "@/types";



export const useSubmitReview = (
  onSuccess: () => void,
  placeId: string | null,
  userId: string | null
) => {
  const queryClient = useQueryClient();
  const { loggedInUser, sessionInfo } = useUser();

  const submitReview = async (
    reviewData: any
  ): Promise<{ id: string }> => {
    console.log('reviewData', reviewData);
    const finalReviewData: any = { ...reviewData };  
    if (reviewData.has_musholla === 'Yes') {
      finalReviewData.has_musholla = true;
    } else if (reviewData.has_musholla === 'No') {
      finalReviewData.has_musholla = false;
    }
    const response = await fetch(
      `${import.meta.env.VITE_MEILISEARCH_URL!}/api/review`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionInfo?.access_token}`,
        },
        body: JSON.stringify(reviewData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cafeAggregatedReview", placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReview", userId, placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cafeDetailedInfo", placeId],
      });
      if (loggedInUser) {
        queryClient.invalidateQueries({
          queryKey: ["userAchievements", loggedInUser.id],
        });
      }
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: `There was an error submitting your review: ${error.message}. Please try again.`,
        position: "top-right",
      });
    },
  });
};
