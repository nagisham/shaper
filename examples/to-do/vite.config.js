import path from "path";

import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve("./"),
  resolve: {
    alias: {
      src: path.resolve("./src"),
    },
  },
  build: {
    outDir: path.resolve("./dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: false,
        entryFileNames: "src/index.js",
      },
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "f",
  },
  server: {
    port: "3000",
  },
});
