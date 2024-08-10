import { StyleSpecification } from "maplibre-gl";
import layers from "protomaps-themes-base";

export const mapStyle: string | StyleSpecification | undefined = {
  version: 8,
  sources: {
    protomaps: {
      type: "vector",
      tiles: ["https://worker.kopimap.com/jakarta/{z}/{x}/{y}.pbf"],
      attribution:
        '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    },
  },
  layers: layers("protomaps", "grayscale"),
  glyphs: "https://map-assets.kopimap.com/fonts/{fontstack}/{range}.pbf",
  sprite: "https://map-assets.kopimap.com/sprites/v3/light",
};
