import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import * as pmtiles from "pmtiles";
import maplibregl from "maplibre-gl";
import useMedia from "react-use/lib/useMedia";

import "@smastrom/react-rating/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { CafeDetails } from "./components/cafe-details";
import { MainSidebar } from "./components/main-sidebar";
import { MemoizedMapComponent } from "./components/map-component";
import i18n from "./il8n";

function App() {
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const isWide = useMedia("(min-width: 640px)");

  useEffect(() => {
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex w-[100vw] h-[100vh] overflow-hidden">
        <MainSidebar>
          <div className="rounded-lg overflow-hidden grow relative h-full">
            <MemoizedMapComponent pmTilesReady={pmTilesReady}>
              {isWide && (
                <>
                  <AnimatePresence>
                    <CafeDetails />
                  </AnimatePresence>
                </>
              )}
            </MemoizedMapComponent>
          </div>
        </MainSidebar>
      </div>
      <Toaster />
    </I18nextProvider>
  );
}

export default App;
