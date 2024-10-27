import React, { lazy, Suspense, useState } from "react";

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./catalyst/dropdown";
import { Input, InputGroup } from "./catalyst/input";

import { useI18nContext } from "@/src/i18n/i18n-react";

import useDebounce from "react-use/esm/useDebounce";
import { useStore } from "../store";
import { Button } from "./catalyst/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarSection,
  SidebarSpacer,
} from "./catalyst/sidebar";
import { Text } from "./catalyst/text";
import { ChevronDownIcon, FilterIcon, SearchIcon, XIcon } from "lucide-react";

const CafeList = lazy(() => import("../components/cafe-list"));
const CafeListSkeleton = lazy(() => import("../components/cafe-list-skeleton"));

interface MainSidebarProps {
  children: React.ReactNode;
}

export default function MainSidebar({ children }: MainSidebarProps) {
  const { LL } = useI18nContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFeatureRoadmapOpen, setIsFeatureRoadmapOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { setOpenFilters, openFilters, searchFilters, setSearchFilters } =
    useStore();

  const [showSidebar, setShowSidebar] = useState(false);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchInput);
    },
    300,
    [searchInput]
  );

  const handleRatingChange = (value: string) => {
    if (value) {
      setSearchFilters({ ...searchFilters, gmaps_rating: value });
    } else {
      const newFilters = { ...searchFilters };
      delete newFilters.gmaps_rating;
      setSearchFilters(newFilters);
    }
  };

  const handleTotalReviewsChange = (value: string) => {
    if (value) {
      setSearchFilters({ ...searchFilters, gmaps_total_reviews: value });
    } else {
      const newFilters = { ...searchFilters };
      delete newFilters.gmaps_total_reviews;
      setSearchFilters(newFilters);
    }
  };

  return (
    <div className="relative flex w-full bg-white dark:bg-zinc-900 rounded-lg overflow-hidden size-full">
      {/* Sidebar */}
      <aside
        className={` w-[430px] bg-white dark:bg-zinc-900 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } translate-x-0`}
      >
        <Sidebar>
          <SidebarHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <div>
                  <Text>{LL.appDescription()}</Text>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 w-full">
                <InputGroup className="w-full">
                  <SearchIcon />
                  <Input
                    name="search"
                    placeholder={LL.searchCafes()}
                    aria-label={LL.searchCafes()}
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    autoComplete="off"
                    className="w-[calc(300px_-_2rem)]"
                  />
                </InputGroup>
                {searchInput && (
                  <Button
                    plain
                    aria-label="Clear search"
                    className="cursor-pointer"
                    onClick={() => {
                      setSearchInput("");
                      setDebouncedSearchTerm("");
                    }}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <Dropdown>
                  <DropdownButton outline className="grow">
                    <p className="text-xs">
                      {searchFilters.gmaps_rating
                        ? `>=${searchFilters.gmaps_rating}⭐️`
                        : "Rating"}
                    </p>
                    <ChevronDownIcon />
                  </DropdownButton>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleRatingChange("")}>
                      Any
                    </DropdownItem>
                    <DropdownItem onClick={() => handleRatingChange("1")}>
                      ⭐️
                    </DropdownItem>
                    <DropdownItem onClick={() => handleRatingChange("2")}>
                      ⭐️⭐️
                    </DropdownItem>
                    <DropdownItem onClick={() => handleRatingChange("3")}>
                      ⭐️⭐️⭐️
                    </DropdownItem>
                    <DropdownItem onClick={() => handleRatingChange("4")}>
                      ⭐️⭐️⭐️⭐️
                    </DropdownItem>
                    <DropdownItem onClick={() => handleRatingChange("5")}>
                      ⭐️⭐️⭐️⭐️⭐️
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownButton outline className="grow">
                    <p className="text-xs">
                      {searchFilters.gmaps_total_reviews
                        ? `>=${searchFilters.gmaps_total_reviews} reviews`
                        : "Total Reviews"}
                    </p>
                    <ChevronDownIcon />
                  </DropdownButton>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleTotalReviewsChange("")}>
                      Any
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleTotalReviewsChange("10")}
                    >
                      10{">"}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleTotalReviewsChange("50")}
                    >
                      50{">"}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleTotalReviewsChange("100")}
                    >
                      100{">"}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleTotalReviewsChange("500")}
                    >
                      500{">"}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Button
                color="orange"
                className="cursor-pointer"
                onClick={() => setOpenFilters(!openFilters)}
              >
                <FilterIcon className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </SidebarHeader>
          <SidebarBody className="overflow-y-hidden">
            <SidebarSection className=" h-full">
              {/* {(isSearchLoading || isMapCafesLoading) && <Text>Loading</Text>} */}
              {/* {(searchError || mapCafesError) && (
									<Text color="red">
										{JSON.stringify(searchError || mapCafesError)}
									</Text>
								)} */}
              <Suspense fallback={<CafeListSkeleton />}>
                <CafeList searchInput={debouncedSearchTerm} />
              </Suspense>
            </SidebarSection>
            <SidebarSpacer />
          </SidebarBody>
        </Sidebar>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Main content area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Search Filters</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Distance</Label>
            <Input name="amount" placeholder="$0.00" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Search</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isFeatureRoadmapOpen} onClose={setIsFeatureRoadmapOpen}>
        <DialogTitle>Upcoming Features</DialogTitle>
        <DialogDescription>
          Here are the list of features coming soon...
        </DialogDescription>
        <DialogBody>
          <ul className="list-disc">
            <li>Ratings filter</li>
            <li>Total ratings filter</li>
            <li>Mushola filter</li>
            <li>Chain cafes filter</li>
            <li>Mobile support</li>
          </ul>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsFeatureRoadmapOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
