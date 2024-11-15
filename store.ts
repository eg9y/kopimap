import { createRef, MutableRefObject } from "react";
import { MapRef } from "react-map-gl";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Cafe, MeiliSearchCafe } from "./types";

// Split into two interfaces - one for persistent state and one for non-persistent state
interface PersistentState {
	selectedCafe: Cafe | null;
	mapCenter: {
		lat: number;
		long: number;
	};
	expandDetails: boolean;
	openFilters: boolean;
	fetchedCafes: MeiliSearchCafe[];
	searchFilters: Record<string, string>;
	searchInput: string;
	isListDialogOpen: boolean;
	openSubmitReviewDialog: boolean;
}

interface NonPersistentState {
	selectCafe: (cafe: any | null) => void;
	setMapCenter: (center: { lat: number; long: number }) => void;
	mapRef: MutableRefObject<MapRef> | undefined;
	setMapRef: (element: MapRef | undefined) => void;
	setExpandDetails: (expand: boolean) => void;
	setOpenFilters: (expand: boolean) => void;
	setFetchedCafes: (cafes: MeiliSearchCafe[]) => void;
	setSearchFilters: (filters: Record<string, string>) => void;
	setSearchInput: (input: string) => void;
	setIsListDialogOpen: (isOpen: boolean) => void;
	setOpenSubmitReviewDialog: (isOpen: boolean) => void;
	// Image modal state - now part of non-persistent state
	selectedImageModalIndex: number | null;
	setSelectedImageModalIndex: (index: number | null) => void;
}

type Store = PersistentState & NonPersistentState;

export const useStore = create<Store>()(
	devtools(
		persist(
			(set) => ({
				// Persistent state
				selectedCafe: null,
				mapCenter: {
					lat: -6.274163,
					long: 106.789514505,
				},
				expandDetails: false,
				openFilters: false,
				fetchedCafes: [],
				searchFilters: {},
				searchInput: "",
				isListDialogOpen: false,
				openSubmitReviewDialog: false,

				// Non-persistent state and actions
				selectCafe(cafe) {
					set(() => ({ selectedCafe: cafe }));
					set(() => ({ openFilters: false }));
				},
				setMapCenter: (center) => set({ mapCenter: center }),
				mapRef: createRef<MapRef>() as MutableRefObject<MapRef> | undefined,
				setMapRef: (element: MapRef | undefined) => {
					if (!element) return;
					const newRef = createRef() as MutableRefObject<MapRef>;
					newRef.current = element;
					set({ mapRef: newRef });
				},
				setExpandDetails: (expand: boolean) => set({ expandDetails: expand }),
				setOpenFilters: (expand: boolean) => {
					set(() => ({ openFilters: expand }));
					if (expand) {
						set(() => ({ selectedCafe: null }));
					}
				},
				setFetchedCafes: (cafes: MeiliSearchCafe[]) => {
					set({ fetchedCafes: cafes });
				},
				setSearchFilters: (filters) => set({ searchFilters: filters }),
				setSearchInput: (input: string) => set({ searchInput: input }),
				setIsListDialogOpen: (isOpen: boolean) =>
					set({ isListDialogOpen: isOpen }),
				setOpenSubmitReviewDialog: (isOpen: boolean) =>
					set({ openSubmitReviewDialog: isOpen }),

				// Image modal state - non-persistent
				selectedImageModalIndex: null,
				setSelectedImageModalIndex: (index: number | null) =>
					set({ selectedImageModalIndex: index }),
			}),
			{
				name: "map-storage",
				storage: {
					getItem: (key) => {
						const value = sessionStorage.getItem(key);
						return value ? JSON.parse(value) : null;
					},
					setItem: (key, valueObj) => {
						// Type the value parameter
						const value = valueObj;
						const persistedState = {
							selectedCafe: value.state.selectedCafe,
							mapCenter: value.state.mapCenter,
							expandDetails: value.state.expandDetails,
							openFilters: value.state.openFilters,
							fetchedCafes: value.state.fetchedCafes,
							searchFilters: value.state.searchFilters,
							searchInput: value.state.searchInput,
							isListDialogOpen: value.state.isListDialogOpen,
							openSubmitReviewDialog: value.state.openSubmitReviewDialog,
						};
						sessionStorage.setItem(key, JSON.stringify(persistedState));
					},
					removeItem: (key) => {
						sessionStorage.removeItem(key);
					},
				},
			},
		),
	),
);
