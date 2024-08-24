import React, { useState, useRef, useEffect } from "react";
import useDebounce from "react-use/esm/useDebounce";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useCafes } from "../hooks/use-cafes";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useStore } from "../store";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { Button } from "konsta/react";
import { MobileListTemp } from "./mobile-list-temp";

export default function MobileBar() {
  const { LL } = useI18nContext();
  const { mapCenter } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchCafes,
    // isLoading: isSearchLoading,
    // error: searchError,
  } = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);

  const {
    data: mapCafesData,
    // isLoading: isMapCafesLoading,
    // error: mapCafesError,
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

  const handleSearchBarClick = () => {
    setIsListDialogOpen(true);
  };

  const toggleListDialog = () => {
    setIsListDialogOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40 p-4 w-full">
        <div
          className={`relative rounded-full shadow-md transition-all duration-300 ${isListDialogOpen ? 'bg-white ring-2 ring-blue-500' : 'bg-gray-100'
            }`}
          onClick={handleSearchBarClick}
        >
          <input
            ref={inputRef}
            type="text"
            name="search"
            autoCorrect="false"
            autoComplete="false"
            placeholder={LL.searchCafes()}
            aria-label={LL.searchCafes()}
            onChange={handleSearch}
            value={searchInput}
            className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 bg-transparent rounded-full focus:outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <MobileListTemp
        searchInput={searchInput}
        setIsOpen={setIsListDialogOpen}
        isOpen={isListDialogOpen}
        inputRef={inputRef}
      />
      <Button
        onClick={toggleListDialog}
        className="bottom-10 left-0 !h-20 absolute z-50 w-full flex justify-center items-end"
      >
        {isListDialogOpen ? 'Hide Cafes' : 'See Cafes'}
      </Button>
    </>
  );
}
