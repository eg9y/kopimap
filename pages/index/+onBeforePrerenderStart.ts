import { createClient } from "@supabase/supabase-js";
import type { OnBeforePrerenderStartAsync } from "vike/types";

const BASE_URL = import.meta.env.VITE_URL || "https://kopimap.com";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BATCH_SIZE = 1000; // Adjust this value based on your needs and Supabase limits

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    let allCafes: any[] = [];
    let hasMore = true;
    let lastId = 0;

    while (hasMore) {
      const { data: cafes, error } = await supabase
        .from("cafes")
        .select("id, name, place_id")
        .order("id", { ascending: true })
        .gt("id", lastId)
        .limit(BATCH_SIZE);

      if (error) {
        console.error("Error fetching cafes:", error);
        return [];
      }

      if (cafes.length > 0) {
        allCafes = [...allCafes, ...cafes];
        lastId = cafes[cafes.length - 1].id;
      }

      hasMore = cafes.length === BATCH_SIZE;
    }

    const urls = allCafes.map((cafe) => {
      return {
        url: `/?cafe=${encodeURIComponent(cafe.name)}&place_id=${cafe.place_id}`,
        pageContext: {
          data: {
            title: cafe.name,
          },
        },
      };
    });

    return urls;
  };
