import React, {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { LayerSpecification } from "maplibre-gl";
import { useCafes } from "../hooks/use-cafes";
import { useStore } from "../store";

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
    "circle-radius": ["step", ["get", "point_count"], 30, 20, 40, 50, 50], // Increased radius values
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
      "#006400", // Dark Green
      [">=", ["get", "gmaps_rating"], 4.3],
      "#32CD32", // Medium Green
      [">=", ["get", "gmaps_rating"], 4.0],
      "#90EE90", // Light Green
      [">=", ["get", "gmaps_rating"], 3.0],
      "#FFD700", // Yellow
      "#FF4500", // Red
    ],
    "circle-radius": 8, // Increased radius value
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

const Clusters = forwardRef<ClustersRef, ClustersProps>(
  ({ mapCenter, handleFlyTo, setPopupInfo }, ref) => {
    const { current: map } = useMap() as { current: MapRef };
    const { selectCafe, selectedCafe } = useStore();
    const { data: cafes } = useCafes(mapCenter.lat, mapCenter.long);

    const geojson = useMemo(() => {
      if (!cafes) return { type: "FeatureCollection", features: [] };

      return {
        type: "FeatureCollection",
        features: cafes.map((cafe) => ({
          type: "Feature",
          properties: {
            ...cafe,
            cluster: false,
            gmaps_rating: parseFloat(cafe.gmaps_rating),
          },
          geometry: {
            type: "Point",
            coordinates: [cafe.longitude, cafe.latitude],
          },
        })),
      };
    }, [cafes]);

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
              gmaps_rating: properties.rating,
              latitude: (feature.geometry as GeoJSON.Point).coordinates[1],
              longitude: (feature.geometry as GeoJSON.Point).coordinates[0],
              ...properties,
            };

            console.log("clicking cafe", cafe);
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
              latitude: (feature.geometry as GeoJSON.Point).coordinates[1],
              longitude: (feature.geometry as GeoJSON.Point).coordinates[0],
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
      <Source
        id="cafes"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
        clusterMinPoints={10} // Set minimum number of points for a cluster
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    );
  }
);

export default Clusters;
