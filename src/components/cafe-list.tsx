import React, { useMemo, useEffect } from "react";
import { SidebarItem, SidebarLabel, SidebarSection } from "./catalyst/sidebar";
import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";
import { calculateDistance } from "../components/lib/calculate-distance";

export function CafeList() {
  const { selectCafe, mapCenter, mapRef, fetchedCafes, setFetchedCafes } =
    useStore();

  const { data: newCafes, isLoading } = useCafes(
    mapCenter.lat,
    mapCenter.long,
    fetchedCafes
  );

  useEffect(() => {
    if (newCafes) {
      // const updatedCafes = [...fetchedCafes, ...newCafes];
      const updatedCafes = [...newCafes];
      const uniqueCafes = updatedCafes.filter(
        (cafe, index, self) => index === self.findIndex((t) => t.id === cafe.id)
      );

      const sortedCafes = uniqueCafes.sort((a, b) => {
        const distanceA = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          a.latitude!,
          a.longitude!
        );
        const distanceB = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          b.latitude!,
          b.longitude!
        );
        return distanceA - distanceB;
      });

      setFetchedCafes(sortedCafes);
    }
  }, [newCafes, mapCenter]);

  if (isLoading && fetchedCafes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarSection className="max-lg:hidden overflow-scroll">
      {fetchedCafes.length}
      {fetchedCafes.map((cafe) => (
        <SidebarItem
          key={cafe.id}
          onClick={() => {
            selectCafe(cafe);
            mapRef?.current.flyTo({
              center: {
                lat: cafe.latitude!,
                lon: cafe.longitude! - 0.01,
              },
              zoom: 14,
            });
          }}
          className="flex gap-2 flex-wrap"
        >
          <div className="grow">
            <SidebarLabel>{cafe.name}</SidebarLabel>
          </div>
          <img
            src={cafe.gmaps_featured_image!}
            className="object-cover size-[84px]"
          />
        </SidebarItem>
      ))}
    </SidebarSection>
  );
}
