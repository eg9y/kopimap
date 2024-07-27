import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import useMedia from "react-use/lib/useMedia";

import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";
import { Badge, BadgeButton } from "./catalyst/badge";

interface CafeListProps {
  searchInput: string;
  mapCafes: { visibleCafes: MeiliSearchCafe[], allCafes: MeiliSearchCafe[] } | undefined;
  searchCafes: MeiliSearchCafe[] | null | undefined;
}

const SEARCH_BAR_HEIGHT = 44; 
const MIN_HEIGHT = 14; 
const DEFAULT_HEIGHT = 40; 

export const MobileCafeList: React.FC<CafeListProps> = ({ searchInput, mapCafes, searchCafes }) => {
  const { selectCafe, mapRef, searchFilters, setSearchFilters } = useStore();
  const [listHeight, setListHeight] = useState(DEFAULT_HEIGHT);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isWide = useMedia("(min-width: 640px)");

  const displayedCafes = (searchInput || Object.keys(searchFilters).length > 0) ? (searchCafes || []) : (mapCafes?.visibleCafes || []);
  const totalCafes = mapCafes?.allCafes?.length || 0;

  const removeSearchFilter = (key: string) => {
    const temp = { ...searchFilters };
    delete temp[key];
    setSearchFilters(temp);
  };

  const calculateMaxHeight = () => {
    if (typeof window !== 'undefined') {
      const windowHeight = window.innerHeight;
      const maxHeightPx = windowHeight - SEARCH_BAR_HEIGHT;
      return (maxHeightPx / window.innerHeight) * 100;
    }
    return 100;
  };

  const snapToNearestState = (currentHeight: number) => {
    const maxHeight = calculateMaxHeight();
    const states = [MIN_HEIGHT, DEFAULT_HEIGHT, maxHeight];
    return states.reduce((prev, curr) =>
      Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev
    );
  };
  
  const animateToHeight = (targetHeight: number) => {
    const currentHeight = parseFloat(containerRef.current!.style.height) / window.innerHeight * 100;
    const distance = Math.abs(targetHeight - currentHeight);
    const duration = Math.min(0.3, distance / 500); // Adjust duration based on distance, max 300ms
  
    controls.set({
      height: `calc(${currentHeight}vh - ${SEARCH_BAR_HEIGHT}px)`
    });
    controls.start({
      height: `calc(${targetHeight}vh - ${SEARCH_BAR_HEIGHT}px)`,
      transition: { type: "spring", stiffness: 300, damping: 30, duration }
    });
  };

  const bind = useDrag(({ event, last }) => {
    const maxHeight = calculateMaxHeight();
    
    // Calculate the new height based on the finger position
    const fingerPositionY = (event as TouchEvent).touches?.[0]?.clientY || (event as MouseEvent).clientY;
    const newHeight = ((window.innerHeight - fingerPositionY) / window.innerHeight) * 100;
    
    // Clamp the new height between MIN_HEIGHT and maxHeight
    const clampedHeight = Math.max(MIN_HEIGHT, Math.min(maxHeight, newHeight));
  
    if (last) {
      // When drag ends, snap to nearest state and animate
      const snappedHeight = snapToNearestState(clampedHeight);
      animateToHeight(snappedHeight);
      setListHeight(snappedHeight);
    } else {
      // During drag, update height immediately without animation
      containerRef.current!.style.height = `calc(${clampedHeight}vh - ${SEARCH_BAR_HEIGHT}px)`;
    }
  }, {
    from: () => [0, listHeight],
    filterTaps: true,
    bounds: { top: -window.innerHeight + SEARCH_BAR_HEIGHT, bottom: window.innerHeight - SEARCH_BAR_HEIGHT },
    rubberband: true
  });

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current && listHeight === calculateMaxHeight()) {
        const { scrollTop } = listRef.current;
        if (scrollTop === 0) {
          const snappedHeight = snapToNearestState(listHeight);
          animateToHeight(snappedHeight);
          setListHeight(snappedHeight);
        }
      }
    };
  
    listRef.current?.addEventListener('scroll', handleScroll);
    return () => listRef.current?.removeEventListener('scroll', handleScroll);
  }, [listHeight]);

  return (
    <motion.div 
      ref={containerRef}
      animate={controls}
      initial={{ height: `calc(${DEFAULT_HEIGHT}vh - ${SEARCH_BAR_HEIGHT}px)` }}
      className="bg-slate-100 overflow-hidden absolute bottom-0 left-0 right-0 rounded-t-lg shadow-lg"
    >
      <div className="h-full flex flex-col">
        <div 
          {...bind()}
          className="drag-handle p-4 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Results ({displayedCafes.length}
              {!searchInput && Object.keys(searchFilters).length === 0 && ` of ${totalCafes} total`})
            </h2>
            {listHeight <= DEFAULT_HEIGHT && (
              <button 
                onClick={() => {
                  const maxHeight = calculateMaxHeight();
                  animateToHeight(maxHeight);
                  setListHeight(maxHeight);
                }}
                className="text-blue-500"
              >
                Show More
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {Object.entries(searchFilters).map(([key, val]) => (
              <BadgeButton key={key} onClick={() => removeSearchFilter(key)}>
                {key.replace(/_/g, " ")}: {val}
              </BadgeButton>
            ))}
          </div>
        </div>

        <div ref={listRef} className="overflow-y-auto flex-grow">
          {displayedCafes.map((cafe: MeiliSearchCafe) => (
            <div
              key={cafe.id}
              onClick={() => {
                selectCafe(cafe);
                mapRef?.current?.flyTo({
                  center: {
                    lat: cafe._geo.lat! - (isWide ? 0 : 0.005),
                    lon: cafe._geo.lng! -  (isWide ? 0.01 : 0.0),
                  },
                  zoom: 14,
                });
              }}
              className="p-4 border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="grow w-full">
                <p className="font-semibold text-nowrap text-ellipsis overflow-hidden">{cafe.name}</p>
                <div className="flex gap-2 my-1">
                  <Badge className="grow">gmaps rating: {cafe.gmaps_rating} ({cafe.gmaps_total_reviews.toLocaleString("id-ID")})</Badge>
                  <Badge className="grow">rating: {cafe.avg_rating ? `${cafe.avg_rating} (${cafe.review_count})` : "-"}</Badge>
                </div>
                <p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
                  {cafe.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};