import { SidebarItem, SidebarLabel, SidebarSection } from "./catalyst/sidebar";

import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";

export function CafeList() {
  const { selectCafe, mapCenter } = useStore();

  const { data: cafes } = useCafes(mapCenter.lat, mapCenter.long);
  const mapRef = useStore((state) => state.mapRef);

  return (
    <SidebarSection className="max-lg:hidden overflow-scroll">
      {cafes.map((cafe) => (
        <SidebarItem
          key={cafe.id}
          onClick={() => {
            selectCafe(cafe);
            mapRef?.current.flyTo({
              center: {
                lat: cafe.latitude,
                lon: cafe.longitude - 0.01,
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
            src={cafe.gmaps_featured_image}
            className="object-cover size-[84px]"
          />
        </SidebarItem>
      ))}
    </SidebarSection>
  );
}
