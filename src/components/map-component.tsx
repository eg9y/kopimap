import React, { useRef, useEffect, useState, ReactNode } from "react";
import {
  Map as Mapgl,
  GeolocateControl,
  Marker,
  Popup,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { useStore } from "../store";
import { mapStyle } from "../config";
import Pin from "./pin";
import { createClient } from "@supabase/supabase-js";

interface MapComponentProps {
  pmTilesReady: boolean;
  children: ReactNode;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  pmTilesReady,
  children,
}) => {
  const { cafes, setCafes, selectCafe, selectedCafe, setMapRef, mapRef } =
    useStore();
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const popupTimeoutRef = useRef<number | null>(null);
  const isHoveringPopupRef = useRef<boolean>(false);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  const geoControlRef = useRef<maplibregl.GeolocateControl>();

  useEffect(() => {
    geoControlRef.current?.trigger();
  }, [geoControlRef]);

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

  const handlePopupMouseEnter = () => {
    isHoveringPopupRef.current = true;
    if (popupTimeoutRef.current !== null) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    isHoveringPopupRef.current = false;
    popupTimeoutRef.current = window.setTimeout(() => {
      setPopupInfo(null);
      popupTimeoutRef.current = null;
    }, 300);
  };

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const fetchNearbyCafes = async () => {
    if (mapRef && mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center && center.lat && center.lng) {
        const excludedIds = cafes.map((cafe) => cafe.id);
        const { data, error } = await supabase.rpc("nearby_cafes", {
          lat: center.lat,
          long: center.lng,
          excluded_ids: excludedIds,
        });

        if (error) {
          console.error("Error fetching nearby cafes:", error);
        } else {
          const newCafes = data || [];
          const uniqueCafes = newCafes.filter(
            (newCafe: any) => !cafes.some((cafe) => cafe.id === newCafe.id)
          );

          const sortedCafes = [...cafes, ...uniqueCafes].sort((a, b) => {
            const distanceA = calculateDistance(
              popupInfo ? popupInfo.latitude : center.lat,
              popupInfo ? popupInfo.longitude : center.lng,
              a.latitude,
              a.longitude
            );
            const distanceB = calculateDistance(
              popupInfo ? popupInfo.latitude : center.lat,
              popupInfo ? popupInfo.longitude : center.lng,
              b.latitude,
              b.longitude
            );
            return distanceA - distanceB;
          });

          setCafes(sortedCafes);
        }
      }
    }
  };

  const handleFlyTo = (lat: number, lng: number) => {
    if (mapRef && mapRef.current && !isNaN(lat) && !isNaN(lng)) {
      mapRef.current.flyTo({
        center: {
          lat: lat,
          lon: lng - 0.01,
        },
      });
    }
  };

  return (
    <Mapgl
      id="test"
      onClick={() => selectCafe(null)}
      initialViewState={{
        latitude: 6.1944,
        longitude: 106.8229,
        zoom: 10,
      }}
      maxBounds={[
        106.626998 - 0.1,
        -6.426709 - 0.1,
        107.052031 + 0.1,
        -6.121617 + 0.1,
      ]}
      maxZoom={24}
      minZoom={10}
      mapLib={maplibregl as any}
      style={{ width: "100%", height: "100%" }}
      mapStyle={pmTilesReady ? mapStyle : undefined}
      onLoad={() => {
        geoControlRef.current?.trigger();
      }}
      onMoveEnd={() => {
        fetchNearbyCafes();
      }}
      onResize={() => {
        fetchNearbyCafes();
      }}
      ref={setMapRef as any}
    >
      {children}
      {cafes.map((cafe) => (
        <Marker
          longitude={cafe.longitude}
          latitude={cafe.latitude}
          key={cafe.name + cafe.id}
          className="pointer-events-auto z-50"
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            selectCafe(cafe);
            handleFlyTo(cafe.latitude, cafe.longitude);
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
                      cafe.gmaps_rating <= 3
                        ? "red"
                        : cafe.gmaps_rating < 4.5
                        ? "#61bb00"
                        : cafe.gmaps_rating <= 5
                        ? "#009664"
                        : "red",
                  })}
            />
          </div>
        </Marker>
      ))}
      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          className="z-[100] !p-0"
          closeButton={false}
        >
          <div
            typeof="button"
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
            className="-mx-3 -mb-3 -mt-5 cursor-pointer"
            onClick={() => {
              selectCafe(popupInfo);
              handleFlyTo(popupInfo.latitude, popupInfo.longitude);
              setPopupInfo(null);
            }}
          >
            <div className="p-2 flex w-full items-center">
              <div className="font-bold">{popupInfo.name}</div>
              {/* <img
                width="100%"
                src={popupInfo.gmaps_featured_image}
                alt={popupInfo.name}
              /> */}
            </div>
          </div>
        </Popup>
      )}
      <GeolocateControl ref={geoControlRef as any} />
    </Mapgl>
  );
};
