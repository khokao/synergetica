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
      exclude: [
        // all constants.ts
        "src/**/constants.ts",
        // shadcn/ui codes.
        "src/components/ui/**/*",
        "src/lib/utils.ts",
        // app
        "src/app/page.tsx",
        "src/app/layout.tsx", // Warning: validateDOMNesting(...): <html> cannot appear as a child of <div>.
        // components
        "src/components/studio/studio.tsx", // just composes other components.
        "src/components/circuit/nodes/child-node.tsx", // No integration tests for custom node.
        "src/components/circuit/nodes/parent-node.tsx", // No integration tests for custom node.
        "src/components/circuit/edges/custom-edge.tsx", // No integration tests for custom edge.
        "src/components/circuit/circuit.tsx", // GUI testing is excluded due to high cost and low value
        "src/components/circuit/hooks/use-delete-nodes-edges.ts", // GUI testing is excluded due to high cost and low value
        "src/components/circuit/hooks/use-drag-nodes.ts", // GUI testing is excluded due to high cost and low value
        "src/components/circuit/hooks/use-run-simulator.ts", // GUI testing is excluded due to high cost and low value
      ],
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
