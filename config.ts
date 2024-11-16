import { StyleSpecification } from "maplibre-gl";
import layers from "protomaps-themes-base";

export const mapStyle: string | StyleSpecification | undefined = {
	version: 8,
	sources: {
		protomaps: {
			type: "vector",
			...(!(window as any).Capacitor?.isNativePlatform()
				? {
						tiles: ["https://worker.kopimap.com/jakarta/{z}/{x}/{y}.pbf"],
					}
				: {}),
			...((window as any).Capacitor?.isNativePlatform()
				? {
						url: "pmtiles://public/map-assets/jakarta.pmtiles",
					}
				: {}),
			attribution:
				'<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
		},
	},
	layers: layers("protomaps", "grayscale"),
	glyphs: "https://map-assets.kopimap.com/fonts/{fontstack}/{range}.pbf",
	sprite: "https://map-assets.kopimap.com/sprites/v3/light",
};

export const darkMapStyle: string | StyleSpecification | undefined = {
	...mapStyle,
	layers: layers("protomaps", "dark"),
	sprite: "https://map-assets.kopimap.com/sprites/v3/dark",
};
