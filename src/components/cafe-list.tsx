import { SidebarItem, SidebarLabel, SidebarSection } from "./catalyst/sidebar";

import { useStore } from "../store";

export function CafeList() {
  const selectCafe = useStore((state) => state.selectCafe);
  const cafes = useStore((state) => state.cafes);
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
                lon: cafe.longitude,
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
