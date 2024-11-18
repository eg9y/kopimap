import { addProtocol, removeProtocol } from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { Suspense, lazy, useEffect, useState } from "react";
import { useMedia, useIsomorphicLayoutEffect } from "react-use";
import { Toaster } from "sonner";
import { useData } from "vike-react/useData";

import "@smastrom/react-rating/style.css";

import type { MeiliSearchCafe } from "@/types";
import { useStore } from "../store";
import MobileView from "./mobile/mobile-view";
import {
  isPlatform,
  capacitorServices,
  Style,
} from "@/components/lib/platform";

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
      const isNative = await isPlatform.capacitor();
      if (!isNative) return;

      const statusBar = await capacitorServices.statusBar();
      if (!statusBar) return;

      await statusBar.setStyle({ style: Style.Dark });
      await statusBar.setOverlaysWebView({ overlay: false });
    };

    setupNativePlatform();
  }, []);

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
