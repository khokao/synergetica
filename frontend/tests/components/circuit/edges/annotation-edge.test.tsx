import { ActivationColor } from "@/components/circuit/constants";
import { AnnotationEdge } from "@/components/circuit/edges/annotation-edge";
import { render } from "@testing-library/react";
import { type EdgeProps, Position, useInternalNode } from "@xyflow/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    useInternalNode: vi.fn(),
  };
});

describe("AnnotationEdge component", () => {
  it("renders the edge path when both source and target nodes are present", () => {
    // Arrange
    const mockUseInternalNode = useInternalNode as Mock;

    const sourceNode = {
      internals: {
        positionAbsolute: { x: 0, y: 0 },
        handleBounds: {
          source: [{ x: 0, y: 0, width: 10, height: 10, position: Position.Bottom }],
        },
      },
    };

    const targetNode = {
      internals: {
        positionAbsolute: { x: 100, y: 100 },
        handleBounds: {
          source: [{ x: 0, y: 0, width: 10, height: 10, position: Position.Top }],
        },
      },
    };

    mockUseInternalNode.mockImplementation((id: string) => {
      return id === "source" ? sourceNode : targetNode;
    });

    const props: EdgeProps = {
      id: "edge-1",
      source: "source",
      target: "target",
      style: { stroke: ActivationColor },
      markerEnd: "url(#arrow)",
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 0,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {},
      selected: false,
      animated: false,
      interactionWidth: 0,
    };

    // Act
    const { container } = render(
      <svg aria-hidden="true">
        <AnnotationEdge {...props} />
      </svg>,
    ); // wrap with <svg> to silence warning

    // Assert
    const pathElement = container.querySelector("path.react-flow__edge-path");
    expect(pathElement).not.toBeNull();
    expect(pathElement?.getAttribute("id")).toBe("edge-1");
    expect(pathElement?.getAttribute("stroke-width")).toBe("5");
    expect(pathElement?.getAttribute("marker-end")).toBe("url(#arrow)");
  });

  it("does not render when either source or target node is missing", () => {
    // Arrange
    const mockUseInternalNode = useInternalNode as Mock;
    mockUseInternalNode.mockImplementation(() => null);

    const props: EdgeProps = {
      id: "edge-1",
      source: "source",
      target: "target",
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 0,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {},
      selected: false,
      animated: false,
      interactionWidth: 0,
    };

    // Act
    const { container } = render(<AnnotationEdge {...props} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });
});
