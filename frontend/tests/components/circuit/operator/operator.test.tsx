import { Operator } from "@/components/circuit/operator/operator";
import { render, screen } from "@testing-library/react";
import { Panel, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("Operator Component", () => {
  const renderOperator = () =>
    render(
      <ReactFlowProvider>
        <Operator />
      </ReactFlowProvider>,
    );

  it("renders ColoredMiniMap component", () => {
    // Arrange
    renderOperator();

    // Act
    const miniMap = screen.getByTestId("colored-mini-map");

    // Assert
    expect(miniMap).toBeInTheDocument();
  });

  it("renders ZoomInOut component", () => {
    // Arrange
    renderOperator();

    // Act
    const zoomInOut = screen.getByTestId("zoom-in-out");

    // Assert
    expect(zoomInOut).toBeInTheDocument();
  });
});
