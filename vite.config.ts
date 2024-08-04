import path from "path";
import { defineConfig } from "vite";
import vike from 'vike/plugin';
import devServer from "@hono/vite-dev-server";
import { pages } from "vike-cloudflare";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { cjsInterop } from "vite-plugin-cjs-interop";

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    // Add problematic npm package here:
    noExternal: [
      "@uppy/compressor",
      "@uppy/core",
      "@uppy/dashboard",
      "@uppy/drag-drop",
      "@uppy/file-input",
      "@uppy/progress-bar",
      "@uppy/react",
      "@uppy/tus",
      "react-use",
    ]
  },
  plugins: [
    cjsInterop({
      // Add broken npm package here
      dependencies: [
        // Apply patch to root import:
        //   import someImport from 'some-package'
        "@uppy/compressor",
        "@uppy/core",
        "@uppy/dashboard",
        "@uppy/drag-drop",
        "@uppy/file-input",
        "@uppy/progress-bar",
        "@uppy/react",
        "@uppy/tus",
 
        // Apply patch to all sub imports:
        //   import someImport from 'some-package/path'
        //   import someImport from 'some-package/sub/path'
        //   ...
        "react-use/**",
      ]
    }),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["path", "stream", "assert", "events", "zlib", "util", "buffer"],
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
