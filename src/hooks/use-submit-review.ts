import { useMutation, useQueryClient } from "react-query";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Database } from "../components/lib/database.types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Define a type for the review data
type ReviewData = {
  user_id: string;
  cafe_id: number;
  // Add other fields as necessary
};

const submitReview = async (reviewData: ReviewData): Promise<any> => {
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
  placeId: string | null
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cafeAggregatedReview", placeId],
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
