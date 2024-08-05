// vite.config.ts

import path from "path";
import { defineConfig } from "vite";
import vike from 'vike/plugin';
import devServer from "@hono/vite-dev-server";
import { pages } from "vike-cloudflare";
import react from "@vitejs/plugin-react";

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
  assetsInclude: ['**/*.xml', '**/*.txt'], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});