// vite.config.ts

import path from "path";
import react from "@vitejs/plugin-react";
import { pages } from "vike-cloudflare";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		vike({ prerender: true }),
		react(),
		pages(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
			manifest: {
				name: "Kopimap",
				short_name: "Kopimap",
				description:
					"Jelajahi cafe terdekat di Jakarta dengan Kopimap. Temukan tempat sempurna untuk ngopi, kerja, atau bersantai dengan peta interaktif dan ulasan detail kami.",
				theme_color: "#000",
				background_color: "#ffffff",
				display: "standalone",
				scope: "/",
				start_url: "/",
				orientation: "portrait",
				icons: [
					{
						src: "https://map-assets.kopimap.com/favicon/android-icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "https://map-assets.kopimap.com/favicon/android-icon-192x192.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
			workbox: {
				maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/worker\.kopimap\.com\/jakarta\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "map-tiles",
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/map-assets\.kopimap\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "map-assets",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /\.(js|css|png|jpg|jpeg|svg|gif)$/,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "static-resources",
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
							},
						},
					},
				],
			},
			devOptions: {
				enabled: true,
				type: "module",
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
});
