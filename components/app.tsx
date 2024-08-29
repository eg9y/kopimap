import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { addProtocol, removeProtocol } from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { Suspense, lazy, useEffect, useState } from "react";
import useMedia from "react-use/esm/useMedia";
import { Toaster } from "sonner";
import { navigatorDetector } from "typesafe-i18n/detectors";
import { useData } from "vike-react/useData";

import "@smastrom/react-rating/style.css";

import TypesafeI18n from "@/src/i18n/i18n-react";
import { detectLocale } from "@/src/i18n/i18n-util";
import { loadLocaleAsync } from "@/src/i18n/i18n-util.async";
import type { MeiliSearchCafe } from "@/types";
import { useStore } from "../store";

// Lazy load components
const DesktopView = lazy(() => import("./desktop-view"));
const MobileView = lazy(() => import("./mobile-view"));

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
      <Suspense fallback={<div>Loading...</div>}>
        {isWide ? (
          <div className="flex w-[100vw] h-[100dvh] overflow-hidden">
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
    </TypesafeI18n>
  );
};
