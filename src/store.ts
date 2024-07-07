import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { MutableRefObject, createRef } from "react";
import { MapRef } from "react-map-gl";
import { SelectedCafe } from "./types";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./components/lib/database.types";

interface MapState {
  selectedCafe: SelectedCafe | null;
  selectCafe: (cafe: any | null) => Promise<void>;
  cafes: any[];
  setCafes: (cafes: any[]) => void;
  mapRef: MutableRefObject<MapRef> | undefined;
  setMapRef: (element: MapRef | undefined) => void;
  expandDetails: boolean;
  setExpandDetails: (expand: boolean) => void;
}

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const useStore = create<MapState>()(
  devtools(
    persist(
      (set) => ({
        selectedCafe: null,
        async selectCafe(cafe) {
          let aggregateReview:
            | Database["public"]["Tables"]["cafe_aggregated_reviews"]["Row"]
            | null = null;

          if (cafe) {
            const { data, error } = await supabase
              .from("cafe_aggregated_reviews")
              .select("*")
              .eq("cafe_place_id", cafe.place_id)
              .single();

            // "PGRST116" === no item found
            if (error && error.code !== "PGRST116") {
              console.log(error);
              throw new Error(`${JSON.stringify(error)}`);
            }

            aggregateReview = data;
          }
          console.log("cafe", cafe);

          set(() => ({
            selectedCafe: cafe ? { ...cafe, ...aggregateReview } : null,
          }));
        },
        cafes: [],
        setCafes(cafes) {
          set(() => ({ cafes }));
        },
        mapRef: createRef<MapRef>() as MutableRefObject<MapRef> | undefined,
        setMapRef: (element: MapRef | undefined) => {
          if (!element) {
            return;
          }
          const newRef = createRef() as MutableRefObject<MapRef>;
          newRef.current = element;
          set({ mapRef: newRef });
        },
        expandDetails: false,
        setExpandDetails: (expand: boolean) => set({ expandDetails: expand }),
      }),
      {
        name: "map-storage",
      }
    )
  )
);
