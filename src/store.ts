import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { MutableRefObject, createRef } from "react";
import { MapRef } from "react-map-gl";

interface MapState {
  selectedCafe: any | null;
  selectCafe: (cafe: any | null) => void;
  cafes: any[];
  setCafes: (cafes: any[]) => void;
  mapRef: MutableRefObject<MapRef> | undefined;
  setMapRef: (element: MapRef | undefined) => void;
  expandDetails: boolean;
  setExpandDetails: (expand: boolean) => void;
}

export const useStore = create<MapState>()(
  devtools(
    persist(
      (set) => ({
        selectedCafe: null,
        selectCafe(cafe) {
          set(() => ({ selectedCafe: cafe }));
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
