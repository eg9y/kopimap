import { useMap } from "react-map-gl/maplibre";
import { Button } from "./catalyst/button";

export const Navigation = ({
  coords,
  isGeolocationEnabled,
  getPosition,
}: {
  coords: GeolocationCoordinates | undefined;
  isGeolocationEnabled: boolean;
  getPosition: () => void;
}) => {
  const { test: map } = useMap();

  function flyToMe() {
    console.log("coords", coords);
    console.log("map", map);
    if (!isGeolocationEnabled) {
      getPosition();
    }
    if (coords && map) {
      map.flyTo({
        center: {
          lat: coords.latitude,
          lon: coords.longitude,
        },
        minZoom: 10,
        // zoom: 24
      });
    }
  }

  return (
    <>
      <div className="p-4">
        <Button onClick={flyToMe}>Go to me</Button>
      </div>
    </>
  );
};
