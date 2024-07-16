import { CustomChildNode, CustomParentNode } from "@/components/GUI/CustomNode";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import { describe, expect, it } from "vitest";

// Required to temporarily render the GUI section during testing.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

describe("CustomChildNode", () => {
  it("renders correctly with provided data", () => {
    // Arrange
    const data = {
      iconUrl: "/images/node-test-icon.svg",
      nodeCategory: "promoter",
      nodeSubcategory: undefined,
      nodePartsName: undefined,
      controlBy: null,
      controlTo: null,
      meta: null,
      leftHandleStyle: { top: 15, left: 7 },
      rightHandleStyle: { top: 15, left: 178 },
      commandPaletteButtonStyle: { top: -6, left: 12, right: 30 },
    };
    const defaultProps = {
      id: "1",
      data: data,
      dragHandle: "",
      type: "child",
      selected: false,
      isConnectable: true,
      zIndex: 0,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    // Act
    render(
      <ReactFlowProvider>
        {/* @ts-ignore */}
        <CustomChildNode nodeCategory={data.nodeCategory} id={defaultProps.id} {...defaultProps} />
      </ReactFlowProvider>,
    );

    // Assert
    const image = screen.getByAltText("promoter");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", data.iconUrl);

    const leftHandle = screen.getByTestId("handle-left");
    expect(leftHandle).toBeInTheDocument();
    expect(leftHandle).toHaveStyle({ top: `${data.leftHandleStyle.top}px`, left: `${data.leftHandleStyle.left}px` });

    const rightHandle = screen.getByTestId("handle-right");
    expect(rightHandle).toBeInTheDocument();
    expect(rightHandle).toHaveStyle({ top: `${data.rightHandleStyle.top}px`, left: `${data.rightHandleStyle.left}px` });

    const commandPaletteButton = screen.getByTestId("command-palette-button");
    expect(commandPaletteButton).toBeInTheDocument();
    expect(commandPaletteButton).toHaveStyle({
      top: `${data.commandPaletteButtonStyle.top}px`,
      left: `${data.commandPaletteButtonStyle.left}px`,
      right: `${data.commandPaletteButtonStyle.right}px`,
    });
  });
});

describe("CustomParentNode", () => {
  it("renders with correct dimensions", () => {
    // Arrange
    const data = {
      width: 200,
      height: 100,
    };
    const defaultProps = {
      id: "1",
      data: data,
      dragHandle: "",
      type: "parent",
      selected: false,
      isConnectable: true,
      zIndex: 0,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    // Act
    render(
      <ReactFlowProvider>
        <CustomParentNode {...defaultProps} />
      </ReactFlowProvider>,
    );

    // Assert
    const parentNode = screen.getByTestId("parent-node");
    expect(parentNode).toBeInTheDocument();
    expect(parentNode).toHaveStyle({ width: `${data.width}px`, height: `${data.height}px` });
  });
});
