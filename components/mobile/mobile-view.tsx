import { useCafeDetailedInfo } from "@/hooks/use-cafe-detailed-info";
import { useUserReview } from "@/hooks/use-user-review";
import { useI18nContext } from "@/src/i18n/i18n-react";
import {
  CircleXIcon,
  SearchIcon,
  ArrowLeftIcon,
  ListIcon,
  XIcon,
} from "lucide-react";
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
import { createClient, Session } from "@supabase/supabase-js";
import { Database } from "../lib/database.types";
import { Button } from "../catalyst/button";

const MapComponent = lazy(() => import("../map-component"));

const CafeDetailsLoader = () => (
  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse">
    Loading Cafe Details...
  </div>
);

const MapLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-opacity duration-300">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
    </div>
  </div>
);

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
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
    selectedImageModalIndex,
    setSelectedImageModalIndex,
  } = useStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [snapPoint, setSnapPoint] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<SheetRef>();
  const { loggedInUser } = useUser();
  const { height } = useWindowSize();
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const { data: userReview } = useUserReview(
    loggedInUser ? loggedInUser.id : null,
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
      if (listContainerRef.current) {
        listContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSessionInfo(session);
    })();
  }, []);

  const handleBackToList = useCallback(() => {
    if (selectedImageModalIndex !== null) {
      setSelectedImageModalIndex(null);
      return;
    }

    selectCafe(null);
    setIsListDialogOpen(true);
  }, [selectCafe, setIsListDialogOpen, selectedImageModalIndex]);

  return (
    <>
      {/* Map container that covers full screen including safe areas */}
      <div className="absolute inset-0 bottom-[calc(56px+var(--safe-area-bottom))] z-[1000]">
        {!pmTilesReady && <MapLoader />}
        {pmTilesReady && <MapComponent />}
      </div>

      {/* UI Layer that respects safe areas */}
      <div className="absolute inset-0 pt-[var(--safe-area-top)] pb-[calc(56px+var(--safe-area-bottom))] flex flex-col pointer-events-none">
        {/* Search and filters container */}
        <div className="px-4 z-[1000]">
          <div
            className={`relative rounded-lg pointer-events-auto shadow-md transition-all duration-300 ${
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
            <img
              src="https://map-assets.kopimap.com/favicon/apple-icon-60x60.png"
              alt="logo kopimap"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
            />
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
        </div>

        {/* List and other UI components - enable pointer events */}
        <div className="flex-1 pointer-events-auto">
          {!selectedCafe && (
            <MobileCafeList
              searchInput={debouncedSearchTerm}
              setIsOpen={setIsListDialogOpen}
              isOpen={isListDialogOpen}
              inputRef={inputRef}
              containerRef={listContainerRef}
            />
          )}

          {selectedCafe && !openSubmitReviewDialog && (
            <>
              <Sheet
                ref={sheetRef}
                isOpen={true}
                onClose={handleSheetClose}
                detent="full-height"
                snapPoints={[height - 80 - 56, 200]}
                initialSnap={0}
                onSnap={handleSnap}
                className="!bottom-[56px] pointer-events-auto"
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
                            setOpenSubmitReviewDialog={
                              setOpenSubmitReviewDialog
                            }
                            userReview={userReview}
                          />
                        </Suspense>
                      </Sheet.Scroller>
                    )}
                  </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
              </Sheet>
              <div className="fixed left-0 right-0 bottom-[calc(76px+var(--safe-area-bottom))] z-[10000000] flex justify-center pointer-events-auto">
                <button
                  onClick={handleBackToList}
                  className="px-4 py-2 border drop-shadow-lg border-yellow-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-slate-300 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-2 font-bold"
                  aria-label="Back to list"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Kembali</span>
                </button>
              </div>
            </>
          )}
          {openSubmitReviewDialog && cafeDetailedInfo && sessionInfo && (
            <MobileSubmitReview
              cafeDetailedInfo={cafeDetailedInfo}
              userReview={userReview}
              onClose={() => {
                setOpenSubmitReviewDialog(false);
              }}
              sessionInfo={sessionInfo}
            />
          )}
          {openSubmitReviewDialog && cafeDetailedInfo && !sessionInfo && (
            <div className="pointer-events-auto z-[10000] dark:bg-slate-800 mx-2 p-4 flex flex-col items-center rounded-xl bg-white shadow-xl top-[40%] absolute inset-x-0 max-w-md">
              <h2 className="text-xl font-bold mb-2">
                {LL.submitReview.createReview()}
              </h2>
              <p className="mb-4">{LL.submitReview.pleaseLogin()}</p>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: import.meta.env.VITE_URL,
                      },
                    });
                  }}
                  color="green"
                  className="cursor-pointer"
                >
                  {LL.submitReview.login()}
                </Button>
                <Button
                  onClick={async () => {
                    setOpenSubmitReviewDialog(false);
                  }}
                  plain
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Floating buttons container */}
        <div className="absolute bottom-[calc(76px+var(--safe-area-bottom))] left-0 right-0 flex justify-center pointer-events-auto">
          <button
            onClick={() => setIsListDialogOpen(!isListDialogOpen)}
            className="px-4 py-2 drop-shadow-lg border border-yellow-500 z-[1000000] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-slate-300 font-bold rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-2"
            aria-label={
              isListDialogOpen ? "Tutup daftar kafe" : "Buka daftar kafe"
            }
          >
            {isListDialogOpen ? (
              <>
                <XIcon className="h-5 w-5" />
                <span>Tutup</span>
              </>
            ) : (
              <>
                <ListIcon className="h-5 w-5" />
                <span>Daftar Kafe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
