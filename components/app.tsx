import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { AnimatePresence } from "framer-motion";
import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { Suspense, lazy, useEffect, useState } from "react";
import useMedia from "react-use/esm/useMedia";
import { Toaster } from "sonner";
import { navigatorDetector } from "typesafe-i18n/detectors";
import { useData } from "vike-react/useData";

import "maplibre-gl/dist/maplibre-gl.css";
import "@smastrom/react-rating/style.css";

import TypesafeI18n from "@/src/i18n/i18n-react";
import { detectLocale } from "@/src/i18n/i18n-util";
import { loadLocaleAsync } from "@/src/i18n/i18n-util.async";
import type { MeiliSearchCafe } from "@/types";
import { useStore } from "../store";
import MainSidebar from "./main-sidebar";
import MobileBar from "./mobile-bar";

const MemoizedMapComponent = lazy(() => import("../components/map-component"));
const SearchFilters = lazy(() => import("../components/search-filters"));
const CafeDetails = lazy(() => import("../components/cafe-details"));

// Loading components
const MapComponentLoader = () => (
	<div className="w-full h-full bg-gray-200 animate-pulse">Loading Map...</div>
);
const SearchFiltersLoader = () => (
	<div className="w-[200px] h-full bg-gray-100 animate-pulse">
		Loading Filters...
	</div>
);
const CafeDetailsLoader = () => (
	<div className="w-full h-full bg-white animate-pulse">
		Loading Cafe Details...
	</div>
);

export const App = () => {
	const { openFilters, selectCafe, selectedCafe } = useStore();
	const [pmTilesReady, setPmTilesReady] = useState(false);
	const isWide = useMedia("(min-width: 640px)", true);
	const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (data?.cafeToSelect) {
			selectCafe({
				gmaps_ratings: data.cafeToSelect.gmaps_rating.toString(),
				latitude: data.cafeToSelect._geo.lat,
				longitude: data.cafeToSelect._geo.lng,
				distance: data.cafeToSelect._geoDistance,
				...data.cafeToSelect,
			});
		}
	}, [data]);

	useEffect(() => {
		document.title = selectedCafe
			? `Kopimap | ${selectedCafe.name}`
			: `Kopimap - Discover Jakarta's Best Cafes 🗺️☕️`;
	}, [selectedCafe]);

	useEffect(() => {
		const protocol = new pmtiles.Protocol();
		maplibregl.addProtocol("pmtiles", protocol.tile);
		setPmTilesReady(true);
	}, []);

	useEffect(() => {
		if (Capacitor.isNativePlatform()) {
			StatusBar.setStyle({ style: Style.Dark });
			StatusBar.setOverlaysWebView({ overlay: false });
		}
	}, []);

	// Detect locale
	const locale = detectLocale(navigatorDetector);

	// Load locales
	const [localesLoaded, setLocalesLoaded] = useState(false);
	useEffect(() => {
		loadLocaleAsync(locale).then(() => setLocalesLoaded(true));
	}, [locale]);

	if (!localesLoaded) {
		return null;
	}

	return (
		<TypesafeI18n locale={locale}>
			<div className="flex w-[100vw] h-[100dvh] overflow-hidden">
				{isWide && (
					<MainSidebar>
						<div className="rounded-lg overflow-hidden grow relative h-full">
							<Suspense fallback={<MapComponentLoader />}>
								{openFilters && (
									<div className="z-[90] absolute w-[200px] h-full top-0 left-0 flex flex-col justify-end">
										<Suspense fallback={<SearchFiltersLoader />}>
											<SearchFilters />
										</Suspense>
									</div>
								)}
								<AnimatePresence>
									<Suspense fallback={<CafeDetailsLoader />}>
										<CafeDetails />
									</Suspense>
								</AnimatePresence>
								<MemoizedMapComponent
									pmTilesReady={pmTilesReady}
								></MemoizedMapComponent>
							</Suspense>
						</div>
					</MainSidebar>
				)}
				{!isWide && (
					<Suspense fallback={<MapComponentLoader />}>
						<MobileBar />
						<MemoizedMapComponent
							pmTilesReady={pmTilesReady}
						></MemoizedMapComponent>
					</Suspense>
				)}
			</div>
			<Toaster />
		</TypesafeI18n>
	);
};
