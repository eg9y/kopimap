import React, { useState, useRef, lazy } from "react";
import useDebounce from "react-use/esm/useDebounce";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useCafes } from "../hooks/use-cafes";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useStore } from "../store";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { Button } from "konsta/react";
import { MobileListTemp } from "./mobile-list-temp";
import { HomeIcon, UserIcon } from "@heroicons/react/20/solid";
import { Tabbar, TabbarLink } from "konsta/react";

const MapComponent = lazy(() => import("../components/map-component"));

export default function MobileView({ pmTilesReady }: { pmTilesReady: boolean }) {
  const { LL } = useI18nContext();
  const { mapCenter } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    data: searchCafes,
  } = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);
  const {
    data: mapCafesData,
  } = useMapCafes(mapCenter.lat, mapCenter.long);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchInput);
    },
    300,
    [searchInput]
  );

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-grow relative">
        {pmTilesReady && <MapComponent />}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-40 p-4 w-full h-[100dvh] flex flex-col pointer-events-none">
          <div
            className={`relative z-50 rounded-full  pointer-events-auto shadow-md transition-all duration-300 ${isListDialogOpen ? 'bg-white ring-2 ring-blue-500' : 'bg-gray-100'}`}
          >
            <input
              ref={inputRef}
              type="text"
              name="search"
              autoCorrect="off"
              autoComplete="off"
              placeholder={LL.searchCafes()}
              aria-label={LL.searchCafes()}
              onChange={handleSearch}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  setIsListDialogOpen(true)
                }
              }}
              value={searchInput}
              className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 bg-transparent rounded-full focus:outline-none"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <MobileListTemp
            searchInput={searchInput}
            setIsOpen={setIsListDialogOpen}
            isOpen={isListDialogOpen}
            inputRef={inputRef}
          />
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button
          onClick={() => setIsListDialogOpen(true)}
          className="w-full !h-12 flex justify-center items-center bg-blue-500 text-white font-semibold"
        >
          {isListDialogOpen ? 'Hide Cafes' : 'See Cafes'}
        </Button>
      </div>

      <Tabbar className="flex-shrink-0">
        <TabbarLink
          active={false}
          onClick={() => { }}
          icon={<HomeIcon className="w-6 h-6" />}
          label="Home"
        />
        <TabbarLink
          active={false}
          onClick={() => { }}
          icon={<UserIcon className="w-6 h-6" />}
          label="Login"
        />
      </Tabbar>
    </div>
  );
}
