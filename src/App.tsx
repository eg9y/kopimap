import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import * as pmtiles from "pmtiles";
import maplibregl from "maplibre-gl";
import useMedia from "react-use/lib/useMedia";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

import "@smastrom/react-rating/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { CafeDetails } from "./components/cafe-details";
import { MainSidebar } from "./components/main-sidebar";
import { MemoizedMapComponent } from "./components/map-component";
import i18n from "./il8n";
import { SearchFilters } from "./components/search-filters";
import { useStore } from "./store";
import { MobileBar } from "./mobile-bar";

function App() {
  // const { t } = useTranslation();
  const { openFilters } = useStore();
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const isWide = useMedia("(min-width: 640px)");

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

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex w-[100vw] h-[100dvh] overflow-hidden">
        {isWide && (
          <MainSidebar>
            <div className="rounded-lg overflow-hidden grow relative h-full">
              <MemoizedMapComponent pmTilesReady={pmTilesReady}>
                {openFilters && (
                  <div className="z-[90] absolute w-[200px] h-full top-0 left-0 flex flex-col justify-end">
                    <SearchFilters />
                  </div>
                )}
                <AnimatePresence>
                  <CafeDetails />
                </AnimatePresence>
              </MemoizedMapComponent>
            </div>
          </MainSidebar>
        )}
        {!isWide && (
          <MemoizedMapComponent pmTilesReady={pmTilesReady}>
            <MobileBar />
          </MemoizedMapComponent>
        )}
      </div>
      <Toaster />
    </I18nextProvider>
  );
}

export default App;
