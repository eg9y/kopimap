import React, {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from "react";
import { Source, Layer, useMap, Marker } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { LayerSpecification } from "maplibre-gl";
import { StarIcon } from "lucide-react";
import { motion, Variants } from "framer-motion";
// import useMedia from "react-use/lib/useMedia";


import { useStore } from "../store";
import { MeiliSearchCafe } from "../types";
import { useTheme } from "../components/theme-provider";

const AnimatedStar = motion(StarIcon);

const starVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export interface ClustersRef {
  onClick: (e: maplibregl.MapMouseEvent) => void;
  onClickSingle: (e: maplibregl.MapMouseEvent) => void;
  onMouseEnter: (e: maplibregl.MapMouseEvent) => void;
  onMouseLeave: () => void;
}

interface ClustersProps {
  mapCenter: { lat: number; long: number };
  handleFlyTo: (lat: number, lng: number) => void;
  setPopupInfo: React.Dispatch<React.SetStateAction<any>>;
  cafes: MeiliSearchCafe[] | undefined;
}

const clusterLayer: LayerSpecification = {
  id: "clusters",
  type: "circle",
  source: "cafes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      20,
      "#f1f075",
      50,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 30, 20, 40, 50, 50],
  },
};

const clusterCountLayer: LayerSpecification = {
  id: "cluster-count",
  type: "symbol",
  source: "cafes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["Noto Sans Regular"],
    "text-size": 12,
  },
};

const unclusteredPointLayer: LayerSpecification = {
  id: "unclustered-point",
  type: "circle",
  source: "cafes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": [
      "case",
      [">=", ["get", "gmaps_rating"], 4.6],
      "#006400",
      [">=", ["get", "gmaps_rating"], 4.3],
      "#32CD32",
      [">=", ["get", "gmaps_rating"], 4.0],
      "#90EE90",
      [">=", ["get", "gmaps_rating"], 3.0],
      "#FFD700",
      "#FF4500",
    ],
    "circle-radius": 8,
    "circle-stroke-width": [
      "case",
      ["==", ["get", "place_id"], ["get", "selectedCafeId"]],
      3,
      1,
    ],
    "circle-stroke-color": [
      "case",
      ["==", ["get", "place_id"], ["get", "selectedCafeId"]],
      "#FFD700",
      "#fff",
    ],
  },
};

const getCafeNameLayer = (isDarkMode: boolean): LayerSpecification => ({
  id: "cafe-names",
  type: "symbol",
  source: "cafes",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Regular"],
    "text-size": 12,
    "text-anchor": "top",
    "text-offset": [0, 1],
    "text-allow-overlap": false,
    "text-ignore-placement": false,
    "symbol-sort-key": ["get", "gmaps_rating"],
  },
  paint: {
    "text-color": isDarkMode ? "#ffffff" : "#000000",
    "text-halo-color": isDarkMode ? "#000000" : "#ffffff",
    "text-halo-width": 2,
  },
});

const cafeNameLayer: LayerSpecification = {
  id: "cafe-names",
  type: "symbol",
  source: "cafes",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Regular"],
    "text-size": 12,
    "text-anchor": "top",
    "text-offset": [0, 1],
    "text-allow-overlap": false,
    "text-ignore-placement": false,
    "symbol-sort-key": ["get", "gmaps_rating"],
  },
  paint: {
    "text-color": "#000000",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};


const Clusters = forwardRef<ClustersRef, ClustersProps>(
  ({ handleFlyTo, setPopupInfo, cafes }, ref) => {
    const { current: map } = useMap() as { current: MapRef };
    const { selectCafe, selectedCafe } = useStore();
    const [visibleCafes, setVisibleCafes] = useState<MeiliSearchCafe[]>([]);
    const visibleCafesRef = useRef<MeiliSearchCafe[]>([]);
    const { theme } = useTheme();

    const updateVisibleCafes = useCallback(() => {
      if (map && cafes) {
        const bounds = map.getBounds();
        const visible = cafes.filter((cafe) =>
          bounds.contains([cafe._geo.lng, cafe._geo.lat])
        );

        if (
          JSON.stringify(visible) !== JSON.stringify(visibleCafesRef.current)
        ) {
          visibleCafesRef.current = visible;
          setVisibleCafes(visible);
        }
      }
    }, [map, cafes]);

    useEffect(() => {
      updateVisibleCafes();

      if (map) {
        map.on("moveend", updateVisibleCafes);
        return () => {
          map.off("moveend", updateVisibleCafes);
        };
      }
    }, [map, updateVisibleCafes]);

    useEffect(() => {
      updateVisibleCafes();
    }, [cafes, updateVisibleCafes]);

    const geojson = useMemo(() => {
      return {
        type: "FeatureCollection",
        features: visibleCafes.map((cafe) => ({
          type: "Feature",
          properties: {
            ...cafe,
            cluster: false,
            gmaps_rating: cafe.gmaps_rating,
            selectedCafeId: selectedCafe?.id || "",
          },
          geometry: {
            type: "Point",
            coordinates: [cafe._geo.lng, cafe._geo.lat],
          },
        })),
      };
    }, [visibleCafes, selectedCafe]);

    const onClick = useCallback(
      async (event: maplibregl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["clusters"],
        });

        if (features.length > 0) {
          const feature = features[0];
          const clusterId = feature.properties?.cluster_id;
          const source = map.getSource("cafes") as maplibregl.GeoJSONSource;

          try {
            const zoom = await source.getClusterExpansionZoom(clusterId);
            map.easeTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [
                number,
                number
              ],
              zoom: zoom,
            });
          } catch (err) {
            console.error("Error expanding cluster:", err);
          }
        }
      },
      [map]
    );

    const onClickSingle = useCallback(
      (event: maplibregl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["unclustered-point"],
        });

        if (features.length > 0) {
          const feature = features[0];
          const properties = feature.properties;
          if (properties) {
            const cafe = {
              id: properties.id,
              name: properties.name,
              latitude: properties.latitude,
              longitude: properties.longitude,
              ...properties,
            };

            selectCafe(cafe);
            handleFlyTo(cafe.latitude, cafe.longitude);
          }
        }
      },
      [map, selectCafe, handleFlyTo]
    );

    const onMouseEnter = useCallback(
      (event: maplibregl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["unclustered-point"],
        });

        if (features.length > 0) {
          const feature = features[0];
          const properties = feature.properties;
          if (properties) {
            setPopupInfo({
              ...properties,
            });
          }
        }
      },
      [map, setPopupInfo]
    );

    const onMouseLeave = useCallback(() => {
      setPopupInfo(null);
    }, [setPopupInfo]);

    useImperativeHandle(ref, () => ({
      onClick,
      onClickSingle,
      onMouseEnter,
      onMouseLeave,
    }));

    return (
      <>
        <Source
          id="cafes"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterMinPoints={10}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...getCafeNameLayer(theme === 'dark')} />
        </Source>
        {selectedCafe && (
          <Marker
            latitude={selectedCafe.latitude}
            longitude={selectedCafe.longitude}
            offset={[0, -20]}
          >
            <AnimatedStar
              size={24}
              className="fill-yellow-400"
              variants={starVariants}
              initial="initial"
              animate="animate"
            />
          </Marker>
        )}
      </>
    );
  }
);

export default Clusters;