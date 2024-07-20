import React from "react";
import { SidebarHeading, SidebarItem, SidebarSection } from "./catalyst/sidebar";
import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";

interface CafeListProps {
  searchInput: string;
  mapCafes: { visibleCafes: MeiliSearchCafe[], allCafes: MeiliSearchCafe[] } | undefined;
  searchCafes: MeiliSearchCafe[] | null | undefined;
}

export const CafeList: React.FC<CafeListProps> = ({ searchInput, mapCafes, searchCafes }) => {
  const { selectCafe, mapRef } = useStore();

  const displayedCafes = searchInput ? (searchCafes || []) : (mapCafes?.visibleCafes || []);
  const totalCafes = mapCafes?.allCafes?.length || 0;

  return (
    <SidebarSection className="max-lg:hidden">
      <SidebarHeading>
        Results ({displayedCafes.length})
        {!searchInput && ` of ${totalCafes} total`}
      </SidebarHeading>

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
            <p className="font-light text-ellipsis text-nowrap text-slate-500 overflow-hidden">
              {cafe.address}
            </p>
          </div>
        </SidebarItem>
      ))}
    </SidebarSection>
  );
};