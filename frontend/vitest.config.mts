/// <reference types="vitest" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: default export is required.
export default defineConfig({
  plugins: [react(), tsconfigPaths(), stubNextAssetImport()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "json-summary"],
      reportOnFailure: true,
    },
  },
});

// ref: https://github.com/vercel/next.js/issues/45350
function stubNextAssetImport() {
  return {
    name: "stub-next-asset-import",
    transform(_code: string, id: string) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default { src: '${imgSrc}', height: 1, width: 1 }`,
        };
      }
    },
  };
}
