// vite.config.ts

import path from "path";
import react from "@vitejs/plugin-react";
import { pages } from "vike-cloudflare";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vike({ prerender: true }), react(), pages()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
	server: {
		host: true, // Add this to allow external connections
		port: 5173, // Optional: specify port
	},
});
