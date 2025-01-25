import { CustomEdge } from "@/components/circuit/edges/custom-edge";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Position, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    useReactFlow: vi.fn(),
    EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("CustomEdge component", () => {
  it("renders the edge correctly", () => {
    // Arrange
    const props = {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: { stroke: "#000" },
      markerEnd: "url(#arrow)",
      data: {},
      selected: false,
      animated: false,
      interactionWidth: 0,
    };

    // Act
    const { container } = render(
      <ReactFlowProvider>
        <svg aria-hidden="true">
          <CustomEdge {...props} />
        </svg>
      </ReactFlowProvider>,
    );

    // Assert
    const edge = container.querySelector("path");
    expect(edge).not.toBeNull();
    expect(edge?.getAttribute("marker-end")).toBe("url(#arrow)");
    expect(edge?.getAttribute("style")).toContain("stroke: #000");
  });

  it("calls deleteElements with the correct edge when the delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const mockDeleteElements = vi.fn();
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
      getEdges: vi.fn(() => [{ id: "edge-1", source: "node-1", target: "node-2" }]),
      deleteElements: mockDeleteElements,
    });

    const props = {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: { stroke: "#000" },
      markerEnd: "url(#arrow)",
      data: {},
      selected: false,
      animated: false,
      interactionWidth: 0,
    };

    render(
      <ReactFlowProvider>
        <svg aria-hidden="true">
          <CustomEdge {...props} />
        </svg>
      </ReactFlowProvider>,
    );

    // Act
    await user.click(screen.getByTestId("delete-edge-button"));

    // Assert
    expect(mockDeleteElements).toHaveBeenCalledWith({
      edges: [{ id: "edge-1", source: "node-1", target: "node-2" }],
    });
  });
});
