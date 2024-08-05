// vite.config.ts

import path from "path";
import { defineConfig } from "vite";
import vike from 'vike/plugin';
import devServer from "@hono/vite-dev-server";
import { pages } from "vike-cloudflare";
import react from "@vitejs/plugin-react";
// Remove this import:
// import { nodePolyfills } from "vite-plugin-node-polyfills";
import nodePolyfillPrefix from "./vite-plugin-node-polyfill-prefix";

export default defineConfig({
  plugins: [
    nodePolyfillPrefix(),
    // Remove this plugin:
    // nodePolyfills({
    //   include: ["path", "stream", "assert", "events", "zlib", "util", "buffer"],
    //   globals: {
    //     Buffer: true,
    //     global: true,
    //     process: true,
    //   },
    // }),
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
  build: {
    rollupOptions: {
      external: ['node:path', 'node:stream', 'node:assert', 'node:events', 'node:zlib', 'node:util', 'node:buffer'],
    },
  },
});