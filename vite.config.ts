// vite.config.ts

import path from "path";
import devServer from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { pages } from "vike-cloudflare";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vike(),
    pages({
      server: {
        kind: "hono",
        entry: "hono-entry.ts",
      },
    }),
    devServer({
      entry: "hono-entry.ts",
      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
