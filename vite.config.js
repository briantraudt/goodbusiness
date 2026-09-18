import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const publicRoot = fileURLToPath(new URL("./public", import.meta.url));

// Keep the J5 concept page in the production multi-page build.
export default defineConfig({
  root: "public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(publicRoot, "index.html"),
        j5: resolve(publicRoot, "j5/index.html"),
      },
    },
  },
});
