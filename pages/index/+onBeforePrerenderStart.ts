import { Database } from "@/components/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import type { OnBeforePrerenderStartAsync } from "vike/types";

const BASE_URL = import.meta.env.VITE_URL || "https://kopimap.com";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BATCH_SIZE = 1000; // Adjust this value based on your needs and Supabase limits

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    let allCafes: {
      id: number | null;
      name: string | null;
      place_id: string | null;
      all_image_urls: string[] | null;
      gmaps_featured_image: string | null;
      website: string | null;
      phone: string | null;
    }[] = [];
    let hasMore = true;
    let lastId = 0;

    while (hasMore) {
      const { data: cafes, error } = await supabase
        .from("cafe_location_view")
        .select(
          "id, name, place_id, all_image_urls, gmaps_featured_image, website, phone"
        )
        .order("id", { ascending: true })
        .gt("id", lastId)
        .limit(BATCH_SIZE);

      if (error) {
        console.error("Error fetching cafes:", error);
        return [];
      }

      if (cafes.length > 0) {
        allCafes = [...allCafes, ...cafes];
        lastId = cafes[cafes.length - 1].id!;
      }

      hasMore = cafes.length === BATCH_SIZE;
    }

    const urls = allCafes.map((cafe) => {
      return {
        url: `/?cafe=${encodeURIComponent(cafe.name!)}&place_id=${cafe.place_id}`,
        pageContext: {
          data: {
            name: cafe.name,
            image:
              cafe.all_image_urls && cafe.all_image_urls.length > 0
                ? cafe.all_image_urls[0]
                : cafe.gmaps_featured_image || null,
            website: cafe.website,
            phone: cafe.phone,
          },
        },
      };
    });

    return urls;
  };
