import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PanelProvider, usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";


const TestComponent: React.FC = () => {
  const { openPanels, togglePanel } = usePanelContext();
  return (
    <div>
      <span data-testid="left-panel">{openPanels.left ? "Open" : "Closed"}</span>
      <button onClick={() => togglePanel("left")}>Toggle Left Panel</button>
    </div>
  );
};

describe("PanelContext", () => {
  it("returns the provided context value when used within a PanelProvider", () => {
    // Arrange
    const contextValue = {
      openPanels: { left: true, right: false },
      togglePanel: vi.fn(),
    };

    // Act
    render(
      <PanelProvider value={contextValue}>
        <TestComponent />
      </PanelProvider>
    );

    // Assert
    const leftPanel = screen.getByTestId("left-panel");
    expect(leftPanel.textContent).toBe("Open");
  });
});
