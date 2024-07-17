import React, { useEffect } from "react";
import {
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "./catalyst/sidebar";
import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";
import { calculateDistance } from "../components/lib/calculate-distance";
import { MeiliSearchCafe } from "../types";

export const CafeList: React.FC = () => {
  const {
    selectCafe,
    mapCenter,
    mapRef,
    fetchedCafes,
    setFetchedCafes,
    searchFilters,
  } = useStore();

  const { data: newCafes, isLoading } = useCafes(mapCenter.lat, mapCenter.long);

  useEffect(() => {
    if (newCafes) {
      const uniqueCafes = newCafes.filter(
        (cafe, index, self) => index === self.findIndex((t) => t.id === cafe.id)
      );

      const sortedCafes = uniqueCafes.sort((a, b) => {
        const distanceA = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          a._geo.lat!,
          a._geo.lng!
        );
        const distanceB = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          b._geo.lat!,
          b._geo.lng!
        );
        return distanceA - distanceB;
      });

      setFetchedCafes(sortedCafes);
    }
  }, [newCafes, mapCenter, setFetchedCafes]);

  if (isLoading && fetchedCafes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarSection className="max-lg:hidden overflow-scroll">
      <SidebarHeading>Results ({fetchedCafes.length})</SidebarHeading>

      {fetchedCafes.map((cafe: MeiliSearchCafe) => (
        <SidebarItem
          key={cafe.id}
          onClick={() => {
            selectCafe(cafe);
            mapRef?.current?.flyTo({
              center: {
                lat: cafe._geo.lat!,
                lon: cafe._geo.lng! - 0.01,
              },
              zoom: 14,
            });
          }}
          className=""
        >
          <div className="grow w-full">
            <SidebarLabel className="">{cafe.name}</SidebarLabel>
            <p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
              {cafe.address}
            </p>
          </div>
        </SidebarItem>
      ))}
    </SidebarSection>
  );
};
