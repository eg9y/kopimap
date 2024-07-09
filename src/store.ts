import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { MutableRefObject, createRef } from "react";
import { MapRef } from "react-map-gl";
import { SelectedCafe } from "./types";

interface MapState {
  selectedCafe: SelectedCafe | null;
  selectCafe: (cafe: any | null) => void;
  mapCenter: {
    lat: number;
    long: number;
  };
  setMapCenter: (center: { lat: number; long: number }) => void;
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
        mapCenter: {
          lat: -6.274163,
          long: 106.789514505,
        },
        setMapCenter: (center) => set({ mapCenter: center }),
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
