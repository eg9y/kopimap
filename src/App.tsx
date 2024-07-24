import { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import * as pmtiles from "pmtiles";
import maplibregl from "maplibre-gl";
import useMedia from "react-use/lib/useMedia";
import useDebounce from "react-use/esm/useDebounce";

import "@smastrom/react-rating/style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { CafeDetails } from "./components/cafe-details";
import { MainSidebar } from "./components/main-sidebar";
import { MemoizedMapComponent } from "./components/map-component";
import i18n from "./il8n";
import { Input, InputGroup } from "./components/catalyst/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

function App() {
  const { t } = useTranslation();
  const [pmTilesReady, setPmTilesReady] = useState(false);
  const isWide = useMedia("(min-width: 640px)");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchInput);
    },
    300,
    [searchInput]
  );

  useEffect(() => {
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex w-[100vw] h-[100vh] overflow-hidden">
        <MainSidebar searchInput={searchInput} debouncedSearchTerm={debouncedSearchTerm}>
          <div className="rounded-lg overflow-hidden grow relative h-full">
            <MemoizedMapComponent pmTilesReady={pmTilesReady}>
              <div className="absolute top-3 left-3 right-3 flex gap-2">
                {/* <Button color="dark/zinc">Grid View</Button> */}
                <InputGroup className="">
                  <MagnifyingGlassIcon />
                  <Input
                    name="search"
                    placeholder={t("searchCafes")}
                    aria-label={t("search")}
                    onChange={handleSearch}
                    value={searchInput}
                    className="!w-[400px]"
                    autoComplete="off"
                  />
                </InputGroup>
              </div>
              {isWide && (
                <AnimatePresence>
                  <CafeDetails />
                </AnimatePresence>
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