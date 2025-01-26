import { useUpdateAnnotationEdges } from "@/components/circuit/hooks/use-update-annotation-edges";
import { renderHook } from "@testing-library/react";
import { useNodes, useReactFlow } from "@xyflow/react";
import { vi } from "vitest";

vi.mock("@xyflow/react", () => ({
  useNodes: vi.fn(),
  useReactFlow: vi.fn(),
}));

describe("useUpdateAnnotationEdges", () => {
  it("updates edges when nodes have controlTo with Activation", () => {
    // Arrange
    const nodeA = {
      id: "nodeA",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partA",
        controlTo: [{ name: "partB", controlType: "Activation" }],
        controlBy: [],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      position: { x: 0, y: 0 },
      data: { name: "partB", controlTo: [], controlBy: [] },
    };
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    vi.mocked(useNodes).mockReturnValue([nodeA, nodeB]);
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
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
    const nodeA = {
      id: "nodeA",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partA",
        controlTo: [],
        controlBy: [{ name: "partB", controlType: "Repression" }],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      position: { x: 0, y: 0 },
      data: { name: "partB", controlTo: [], controlBy: [] },
    };
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    vi.mocked(useNodes).mockReturnValue([nodeA, nodeB]);
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
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
    const nodeA = {
      id: "nodeA",
      type: "child",
      position: { x: 0, y: 0 },
      data: { name: "partA", controlTo: [], controlBy: [] },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      position: { x: 0, y: 0 },
      data: { name: "partB", controlTo: [], controlBy: [] },
    };
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    vi.mocked(useNodes).mockReturnValue([nodeA, nodeB]);
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
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
      position: { x: 0, y: 0 },
      data: {
        name: "partA",
        controlTo: [{ name: "partB", type: "Activation" }],
        controlBy: [],
      },
    };
    const nodeB = {
      id: "nodeB",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partB",
        controlTo: [],
        controlBy: [{ name: "partA", type: "Activation" }],
      },
    };
    vi.mocked(useNodes).mockReturnValue([nodeA, nodeB]);
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges.mock.calls[0][0]).toHaveLength(1);
  });

  it("creates multiple edges when multiple nodes share the same name in controlTo/By", () => {
    // Arrange
    const nodeA = {
      id: "nodeA",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partA",
        controlTo: [{ name: "partB", type: "Activation" }],
        controlBy: [],
      },
    };
    const nodeB1 = {
      id: "nodeB1",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partB",
        controlTo: [],
        controlBy: [],
      },
    };
    const nodeB2 = {
      id: "nodeB2",
      type: "child",
      position: { x: 0, y: 0 },
      data: {
        name: "partB",
        controlTo: [],
        controlBy: [],
      },
    };
    const mockSetEdges = vi.fn();
    const mockGetEdges = vi.fn(() => []);
    vi.mocked(useNodes).mockReturnValue([nodeA, nodeB1, nodeB2]);
    // @ts-ignore
    vi.mocked(useReactFlow).mockReturnValue({
      getEdges: mockGetEdges,
      setEdges: mockSetEdges,
    });

    // Act
    renderHook(() => useUpdateAnnotationEdges());

    // Assert
    expect(mockSetEdges).toHaveBeenCalled();
    const updatedEdges = mockSetEdges.mock.calls[0][0];
    expect(updatedEdges).toHaveLength(2);
    expect(updatedEdges[0].target).toBe("nodeB1");
    expect(updatedEdges[1].target).toBe("nodeB2");
  });
});
