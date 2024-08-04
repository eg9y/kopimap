// src/hooks/useUserReview.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../components/lib/database.types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const fetchUserReview = async (userId: string, cafeId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("cafe_place_id", cafeId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
};

export const useUserReview = (userId: string | null, cafeId: string | null) => {
  return useQuery({
    queryKey: ["userReview", userId, cafeId],
    queryFn: () => fetchUserReview(userId!, cafeId!),
    enabled: !!userId && !!cafeId,
  });
};
