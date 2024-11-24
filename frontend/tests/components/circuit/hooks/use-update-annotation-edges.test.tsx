import { useUpdateAnnotationEdges } from "@/components/circuit/hooks/use-update-annotation-edges";
import { renderHook } from "@testing-library/react";
import { useNodes, useReactFlow } from "@xyflow/react";
import { type Mock, vi } from "vitest";

vi.mock("@xyflow/react", () => ({
  useNodes: vi.fn(),
  useReactFlow: vi.fn(),
}));

describe("useUpdateAnnotationEdges", () => {
  it("updates edges when nodes have controlTo with Activation", () => {
    // Arrange
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    const nodeA = {
      id: "nodeA",
      type: "child",
      data: {
        partsId: "partA",
        controlTo: [{ partsId: "partB", controlType: "Activation" }],
        controlBy: [],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      data: { partsId: "partB", controlTo: [], controlBy: [] },
    };
    (useNodes as Mock).mockReturnValue([nodeA, nodeB]);
    (useReactFlow as Mock).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges).toHaveBeenCalled();
  });

  it("updates edges when nodes have controlBy with Repression", () => {
    // Arrange
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    const nodeA = {
      id: "nodeA",
      type: "child",
      data: {
        partsId: "partA",
        controlTo: [],
        controlBy: [{ partsId: "partB", controlType: "Repression" }],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      data: { partsId: "partB", controlTo: [], controlBy: [] },
    };
    (useNodes as Mock).mockReturnValue([nodeA, nodeB]);
    (useReactFlow as Mock).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges).toHaveBeenCalled();
  });

  it("does not create edges for nodes without control relationships", () => {
    // Arrange
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    const nodeA = {
      id: "nodeA",
      type: "child",
      data: { partsId: "partA", controlTo: [], controlBy: [] },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      data: { partsId: "partB", controlTo: [], controlBy: [] },
    };
    (useNodes as Mock).mockReturnValue([nodeA, nodeB]);
    (useReactFlow as Mock).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges).toHaveBeenCalledWith([]);
  });

  it("avoids duplicating edges when they already exist", () => {
    // Arrange
    const existingEdge = {
      id: "edge-nodeA-nodeB",
      source: "nodeA",
      target: "nodeB",
      type: "annotation",
    };
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => [existingEdge]);
    const nodeA = {
      id: "nodeA",
      type: "child",
      data: {
        partsId: "partA",
        controlTo: [{ partsId: "partB", controlType: "Activation" }],
        controlBy: [],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      data: { partsId: "partB", controlTo: [], controlBy: [] },
    };
    (useNodes as Mock).mockReturnValue([nodeA, nodeB]);
    (useReactFlow as Mock).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges.mock.calls[0][0]).toHaveLength(1);
  });
});
