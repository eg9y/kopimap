// vite.config.mobile.ts

import path from "path";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/",
	plugins: [
		vike({
			prerender: {
				noExtraDir: true,
			},
		}),
		react(),
	],
	build: {
		outDir: "dist",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
});
