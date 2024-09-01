import { MutableRefObject, createRef } from "react";
import { MapRef } from "react-map-gl";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Cafe, MeiliSearchCafe } from "./types";

interface MapState {
  selectedCafe: Cafe | null;
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
  openFilters: boolean;
  setOpenFilters: (expand: boolean) => void;
  fetchedCafes: MeiliSearchCafe[];
  setFetchedCafes: (cafes: MeiliSearchCafe[]) => void;
  searchFilters: Record<string, string>;
  setSearchFilters: (filters: Record<string, string>) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
  isListDialogOpen: boolean;
  setIsListDialogOpen: (isOpen: boolean) => void;
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
        openFilters: false,
        setOpenFilters: (expand: boolean) => set({ openFilters: expand }),
        fetchedCafes: [],
        setFetchedCafes: (cafes: MeiliSearchCafe[]) => {
          set({ fetchedCafes: cafes });
        },
        searchFilters: {},
        setSearchFilters: (filters) => set({ searchFilters: filters }),
        searchInput: "",
        setSearchInput: (input: string) => set({ searchInput: input }),
        isListDialogOpen: false,
        setIsListDialogOpen: (isOpen: boolean) => set({ isListDialogOpen: isOpen }),
      }),
      {
        name: "map-storage",
        storage: {
          getItem: (key) => {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          },
          setItem: (key, value) => {
            sessionStorage.setItem(key, JSON.stringify(value));
          },
          removeItem: (key) => {
            sessionStorage.removeItem(key);
          },
        },
      }
    )
  )
);
