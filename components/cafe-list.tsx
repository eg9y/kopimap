import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useStore } from "../store";
import type { MeiliSearchCafe } from "../types";
import { Badge, BadgeButton } from "./catalyst/badge";
import {
  SidebarHeading,
  SidebarItem,
  SidebarSection,
} from "./catalyst/sidebar";
import { useCafes } from "@/hooks/use-cafes";
import CafeListSkeleton from "./cafe-list-skeleton";

interface CafeListProps {
  searchInput: string;
}

export default function CafeList({ searchInput }: CafeListProps) {
  const { selectCafe, mapRef, searchFilters, setSearchFilters, mapCenter } =
    useStore();
  const [showSkeleton, setShowSkeleton] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCafes(mapCenter.lat, mapCenter.long, searchInput);

  const parentRef = useRef<HTMLDivElement>(null);

  const allCafes = data?.pages.flatMap((page) => page.cafes) ?? [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allCafes.length + 1 : allCafes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && !data) {
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 2000);
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, data]);

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allCafes.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allCafes.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  const removeSearchFilter = (key: string) => {
    const temp = { ...searchFilters };
    delete temp[key];
    setSearchFilters(temp);
  };

  // Add this function to create a URL-friendly slug
  function createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const handleCafeSelect = (cafe: MeiliSearchCafe) => {
    selectCafe(cafe);
    mapRef?.current?.flyTo({
      center: {
        lat: cafe._geo.lat,
        lon: cafe._geo.lng - 0.01,
      },
      zoom: 14,
    });
    const url = new URL(window.location.href);
    url.searchParams.set("cafe", createSlug(cafe.name));
    url.searchParams.set("place_id", cafe.id);
    window.history.pushState({ triggeredBy: "user" }, "", url.toString());
  };

  if (showSkeleton && !data) {
    return <CafeListSkeleton />;
  }

  return (
    <SidebarSection className="max-lg:hidden h-full flex flex-col">
      <SidebarHeading className="flex-shrink-0">
        <p className="text-base">
          {searchInput || Object.keys(searchFilters).length > 0
            ? "Results"
            : "Cafe Terdekat"}{" "}
          ({allCafes.length})
        </p>
      </SidebarHeading>
      <div className="flex-shrink-0">
        {Object.entries(searchFilters).map(([key, val]) => (
          <BadgeButton key={key} onClick={() => removeSearchFilter(key)}>
            {key.replace(/_/g, " ")}: {val}
          </BadgeButton>
        ))}
      </div>
      {error && (
        <p className="flex-shrink-0">Error: {(error as Error).message}</p>
      )}
      <div ref={parentRef} className="flex-grow overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const cafe = allCafes[virtualRow.index];
            const isLoaderRow = virtualRow.index > allCafes.length - 1;
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    "Loading more..."
                  ) : (
                    "No more cafes to load"
                  )
                ) : (
                  <SidebarItem onClick={() => handleCafeSelect(cafe)}>
                    <div className="grow w-full">
                      <div>
                        <p className="text-nowrap text-ellipsis overflow-hidden">
                          {cafe.name}
                        </p>
                        <div className="flex gap-2">
                          <Badge className="grow">
                            gmaps rating: {cafe.gmaps_rating} (
                            {cafe.gmaps_total_reviews.toLocaleString("id-ID")})
                          </Badge>
                          <Badge className="grow">
                            rating:{" "}
                            {cafe.avg_rating
                              ? `${cafe.avg_rating} (${cafe.review_count})`
                              : "-"}
                          </Badge>
                        </div>
                        <p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
                          {cafe.address}
                        </p>
                      </div>
                    </div>
                  </SidebarItem>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {isFetching && (
        <div className="flex-shrink-0 p-2 text-center">Updating...</div>
      )}
    </SidebarSection>
  );
}
