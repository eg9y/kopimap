// vite.config.ts

import path from "path";
import { defineConfig } from "vite";
import vike from 'vike/plugin';
import devServer from "@hono/vite-dev-server";
import { pages } from "vike-cloudflare";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ["path", "stream", "assert", "events", "zlib", "util", "buffer"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        path: 'node:path',
        stream: 'node:stream',
        assert: 'node:assert',
        events: 'node:events',
        zlib: 'node:zlib',
        util: 'node:util',
        buffer: 'node:buffer',
      },
      protocolImports: true,
    }),
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