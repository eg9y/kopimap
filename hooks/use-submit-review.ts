// useSubmitReview.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Database } from "../components/lib/database.types";
import { useUser } from "./use-user";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const checkAchievement = async (userId: string) => {
  // Check if this is the user's first review
  const { count: reviewCount, error: countError } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  if (reviewCount && reviewCount === 1) {
    // This is the user's first review, update achievements
    const { error: achievementError } = await supabase
      .from("achievements")
      .upsert(
        {
          user_profile_id: userId,
          first_review: true,
        },
        { onConflict: "user_profile_id" }
      );

    if (achievementError) {
      throw new Error(achievementError.message);
    }
  }
};

const submitReview = async (
  reviewData: Omit<
    Database["public"]["Tables"]["reviews"]["Insert"],
    "id" | "created_at"
  >
): Promise<{ id: string }> => {
  const { data: reviewResponse, error: reviewError } = await supabase
    .from("reviews")
    .upsert(reviewData, { onConflict: "user_id,cafe_id" })
    .select("id")
    .single();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  await checkAchievement(reviewData.user_id!);

  return { id: reviewResponse.id };
};

export const useSubmitReview = (
  onSuccess: () => void,
  placeId: string | null,
  userId: string | null
) => {
  const queryClient = useQueryClient();
  const { loggedInUser } = useUser();

  return useMutation({
    mutationFn: (reviewData: Omit<
      Database["public"]["Tables"]["reviews"]["Insert"],
      "id" | "created_at"
    >) => submitReview(reviewData),
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
