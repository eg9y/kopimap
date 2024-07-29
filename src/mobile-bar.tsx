// MobileBar.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "./store";
import { useState } from "react";
import useDebounce from "react-use/esm/useDebounce";
import { useCafes } from "./hooks/use-cafes";
import { useMapCafes } from "./hooks/use-map-cafes";
import { Input, InputGroup } from "./components/catalyst/input";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { MobileCafeList } from "./components/mobile-cafe-list";

export const MobileBar: React.FC = () => {
  const { t } = useTranslation();
  const { mapCenter } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data: searchCafes,
    isLoading: isSearchLoading,
    error: searchError,
  } = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);
  const {
    data: mapCafesData,
    isLoading: isMapCafesLoading,
    error: mapCafesError,
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
    <>
      <div className="absolute top-0 left-0 right-0 z-20 p-2 w-[calc(100vw_-_40px)]">
        <InputGroup className="">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <Input
            name="search"
            placeholder={t("searchCafes")}
            aria-label={t("search")}
            onChange={handleSearch}
            value={searchInput}
            autoComplete="off"
            className=""
          />
        </InputGroup>
      </div>

      {/* {(isSearchLoading || isMapCafesLoading) && (
        <div className="absolute top-16 left-0 right-0 z-20 p-4 bg-white">
          <p>{t("loading")}</p>
        </div>
      )}
      
      {(searchError || mapCafesError) && (
        <div className="absolute top-16 left-0 right-0 z-20 p-4 bg-white">
          <p className="text-red-500">{JSON.stringify(searchError || mapCafesError)}</p>
        </div>
      )} */}

      <MobileCafeList
        searchInput={searchInput}
        mapCafes={mapCafesData}
        searchCafes={searchCafes}
      />
    </>
  );
};
