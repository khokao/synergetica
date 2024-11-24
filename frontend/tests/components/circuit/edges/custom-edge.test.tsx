import { CustomEdge } from "@/components/circuit/edges/custom-edge";
import { render } from "@testing-library/react";
import { type EdgeProps, Position, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    useReactFlow: vi.fn(),
    getBezierPath: vi.fn(() => ["M0,0 L10,10", 50, 50]),
    Position: {
      Top: "top",
      Bottom: "bottom",
    },
  };
});

describe("CustomEdge component", () => {
  it("renders the edge correctly", async () => {
    // Arrange
    const mockUseReactFlow = useReactFlow as Mock;
    mockUseReactFlow.mockReturnValue({
      getEdges: vi.fn(),
      deleteElements: vi.fn(),
    });

    const props: EdgeProps = {
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
    const baseEdge = container.querySelector("path");
    expect(baseEdge).not.toBeNull();
    expect(baseEdge?.getAttribute("d")).toBe("M0,0 L10,10");
  });
});
