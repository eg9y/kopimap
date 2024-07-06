import { StyleSpecification } from "maplibre-gl";
import layers from "protomaps-themes-base";

export const mapStyle: string | StyleSpecification | undefined = {
  version: 8,
  sources: {
    protomaps: {
      type: "vector",
      url: "pmtiles://https://map.kopimap.com/jakarta.pmtiles",
      attribution:
        '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    },
  },
  layers: layers("protomaps", "grayscale"),
  glyphs:
    "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
  sprite: "https://protomaps.github.io/basemaps-assets/sprites/v3/light",
};
