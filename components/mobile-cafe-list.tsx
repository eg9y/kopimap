import { Sheet, SheetRef } from 'react-modal-sheet';
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";
import { Badge } from "./catalyst/badge";
import { useCafes } from "@/hooks/use-cafes";
import useMedia from "react-use/esm/useMedia";
import { ChevronUp, ChevronDown, Map, List } from 'lucide-react';
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

interface CafeListProps {
  searchInput: string;
}

export const MobileCafeList: React.FC<CafeListProps> = ({ searchInput }) => {
  const { selectCafe, mapRef, mapCenter } = useStore();
  const isWide = useMedia("(min-width: 640px)");
  const sheetRef = useRef<SheetRef>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  const {
    data,
    // isLoading,
    // error,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage
  } = useCafes(mapCenter.lat, mapCenter.long, searchInput);

  const allCafes = data?.pages.flatMap(page => page.cafes) ?? [];

  const handleSnap = useCallback((snapIndex: number) => {
    setCurrentSnapIndex(snapIndex);
  }, []);

  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  mapRef?.current?.on?.("move", () => {
    snapTo(2);
  });

  // Dynamic snap points based on screen height
  const snapPoints = [
    window.innerHeight - 60, // Almost full screen, leaving space for status bar
    window.innerHeight / 2,  // Half screen
    60                       // Minimal view showing just the header
  ];

  useEffect(() => {
    const handleResize = () => {
      snapPoints[0] = window.innerHeight - 60;
      snapPoints[1] = window.innerHeight / 2;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCafeClick = (cafe: MeiliSearchCafe) => {
    selectCafe(cafe);
    mapRef?.current?.flyTo({
      center: {
        lat: cafe._geo.lat! - (isWide ? 0 : 0.005),
        lon: cafe._geo.lng! - (isWide ? 0.01 : 0.0),
      },
      zoom: 14,
    });
    if (currentSnapIndex === 2) snapTo(1);  // Expand sheet if it's minimized
  };

  const sheetY = useMotionValue(0);
  const lastScrollTop = useRef(0);
  const dragStartY = useRef(0);

  const handleSheetDrag = useCallback((info: PanInfo) => {

    const newSheetY = sheetY.get() + info.delta.y;
    console.log("JANGYAY", newSheetY)
    if (newSheetY <= 0) {
      sheetY.set(0);
      snapTo(0);
    } else {
      sheetY.set(newSheetY);
    }

    // Check if dragging down at snap point 1
    if (currentSnapIndex === 1 && info.delta.y > 0) {
      const dragDistance = info.point.y - dragStartY.current;
      if (dragDistance > 50) { // Threshold for snapping to bottom
        snapTo(2);
      }
    }
  }, [sheetY, currentSnapIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop } = target;

    if (currentSnapIndex === 0) {
      if (scrollTop === 0 && lastScrollTop.current > 0) {
        // User is trying to scroll down when already at the top
        snapTo(1); // Snap to the middle point
      }
    }

    lastScrollTop.current = scrollTop;

    if (currentSnapIndex !== 0) {
      e.preventDefault();
      const scrollDelta = scrollTop;
      handleSheetDrag({ delta: { y: -scrollDelta, x: 0 }, point: { y: 0, x: 0 } } as PanInfo);
      target.scrollTop = 0;
    }
  }, [currentSnapIndex, handleSheetDrag]);

  return (
    <Sheet
      ref={sheetRef}
      isOpen={true}
      onClose={() => snapTo(2)}
      snapPoints={snapPoints}
      initialSnap={1}
      onSnap={handleSnap}
      onDrag={handleSheetDrag as any}
      className="z-[100]"
    >
      <Sheet.Container>
        <Sheet.Header className="border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">
              Places ({allCafes.length})
            </h2>
            <div className="flex items-center">
              {currentSnapIndex === 2 ? (
                <button onClick={() => snapTo(1)} className="flex items-center text-blue-500">
                  <List size={20} className="mr-1" /> View List
                </button>
              ) : (
                <button onClick={() => snapTo(2)} className="flex items-center text-blue-500">
                  <Map size={20} className="mr-1" /> View Map
                </button>
              )}
              {currentSnapIndex === 1 ? (
                <ChevronUp onClick={() => snapTo(0)} className="ml-4 text-gray-500 cursor-pointer" />
              ) : currentSnapIndex === 0 ? (
                <ChevronDown onClick={() => snapTo(1)} className="ml-4 text-gray-500 cursor-pointer" />
              ) : null}
            </div>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <motion.div
            ref={contentRef}
            style={{
              height: '100%',
              overflowY: 'auto',
              y: useTransform(
                sheetY,
                (sy) => Math.max(sy, -snapPoints[0] + snapPoints[2])
              ),
            }}
            onScroll={handleScroll}
          >
            <div className="min-h-[calc(100%+1px)] bg-white">
              {searchInput && (
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <p className="text-sm text-blue-700">Showing results for "{searchInput}"</p>
                </div>
              )}
              {allCafes.map((cafe: MeiliSearchCafe) => (
                <div
                  key={cafe.id}
                  onClick={() => handleCafeClick(cafe)}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="grow w-full">
                    <p className="font-semibold text-nowrap text-ellipsis overflow-hidden">
                      {cafe.name}
                    </p>
                    <div className="flex gap-2 my-1">
                      <Badge color="red" className="text-xs">
                        {cafe.gmaps_rating} ★ ({cafe.gmaps_total_reviews.toLocaleString("id-ID")})
                      </Badge>
                      {cafe.avg_rating && (
                        <Badge color="red" className="text-xs">
                          Our rating: {cafe.avg_rating} ({cafe.review_count})
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 text-ellipsis text-nowrap overflow-hidden">
                      {cafe.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop className="!pointer-events-none" />
    </Sheet>
  );
};
