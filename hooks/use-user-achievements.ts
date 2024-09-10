import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export const useUserAchievements = (userId: string) => {
  return useQuery({
    queryKey: ["userAchievements", userId],
    queryFn: () => fetchUserAchievements(userId),
  });
};

async function fetchUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_profile_id", userId)
    .single();

  if (error) {
    throw new Error("Error fetching user achievements");
  }

  return data;
}
