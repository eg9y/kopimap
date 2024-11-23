import { addProtocol, removeProtocol } from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { Suspense, lazy, useEffect, useState } from "react";
import { useMedia, useIsomorphicLayoutEffect } from "react-use";
import { Toaster } from "sonner";
import { useData } from "vike-react/useData";
import ky from "ky";

import "@smastrom/react-rating/style.css";

import type { MeiliSearchCafe } from "@/types";
import { useStore } from "../store";
import MobileView from "./mobile/mobile-view";

// Lazy load components
const DesktopView = lazy(() => import("./desktop-view"));

export const App = () => {
  const { openFilters, selectCafe, selectedCafe } = useStore();
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isWide = useMedia("(min-width: 640px)", false);
  const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();

  // Handle mounting
  useIsomorphicLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle cafe selection from URL
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
  }, [data, selectCafe]);

  // Handle document title
  useEffect(() => {
    document.title = selectedCafe
      ? `Kopimap | ${selectedCafe.name}`
      : `Kopimap - Discover Jakarta's Best Cafes 🗺️☕️`;
  }, [selectedCafe]);

  // Initialize PMTiles
  useEffect(() => {
    const protocol = new pmtiles.Protocol();
    addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
    return () => {
      removeProtocol("pmtiles");
    };
  }, []);

  // Handle native platform setup
  useEffect(() => {
    const setupNativePlatform = async () => {
      // Check if we're in a Capacitor environment
      const isCapacitor = "Capacitor" in window;
      if (!isCapacitor) return;

      try {
        const { Capacitor } = await import("@capacitor/core");
        const { StatusBar, Style } = await import("@capacitor/status-bar");

        const isNative = Capacitor.isNativePlatform();

        if (!isNative) return;

        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (error) {
        console.error("Error setting up StatusBar:", error);
      }
    };

    setupNativePlatform();
  }, []);

  // Handle cafe loading from URL params
  useEffect(() => {

    const loadCafeFromParams = async () => {
      try {
        // Extract `place_id` directly from the URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const placeId = urlParams.get("place_id");

        console.error("placeId", placeId);

        // Only fetch if we have a place_id
        if (placeId) {
          const response = await ky.get(
            `${import.meta.env.VITE_MEILISEARCH_URL!}/api/cafe/${placeId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch cafe");
          }

          const cafeData = await response.json<MeiliSearchCafe>();

          // Use the same transformation as in the data effect
          selectCafe({
            gmaps_ratings: cafeData.gmaps_rating.toString(),
            latitude: cafeData._geo.lat,
            longitude: cafeData._geo.lng,
            distance: cafeData._geoDistance,
            ...cafeData,
          });
        }
      } catch (error) {
        console.error("Error loading cafe:", error);
      }
    };

    if (data?.cafeToSelect) {
      return;
    }


    loadCafeFromParams();
    // Empty dependency array ensures this effect runs only once
  }, [data?.cafeToSelect]);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {isWide ? (
          <div className="flex h-[calc(100dvh_-_56px-0.5rem)] overflow-hidden">
            <DesktopView
              openFilters={openFilters}
              pmTilesReady={pmTilesReady}
            />
          </div>
        ) : (
          <MobileView pmTilesReady={pmTilesReady} />
        )}
      </Suspense>
      <Toaster />
    </>
  );
};
