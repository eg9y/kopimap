import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "../components/lib/database.types";
import type { CafeDetailedInfo } from "../types";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const fetchCafeDetailedInfo = async (
  cafeId: string
): Promise<CafeDetailedInfo> => {
  const { data, error } = await supabase
    .from("cafe_location_view")
    .select("*")
    .eq("place_id", cafeId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const useCafeDetailedInfo = (cafeId: string | null) => {
  return useQuery<CafeDetailedInfo>({
    queryKey: ["cafeDetailedInfo", cafeId],
    queryFn: () => fetchCafeDetailedInfo(cafeId!),
    enabled: !!cafeId,
  });
};
