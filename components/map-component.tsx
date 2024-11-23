import type {
  GeolocateControl as GeolocateControlType,
  LngLat,
} from "maplibre-gl";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { GeolocateControl, Map as Mapgl } from "react-map-gl/maplibre";
import useMedia from "react-use/esm/useMedia";
import { darkMapStyle, mapStyle } from "../config";
import { useMapCafes } from "../hooks/use-map-cafes";
import { useStore } from "../store";
import Clusters, { ClustersRef } from "./clusters";
import { useTheme } from "./theme-provider";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LngLatBoundsLike } from "react-map-gl";
import { GeolocateResultEvent } from "react-map-gl/dist/esm/types";
import { Navigation } from "lucide-react";

interface MapComponentProps {}

// Define web geolocation position type
interface WebGeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitudeAccuracy: number | null;
    altitude: number | null;
    speed: number | null;
    heading: number | null;
  };
  timestamp: number;
}

export default function MapComponent({}: MapComponentProps) {
  const { setMapRef, mapRef, mapCenter, setMapCenter, selectedCafe } =
    useStore();
  const geoControlRef = useRef<GeolocateControlType>();
  const clustersRef = useRef<ClustersRef>(null);
  const isWide = useMedia("(min-width: 640px)");
  const { theme } = useTheme();

  const [viewport, setViewport] = useState({
    latitude: mapCenter.lat,
    longitude: mapCenter.long,
    zoom: 14,
  });

  const maxBounds: LngLatBoundsLike = [
    {
      lng: 106.626998 - 0.1,
      lat: -6.426709 - 0.1,
    },
    {
      lng: 107.052031 + 0.1,
      lat: -6.121617 + 0.1,
    },
  ];

  const { data: mapCafesData, refetch: refetchMapCafes } = useMapCafes(
    mapCenter.lat,
    mapCenter.long
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refetchMapCafes();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [mapCenter, refetchMapCafes]);

  const handleCapacitorLocation = useCallback(async () => {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
  
      const permissionStatus = await Geolocation.checkPermissions();
  
      if (permissionStatus.location !== "granted") {
        const newStatus = await Geolocation.requestPermissions();
  
        if (newStatus.location !== "granted") {
          throw new Error("Location permission denied");
        }
      }
  
      // Set enableHighAccuracy to false or omit it
      const position = await Geolocation.getCurrentPosition({
        timeout: 10000, // Optional: Reduce timeout
      });
  
      if (mapRef && mapRef.current) {
        const { latitude, longitude } = position.coords;
        if (latitude < -90 || latitude > 90) {
          throw new Error("Invalid coordinates received");
        }
  
        mapRef.current.flyTo({
          center: {
            lat: latitude,
            lng: longitude,
          },
          zoom: 14,
          essential: true,
        });
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      throw error;
    }
  }, [mapRef]);
  

  const handleGeolocate = useCallback(
    (e: GeolocateResultEvent<maplibregl.GeolocateControl>) => {
      if (e.coords && mapRef && mapRef.current) {
        console.log("Web Geolocation coords:", e.coords);
        if (e.coords.latitude < -90 || e.coords.latitude > 90) {
          return;
        }
        mapRef.current.flyTo({
          center: {
            lat: e.coords.latitude,
            lng: e.coords.longitude,
          },
          zoom: 14,
          essential: true,
        });
      }
    },
    [mapRef]
  );

  const handleFlyTo = useCallback(
    (lat: number, lng: number) => {
      if (mapRef && mapRef.current && !isNaN(lat) && !isNaN(lng)) {
        if (lat < -90 || lat > 90) {
          return;
        }
        mapRef.current.flyTo({
          zoom: 15,
          center: {
            lat: lat + (isWide ? 0 : -0.0025),
            lon: lng - (isWide ? 0.0045 : 0),
          },
          essential: true,
        });
      }
    },
    [mapRef, isWide]
  );

  const handleMapMove = useCallback(() => {
    if (mapRef && mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        // check if lat is >= -90 and <= 90
        if (center.lat < -90 || center.lat > 90) {
          return;
        }
        setMapCenter({ lat: center.lat, long: center.lng });
        setViewport((prev) => ({
          ...prev,
          latitude: center.lat,
          longitude: center.lng,
          zoom: mapRef.current!.getZoom(),
        }));
      }
    }
  }, [mapRef, setMapCenter]);

  const handleOutOfMaxBounds = useCallback(() => {
    if (mapRef && mapRef.current) {
      const centerLat =
        ((maxBounds[0] as LngLat).lat + (maxBounds[1] as LngLat).lat) / 2;
      const centerLng =
        ((maxBounds[0] as LngLat).lng + (maxBounds[1] as LngLat).lng) / 2;
      mapRef.current.flyTo({
        center: [centerLng, centerLat],
        zoom: 10,
        essential: true,
      });
    }
  }, [mapRef, maxBounds]);

  // Add a new effect to handle flying to selected cafe
  useEffect(() => {
    if (selectedCafe && mapRef?.current) {
      mapRef.current.flyTo({
        center: {
          lat: selectedCafe.latitude,
          lng: selectedCafe.longitude,
        },
        zoom: 15,
        essential: true,
      });
    }
  }, [selectedCafe, mapRef]);

  return (
    <Mapgl
      id="test"
      reuseMaps
      {...viewport}
      onMove={(evt) => {
        setViewport(evt.viewState);
      }}
      onLoad={(evt) => {
        const center = evt.target.getCenter();
        if (center.lat < -90 || center.lat > 90) {
          return;
        }
        setMapCenter({
          lat: center.lat,
          long: center.lng,
        });
      }}
      onMoveEnd={handleMapMove}
      maxBounds={maxBounds}
      maxZoom={24}
      minZoom={10}
      style={{ width: "100%", height: "100%" }}
      mapStyle={theme === "dark" ? darkMapStyle : mapStyle}
      onResize={handleMapMove}
      ref={setMapRef as any}
      onClick={(e) => {
        // selectCafe(null);
        const feature = e.features && e.features[0];
        if (feature && feature.properties && feature.properties.cluster) {
          clustersRef.current?.onClick(e);
        } else {
          clustersRef.current?.onClickSingle(e);
        }
      }}
      onMouseMove={(e) => clustersRef.current?.onMouseEnter(e)}
    >
      <Clusters
        ref={clustersRef}
        mapCenter={mapCenter}
        handleFlyTo={handleFlyTo}
        cafes={mapCafesData?.visibleCafes || []}
      />

      {"Capacitor" in window ? (
        <button
          className="absolute bottom-12 right-4 z-[1000] bg-white dark:bg-slate-500 p-3.5 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={handleCapacitorLocation}
          aria-label="Get Location"
        >
          <Navigation className="w-7 h-7" />
        </button>
      ) : (
        <GeolocateControl
          ref={geoControlRef as any}
          positionOptions={{
            enableHighAccuracy: true,
          }}
          onGeolocate={handleGeolocate}
          onOutOfMaxBounds={handleOutOfMaxBounds}
        />
      )}
    </Mapgl>
  );
}

export const MemoizedMapComponent = memo(MapComponent);
