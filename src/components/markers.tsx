import React, { useMemo, useEffect, useRef } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";
import Supercluster from "supercluster";
import Pin from "./pin";
import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";

interface MarkersProps {
  mapCenter: { lat: number; long: number };
  viewport: { latitude: number; longitude: number; zoom: number };
  handleFlyTo: (lat: number, lng: number) => void;
  popupInfo: any;
  setPopupInfo: React.Dispatch<React.SetStateAction<any>>;
  popupTimeoutRef: React.MutableRefObject<number | null>;
  isHoveringPopupRef: React.MutableRefObject<boolean>;
}

const Markers: React.FC<MarkersProps> = ({
  mapCenter,
  viewport,
  handleFlyTo,
  popupInfo,
  setPopupInfo,
  popupTimeoutRef,
  isHoveringPopupRef,
}) => {
  const { selectCafe, selectedCafe } = useStore();
  const { current: map } = useMap();
  const superclusterRef = useRef<Supercluster>();
  const { data: cafes } = useCafes(mapCenter.lat, mapCenter.long);

  useEffect(() => {
    if (cafes) {
      superclusterRef.current = new Supercluster({
        radius: 40,
        maxZoom: 16,
      });
      superclusterRef.current.load(
        cafes.map((cafe) => ({
          type: "Feature",
          properties: { cluster: false, cafeId: cafe.id, ...cafe },
          geometry: {
            type: "Point",
            coordinates: [cafe.longitude, cafe.latitude],
          },
        }))
      );
    }
  }, [cafes]);

  const clusters = useMemo(() => {
    if (!superclusterRef.current || !map) return [];

    const bounds = map.getBounds();
    if (!bounds) return [];

    const [westLng, southLat, eastLng, northLat] = bounds.toArray().flat();

    const foo = superclusterRef.current.getClusters(
      [westLng, southLat, eastLng, northLat],
      Math.floor(viewport.zoom)
    );
    // console.log("cluster", foo);

    return foo;
  }, [viewport, map, superclusterRef.current]);

  const handleMarkerMouseEnter = (cafe: any) => {
    if (popupInfo && cafe.id === popupInfo.id) {
      return;
    }
    if (popupTimeoutRef.current !== null) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    setPopupInfo(cafe);
  };

  const handleMarkerMouseLeave = () => {
    popupTimeoutRef.current = window.setTimeout(() => {
      if (!isHoveringPopupRef.current) {
        setPopupInfo(null);
      }
      popupTimeoutRef.current = null;
    }, 300);
  };

  const getClusterStyle = (pointCount: number) => {
    let size = 20;
    let color = "bg-blue-300";
    if (pointCount < 10) {
      size = 20;
      color = "bg-green-500";
    } else if (pointCount < 50) {
      size = 30;
      color = "bg-yellow-500";
    } else if (pointCount < 100) {
      size = 40;
      color = "bg-orange-500";
    } else {
      size = 50;
      color = "bg-red-500";
    }
    return { size, color };
  };

  return clusters.map((cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

    // If the cluster size is less than 10, treat it as an individual marker
    if (isCluster && pointCount >= 10) {
      const { size, color } = getClusterStyle(pointCount);
      return (
        <Marker
          key={`cluster-${cluster.id}`}
          latitude={latitude}
          longitude={longitude}
        >
          `cluster-{cluster.geometry.coordinates[0]}`
          <div
            className={`text-white flex justify-center items-center font-[bold] cursor-pointer p-2.5 rounded-[50%] ${color}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            onClick={() => {
              const expansionZoom = Math.min(
                superclusterRef.current!.getClusterExpansionZoom(cluster.id),
                20
              );
              map.flyTo({
                center: [longitude, latitude],
                zoom: expansionZoom,
                duration: 500,
              });
            }}
          >
            {pointCount}
          </div>
        </Marker>
      );
    }

    const cafe = cluster.properties;

    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        key={cafe.place_id}
        className="pointer-events-auto z-50"
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          selectCafe(cafe);
          handleFlyTo(latitude, longitude);
        }}
      >
        <div
          onMouseEnter={() => handleMarkerMouseEnter(cafe)}
          onMouseLeave={handleMarkerMouseLeave}
        >
          <Pin
            {...(selectedCafe && selectedCafe.id === cafe.id
              ? { fill: "black" }
              : {
                  fill:
                    parseFloat(cafe.gmaps_rating) <= 3
                      ? "red"
                      : parseFloat(cafe.gmaps_rating) < 4.5
                      ? "#61bb00"
                      : parseFloat(cafe.gmaps_rating) <= 5
                      ? "#009664"
                      : "red",
                })}
          />
        </div>
      </Marker>
    );
  });
};

export default Markers;
