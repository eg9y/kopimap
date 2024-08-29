import React, { useState, useRef, lazy, Suspense, useEffect, useCallback } from "react";
import { CircleXIcon, MapIcon, SearchIcon, UserIcon } from "lucide-react";
import { Sheet, SheetRef } from 'react-modal-sheet';
import useDebounce from "react-use/esm/useDebounce";
import { useStore } from "../store";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { Button, Sheet as KonstaSheet, Toolbar, Link, Block } from "konsta/react";
import { MobileCafeList } from "./mobile-cafe-list";
import { Tabbar, TabbarLink } from "konsta/react";
import CafeDetails from "./cafe-details";
import { useUser } from "../hooks/use-user";
import { createClient } from "@supabase/supabase-js";
import { Avatar } from "./catalyst/avatar";
import { useUserReview } from "@/hooks/use-user-review";
import { useCafeDetailedInfo } from "@/hooks/use-cafe-detailed-info";
import { PanInfo } from "framer-motion";
import useWindowSize from "react-use/esm/useWindowSize";

const MapComponent = lazy(() => import("../components/map-component"));

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
  const { mapRef, selectCafe, selectedCafe } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const [openSubmitReviewDialog, setOpenSubmitReviewDialog] = useState(false);
  const [snapPoint, setSnapPoint] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<SheetRef>();
  const { loggedInUser } = useUser();
  const { height } = useWindowSize();


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

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_URL,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleUserAction = () => {
    if (loggedInUser) {
      setIsUserSheetOpen(true);
    } else {
      handleSignIn();
    }
  };

  const handleSnap = (index: number) => {
    setSnapPoint(index);
    if (index === 2) {
      // Additional logic for map interaction when in small collapsed view
    }
  };

  const handleMapMoveEnd = useCallback(() => {
    sheetRef.current?.snapTo(2);
  }, []);


  useEffect(() => {
    const map = mapRef?.current;
    if (map?.on) {
      map.on("moveend", handleMapMoveEnd);

      // Cleanup function
      return () => {
        map.off("moveend", handleMapMoveEnd);
      };
    }
  }, [mapRef, handleMapMoveEnd]);

  const renderCollapsedContent = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{cafeDetailedInfo?.name}</h2>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-grow relative">
        {pmTilesReady && <MapComponent />}
        {selectedCafe && (
          <Sheet
            ref={sheetRef}
            isOpen={true}
            onClose={() => { }}
            detent="full-height"
            snapPoints={[height - 80, 400, 100]}
            initialSnap={0}
            onSnap={handleSnap}
          >
            <Sheet.Container >
              <Sheet.Header />
              <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }}>
                {snapPoint === 2 ? renderCollapsedContent() : (
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
          </Sheet>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-40 p-4 w-full h-[100dvh] flex flex-col pointer-events-none">
          <div
            className={`relative z-50 rounded-full pointer-events-auto shadow-md transition-all duration-300 ${isListDialogOpen ? 'bg-white ring-2 ring-blue-500' : 'bg-gray-100'}`}
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
        </div>
      </div>
      <Tabbar className="flex-shrink-0">
        <TabbarLink
          active={true}
          onClick={() => {
            if (isListDialogOpen) {
              selectCafe(null)
            }
            setIsListDialogOpen((isListOpen) => !isListOpen)
            setSearchInput("")
          }}
          icon={<MapIcon className="w-6 h-6" />}
          label={isListDialogOpen ? 'Hide Cafes' : 'See Cafes'}
        />
        {
          // <TabbarLink
          //   active={false}
          //   onClick={() => { }}
          //   icon={<DicesIcon className="w-6 h-6" />}
          //   label="Activity"
          // />
        }
        <TabbarLink
          active={false}
          onClick={handleUserAction}
          icon={loggedInUser ?
            <Avatar
              src={loggedInUser.user_metadata.avatar_url}
              className="w-6 h-6"
              square
              alt=""
            /> :
            <UserIcon className="w-6 h-6" />
          }
          label={loggedInUser ? loggedInUser.user_metadata.name : LL.loginToReview()}
        />
      </Tabbar>
      <KonstaSheet
        className="pb-safe w-full"
        opened={isUserSheetOpen}
        onBackdropClick={() => setIsUserSheetOpen(false)}
      >
        <Toolbar top>
          <div className="left" />
          <div className="right">
            <Link toolbar onClick={() => setIsUserSheetOpen(false)}>
              Close
            </Link>
          </div>
        </Toolbar>
        <Block>
          {loggedInUser && (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  src={loggedInUser.user_metadata.avatar_url}
                  className="w-16 h-16"
                  square
                  alt=""
                />
                <div>
                  <p className="font-semibold">{loggedInUser.user_metadata.name}</p>
                  <p className="text-sm text-gray-500">{loggedInUser.email}</p>
                </div>
              </div>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          )}
        </Block>
      </KonstaSheet>
    </div>
  );
}
