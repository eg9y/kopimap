import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";
import { ReviewWithStringMusholla } from "@/types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);


const fetchUserReview = async (userId: string, cafeId: string): Promise<ReviewWithStringMusholla | null> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("cafe_place_id", cafeId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No matching row found
    }
    throw error;
  }

  if (!data) {
    return null;
  }

  // Convert has_musholla to string
  const convertedData: ReviewWithStringMusholla = {
    ...data,
    has_musholla: data.has_musholla === null ? null : data.has_musholla ? "Yes" : "No"
  };

  return convertedData;
};

export const useUserReview = (userId: string | null, cafeId: string | null) => {
  return useQuery<ReviewWithStringMusholla | null, Error>({
    queryKey: ["userReview", userId, cafeId],
    queryFn: () => fetchUserReview(userId!, cafeId!),
    enabled: !!userId && !!cafeId,
  });
};
