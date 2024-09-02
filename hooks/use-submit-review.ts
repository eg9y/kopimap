import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Database } from "../components/lib/database.types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const submitReview = async (
  reviewData: Omit<
    Database["public"]["Tables"]["reviews"]["Insert"],
    "id" | "created_at"
  >
): Promise<any> => {
  const { data, error } = await supabase
    .from("reviews")
    .upsert(reviewData, { onConflict: "user_id,cafe_id" });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useSubmitReview = (
  onSuccess: () => void,
  placeId: string | null,
  userId: string | null
) => {
  const queryClient = useQueryClient();

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
