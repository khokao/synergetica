import { PartsManager } from "@/components/circuit/operator/parts-manager/parts-manager";
import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("PartsManager", () => {
  it("renders PartsManager component", () => {
    // Arrange & Act
    render(
      <ReactFlowProvider>
        <PartsProvider>
          <PartsManager />
        </PartsProvider>
      </ReactFlowProvider>,
    );

    // Assert
    expect(screen.getByTestId("parts-manager")).toBeInTheDocument();
  });
});
