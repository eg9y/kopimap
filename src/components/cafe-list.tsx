import React from "react";
import { SidebarHeading, SidebarItem, SidebarSection } from "./catalyst/sidebar";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";
import { BadgeButton } from "./catalyst/badge";

interface CafeListProps {
  searchInput: string;
  mapCafes: { visibleCafes: MeiliSearchCafe[], allCafes: MeiliSearchCafe[] } | undefined;
  searchCafes: MeiliSearchCafe[] | null | undefined;
}

export const CafeList: React.FC<CafeListProps> = ({ searchInput, mapCafes, searchCafes }) => {
  const { selectCafe, mapRef, searchFilters, setSearchFilters} = useStore();

  const displayedCafes = (searchInput || Object.keys(searchFilters).length > 0) ? (searchCafes || []) : (mapCafes?.visibleCafes || []);
  const totalCafes = mapCafes?.allCafes?.length || 0;

  const removeSearchFilter = (key: string) => {
    const temp = { ...searchFilters };
    delete temp[key];
    setSearchFilters(temp);
  };

  return (
    <SidebarSection className="max-lg:hidden">
      <SidebarHeading>
        Results ({displayedCafes.length})
        {!searchInput && Object.keys(searchFilters).length === 0  && ` of ${totalCafes} total`}
      </SidebarHeading>
      <div className="">
      {Object.entries(searchFilters).map(([key, val]) => {
        return (
          <BadgeButton onClick={() => removeSearchFilter(key)}>{key.replace(/_/g, " ")}: {val}</BadgeButton>
        )
      })}
      </div>

      {displayedCafes.map((cafe: MeiliSearchCafe) => (
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
            <p className="text-nowrap text-ellipsis overflow-hidden">{cafe.name}</p>
              <div className="flex gap-2">
              <BadgeButton>gmaps rating: {cafe.gmaps_rating}</BadgeButton>
              <BadgeButton>rating: {cafe.avg_rating ?? "-"}</BadgeButton>
              </div>
            <p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
              {cafe.address}
            </p>
          </div>
        </SidebarItem>
      ))}
    </SidebarSection>
  );
};