import { Operator } from "@/components/circuit/operator/operator";
import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { EditorProvider } from "@/components/editor/editor-context";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

const openPanels = { left: false, right: false };
const togglePanelMock = vi.fn(() => {
  openPanels.left = !openPanels.left;
});

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => ({
  usePanelContext: () => ({
    openPanels: openPanels,
    togglePanel: togglePanelMock,
  }),
}));

describe("Operator Component", () => {
  const renderOperator = () =>
    render(
      <ReactFlowProvider>
        <PartsProvider>
          <EditorProvider>
            <Operator />
          </EditorProvider>
        </PartsProvider>
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

  it("renders PartsManager component", () => {
    // Arrange
    renderOperator();

    // Act
    const partsManager = screen.getByTestId("parts-manager");

    // Assert
    expect(partsManager).toBeInTheDocument();
  });

  it("renders ValidationStatus component", () => {
    // Arrange
    renderOperator();

    // Act
    const validationStatus = screen.getByTestId("validation-status");

    // Assert
    expect(validationStatus).toBeInTheDocument();
  });

  it("renders ResetCircuit component", () => {
    // Arrange
    renderOperator();

    // Act
    const resetCircuit = screen.getByTestId("reset-circuit");

    // Assert
    expect(resetCircuit).toBeInTheDocument();
  });
});
