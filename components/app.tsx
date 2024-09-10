import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { addProtocol, removeProtocol } from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { Suspense, lazy, useEffect, useState } from "react";
import useMedia from "react-use/esm/useMedia";
import { Toaster } from "sonner";
import { useData } from "vike-react/useData";

import "@smastrom/react-rating/style.css";

import type { MeiliSearchCafe } from "@/types";
import { useStore } from "../store";

// Lazy load components
const DesktopView = lazy(() => import("./desktop-view"));
const MobileView = lazy(() => import("./mobile/mobile-view"));

export const App = () => {
  const { openFilters, selectCafe, selectedCafe } = useStore();
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const isWide = useMedia("(min-width: 640px)", true);
  const data = useData<undefined | { cafeToSelect?: MeiliSearchCafe }>();

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

  useEffect(() => {
    document.title = selectedCafe
      ? `Kopimap | ${selectedCafe.name}`
      : `Kopimap - Discover Jakarta's Best Cafes 🗺️☕️`;
  }, [selectedCafe]);

  useEffect(() => {
    const protocol = new pmtiles.Protocol();
    addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
    return () => {
      removeProtocol("pmtiles");
    };
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }, []);

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
