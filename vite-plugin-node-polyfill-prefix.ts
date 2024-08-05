// vite-plugin-node-polyfill-prefix.ts

import type { Plugin } from 'vite';

export default function nodePolyfillPrefix(): Plugin {
  const nodeBuiltins = ['path', 'stream', 'assert', 'events', 'zlib', 'util', 'buffer'];
  
  return {
    name: 'vite-plugin-node-polyfill-prefix',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) {
        let hasChanged = false;
        const newCode = code.replace(
          new RegExp(`require\\(['"]?(${nodeBuiltins.join('|')})['"]?\\)`, 'g'),
          (match, p1) => {
            hasChanged = true;
            return `require("node:${p1}")`;
          }
        );
        if (hasChanged) {
          return {
            code: newCode,
            map: null // You might want to handle source maps properly in a production scenario
          };
        }
      }
    }
  };
}