import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import * as pmtiles from "pmtiles";
import maplibregl from "maplibre-gl";
import { QueryClient, QueryClientProvider } from "react-query";

import "@smastrom/react-rating/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { CafeDetails } from "./components/cafe-details";
import { MainSidebar } from "./components/main-sidebar";
import { MemoizedMapComponent } from "./components/map-component";

const queryClient = new QueryClient();

function App() {
  const [pmTilesReady, setPmTilesReady] = useState(false);

  useEffect(() => {
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-[100vw] h-[100vh]">
        <MainSidebar>
          <div className="rounded-lg overflow-hidden grow relative h-full">
            <MemoizedMapComponent pmTilesReady={pmTilesReady}>
              <AnimatePresence>
                <CafeDetails />
              </AnimatePresence>
            </MemoizedMapComponent>
          </div>
        </MainSidebar>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
