import React, { useState, useRef, lazy, Suspense, useEffect, useCallback } from "react";
import { CircleXIcon, SearchIcon } from "lucide-react";
import { Sheet, SheetRef } from 'react-modal-sheet';
import useDebounce from "react-use/esm/useDebounce";
import { useStore } from "../../store";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { MobileCafeList } from "./mobile-cafe-list";
import CafeDetails from "../cafe-details";
import { useUser } from "../../hooks/use-user";
import { createClient } from "@supabase/supabase-js";
import { useUserReview } from "@/hooks/use-user-review";
import { useCafeDetailedInfo } from "@/hooks/use-cafe-detailed-info";
import useWindowSize from "react-use/esm/useWindowSize";
import { MobileSubmitReview } from "./mobile-submit-review";

const MapComponent = lazy(() => import("../map-component"));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const CafeDetailsLoader = () => (
  <div className="w-full h-full bg-white animate-pulse">
    Loading Cafe Details...
  </div>
);

export default function MobileView({ pmTilesReady }: { pmTilesReady: boolean }) {
  const { LL } = useI18nContext();
  const { mapRef, selectCafe, selectedCafe, searchInput, setSearchInput, isListDialogOpen, setIsListDialogOpen, openSubmitReviewDialog, setOpenSubmitReviewDialog } = useStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [snapPoint, setSnapPoint] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<SheetRef>();
  const { loggedInUser } = useUser();
  const { height } = useWindowSize()


  const { data: userReview } = useUserReview(
    loggedInUser?.id || null,
    selectedCafe?.id || null,
  );

  const { data: cafeDetailedInfo } = useCafeDetailedInfo(
    selectedCafe?.id || null,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    inputRef.current?.focus();
  };

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchInput);
    },
    300,
    [searchInput]
  );

  const handleSnap = (index: number) => {
    setSnapPoint(index);
  };

  const handleMapMoveEnd = useCallback(() => {
    sheetRef.current?.snapTo(2);
  }, []);

  useEffect(() => {
    if (selectedCafe) {
      setIsListDialogOpen(false)
    }
  }, [selectedCafe])


  useEffect(() => {
    const map = mapRef?.current;
    if (map?.on) {
      map.on("movestart", handleMapMoveEnd);

      // Cleanup function
      return () => {
        map.off("movestart", handleMapMoveEnd);
      };
    }
  }, [mapRef, handleMapMoveEnd]);

  const renderCollapsedContent = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{cafeDetailedInfo?.name}</h2>
    </div>
  );

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex-grow relative">
        {pmTilesReady && <MapComponent />}
        {selectedCafe && !openSubmitReviewDialog && (
          <Sheet
            ref={sheetRef}
            isOpen={true}
            onClose={() => {
              console.log("CLOSED")
              sheetRef.current?.snapTo(2);
            }}
            detent="full-height"
            snapPoints={[height - 80, height - 600, 100]}
            initialSnap={0}
            onSnap={handleSnap}
          >
            <Sheet.Container >
              <Sheet.Header />
              <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }}>
                {snapPoint === 2 && renderCollapsedContent()}
                {snapPoint === 1 &&
                  <Suspense fallback={<CafeDetailsLoader />}>
                    <CafeDetails
                      cafeDetailedInfo={cafeDetailedInfo}
                      setOpenSubmitReviewDialog={setOpenSubmitReviewDialog}
                      userReview={userReview}
                    />
                  </Suspense>}
                {snapPoint === 0 && <Sheet.Scroller draggableAt="both">
                  <Suspense fallback={<CafeDetailsLoader />}>
                    <CafeDetails
                      cafeDetailedInfo={cafeDetailedInfo}
                      setOpenSubmitReviewDialog={setOpenSubmitReviewDialog}
                      userReview={userReview}
                    />
                  </Suspense>
                </Sheet.Scroller>}
              </Sheet.Content>
            </Sheet.Container>
          </Sheet>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[1000] p-4 w-full h-[100dvh] flex flex-col pointer-events-none">
          <div
            className={`relative z-[1000] rounded-full pointer-events-auto shadow-md transition-all duration-300 ${isListDialogOpen ? 'bg-white ring-2 ring-blue-500' : 'bg-gray-100'}`}
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
                  selectCafe(null)
                  setIsListDialogOpen(true)
                }
              }}
              value={searchInput}
              className="w-full py-3 pl-12 pr-10 text-gray-900 placeholder-gray-500 bg-transparent rounded-full focus:outline-none"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CircleXIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {!selectedCafe && (
            <MobileCafeList
              searchInput={searchInput}
              setIsOpen={setIsListDialogOpen}
              isOpen={isListDialogOpen}
              inputRef={inputRef}
            />
          )}
          {openSubmitReviewDialog && (
            <MobileSubmitReview
              cafeDetailedInfo={cafeDetailedInfo}
              userReview={userReview}
              onClose={() => { setOpenSubmitReviewDialog(false) }}
            />
          )}
        </div>
      </div>

    </div>
  );
}
