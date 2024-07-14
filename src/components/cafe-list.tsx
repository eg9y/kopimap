import { useEffect } from "react";
import {
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "./catalyst/sidebar";
import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";
import { calculateDistance } from "../components/lib/calculate-distance";

export function CafeList() {
  const { selectCafe, mapCenter, mapRef, fetchedCafes, setFetchedCafes } =
    useStore();

  const { data: newCafes, isLoading } = useCafes(mapCenter.lat, mapCenter.long);

  useEffect(() => {
    if (newCafes) {
      const uniqueCafes = newCafes.filter(
        (cafe, index, self) => index === self.findIndex((t) => t.id === cafe.id)
      );

      const sortedCafes = uniqueCafes.sort((a) => {
        const distanceA = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          a._geo.lat!,
          a._geo.lng!
        );
        const distanceB = calculateDistance(
          mapCenter.lat,
          mapCenter.long,
          a._geo.lat!,
          a._geo.lng!
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
      <SidebarHeading>Results ({fetchedCafes.length})</SidebarHeading>

      {fetchedCafes.map((cafe) => (
        <SidebarItem
          key={cafe.id}
          onClick={() => {
            selectCafe(cafe);
            mapRef?.current.flyTo({
              center: {
                lat: cafe._geo.lat!,
                lon: cafe._geo.lng! - 0.01,
              },
              zoom: 14,
            });
          }}
          className="flex gap-2 flex-wrap "
        >
          <div className="grow ">
            <SidebarLabel className="">{cafe.name}</SidebarLabel>
            {/* <p className="text-ellipsis overflow-hidden">{cafe.address}</p> */}
          </div>
        </SidebarItem>
      ))}
    </SidebarSection>
  );
}
