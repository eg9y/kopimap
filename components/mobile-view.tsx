import React, { useState, useRef, lazy } from "react";
import useDebounce from "react-use/esm/useDebounce";
import { MagnifyingGlassIcon, XCircleIcon, HomeIcon, UserIcon } from "@heroicons/react/20/solid";
import { useCafes } from "../hooks/use-cafes";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useStore } from "../store";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { Button, Sheet, Toolbar, Link, Block } from "konsta/react";
import { MobileCafeList } from "./mobile-cafe-list";
import { Tabbar, TabbarLink } from "konsta/react";
import CafeDetails from "./cafe-details";
import { useUser } from "../hooks/use-user";
import { createClient } from "@supabase/supabase-js";
import { Avatar } from "./catalyst/avatar";

const MapComponent = lazy(() => import("../components/map-component"));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export default function MobileView({ pmTilesReady }: { pmTilesReady: boolean }) {
  const { LL } = useI18nContext();
  const { mapCenter, selectCafe } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { loggedInUser } = useUser();

  const {
    data: searchCafes,
  } = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);
  const {
    data: mapCafesData,
  } = useMapCafes(mapCenter.lat, mapCenter.long);

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

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-grow relative">
        {pmTilesReady && <MapComponent />}
        <CafeDetails />
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
                  setIsListDialogOpen(true)
                }
              }}
              value={searchInput}
              className="w-full py-3 pl-12 pr-10 text-gray-900 placeholder-gray-500 bg-transparent rounded-full focus:outline-none"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <MobileCafeList
            searchInput={searchInput}
            setIsOpen={setIsListDialogOpen}
            isOpen={isListDialogOpen}
            inputRef={inputRef}
          />
        </div>
      </div>
      <div className="flex-shrink-0">
        <Button
          onClick={() => {
            if (isListDialogOpen) {
              selectCafe(null)
            }
            setIsListDialogOpen((isListOpen) => !isListOpen)
            setSearchInput("")
          }}
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
      <Sheet
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
      </Sheet>
    </div>
  );
}
