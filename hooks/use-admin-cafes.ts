import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export const useAdminCafes = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ["admin-cafes", page, pageSize],
    queryFn: () => fetchAdminCafes(page, pageSize),
  });
};

async function fetchAdminCafes(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: cafes, error: adminCafesError, count } = await supabase
    .from("cafe_location_view")
    .select(
      `id,
      name,
      all_image_urls,
      gmaps_total_reviews,
      hosted_gmaps_images
    `,
      { count: "exact" },
    )
    .order("gmaps_total_reviews", { ascending: false })
    .range(from, to);

  if (adminCafesError) {
    throw new Error("Error fetching admin cafes");
  }

  return {
    cafes,
    totalCount: count,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
