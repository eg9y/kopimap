import { createClient } from "@supabase/supabase-js";
import type { OnBeforePrerenderStartAsync } from "vike/types";

const BASE_URL = import.meta.env.VITE_URL || "https://kopimap.com";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    const { data: cafes, error } = await supabase
      .from("cafes")
      .select("name, place_id");

    console.log("jangjai", cafes);
    if (error) {
      console.error("Error fetching cafes:", error);
      return [];
    }

    const urls = cafes.map((cafe) => {
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
