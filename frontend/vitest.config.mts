/// <reference types="vitest" />
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: default export is required.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
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
