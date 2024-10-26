import { useCafeDetailedInfo } from "@/hooks/use-cafe-detailed-info";
import { useUserReview } from "@/hooks/use-user-review";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { createClient } from "@supabase/supabase-js";
import { CircleXIcon, SearchIcon, ArrowLeftIcon } from "lucide-react";
import React, {
  useState,
  useRef,
  lazy,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import useDebounce from "react-use/esm/useDebounce";
import useWindowSize from "react-use/esm/useWindowSize";
import { useUser } from "../../hooks/use-user";
import { useStore } from "../../store";
import CafeDetails from "../cafe-details";
import { MobileCafeList } from "./mobile-cafe-list";
import { MobileSubmitReview } from "./mobile-submit-review";
import { MobileSearchFilters } from "./mobile-search-filters";

const MapComponent = lazy(() => import("../map-component"));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CafeDetailsLoader = () => (
  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse">
    Loading Cafe Details...
  </div>
);

export default function MobileView({
  pmTilesReady,
}: {
  pmTilesReady: boolean;
}) {
  const { LL } = useI18nContext();
  const {
    mapRef,
    selectCafe,
    selectedCafe,
    searchInput,
    setSearchInput,
    isListDialogOpen,
    setIsListDialogOpen,
    openSubmitReviewDialog,
    setOpenSubmitReviewDialog,
  } = useStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [snapPoint, setSnapPoint] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<SheetRef>();
  const { loggedInUser } = useUser();
  const { height } = useWindowSize();

  const { data: userReview } = useUserReview(
    loggedInUser?.id || null,
    selectedCafe?.id || null
  );

  const { data: cafeDetailedInfo } = useCafeDetailedInfo(
    selectedCafe?.id || null
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

  const handleSnap = useCallback((index: number) => {
    setSnapPoint(index);
  }, []);

  const handleSheetClose = useCallback(() => {
    if (snapPoint === 1) {
      selectCafe(null);
    } else if (snapPoint === 0) {
      sheetRef.current?.snapTo(1);
    }
  }, [snapPoint, selectCafe]);

  useEffect(() => {
    if (selectedCafe) {
      setIsListDialogOpen(false);
    }
  }, [selectedCafe]);

  useEffect(() => {
    const map = mapRef?.current;
    if (map?.on) {
      const handleClusterClick = (e: any) => {
        // Assuming clusters have a specific layer id, e.g., 'clusters'
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point"],
        });

        if (features.length) {
          // If a cluster is clicked, snap to 1
          sheetRef.current?.snapTo(1);
        }
      };

      map.on("click", handleClusterClick);

      // Cleanup function
      return () => {
        map.off("click", handleClusterClick);
      };
    }
  }, [mapRef]);

  const handleBackToList = useCallback(() => {
    selectCafe(null);
    setIsListDialogOpen(true);
  }, [selectCafe, setIsListDialogOpen]);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex-grow relative">
        {pmTilesReady && <MapComponent />}
        {selectedCafe && !openSubmitReviewDialog && (
          <>
            <Sheet
              ref={sheetRef}
              isOpen={true}
              onClose={handleSheetClose}
              detent="full-height"
              snapPoints={[height - 80 - 56, 200]}
              initialSnap={1}
              onSnap={handleSnap}
              className="!bottom-[56px]"
            >
              <Sheet.Container className="!bg-white dark:!bg-gray-800">
                <Sheet.Content
                  className="!bg-white dark:!bg-gray-800"
                  style={{ paddingBottom: sheetRef.current?.y }}
                >
                  {snapPoint === 1 && (
                    <Suspense fallback={<CafeDetailsLoader />}>
                      <CafeDetails
                        cafeDetailedInfo={cafeDetailedInfo}
                        setOpenSubmitReviewDialog={setOpenSubmitReviewDialog}
                        userReview={userReview}
                      />
                    </Suspense>
                  )}
                  {snapPoint === 0 && (
                    <Sheet.Scroller draggableAt="both">
                      <Suspense fallback={<CafeDetailsLoader />}>
                        <CafeDetails
                          cafeDetailedInfo={cafeDetailedInfo}
                          setOpenSubmitReviewDialog={setOpenSubmitReviewDialog}
                          userReview={userReview}
                        />
                      </Suspense>
                    </Sheet.Scroller>
                  )}
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop />
            </Sheet>
            <button
              onClick={handleBackToList}
              className="fixed left-4 bottom-[68px] z-[10000000] p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg"
              aria-label="Back to list"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[1000] p-4 w-full h-[100dvh] flex flex-col pointer-events-none">
          <div
            className={`relative z-[1000] rounded-lg pointer-events-auto shadow-md transition-all duration-300 ${
              isListDialogOpen
                ? "bg-white dark:bg-gray-800 ring-2 ring-blue-500 dark:ring-blue-400"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
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
                if (e.key === "Enter" || e.keyCode === 13) {
                  selectCafe(null);
                  setIsListDialogOpen(true);
                }
              }}
              value={searchInput}
              className="w-full py-3 pl-12 pr-10 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent rounded-lg focus:outline-none"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CircleXIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
              </button>
            )}
          </div>
          {!selectedCafe && !isListDialogOpen && (
            <div className="mt-2 pointer-events-auto rounded-lg overflow-hidden">
              <MobileSearchFilters />
            </div>
          )}
          {!selectedCafe && (
            <MobileCafeList
              searchInput={searchInput}
              setIsOpen={setIsListDialogOpen}
              isOpen={isListDialogOpen}
              inputRef={inputRef}
            />
          )}
          {openSubmitReviewDialog && cafeDetailedInfo && (
            <MobileSubmitReview
              cafeDetailedInfo={cafeDetailedInfo}
              userReview={userReview}
              onClose={() => {
                setOpenSubmitReviewDialog(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
