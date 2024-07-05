import { divideNodesByEdges } from "@/components/GUI/utils/divideNodesByEdges";
import type { Edge, Node } from "reactflow";
import { describe, expect, it } from "vitest";

describe("divideNodesByEdges", () => {
  it("should divide nodes into separate groups based on edges", () => {
    // Arrange
    const nodes: Node[] = [
      { id: "1", position: { x: 0, y: 0 }, type: "default", data: {} },
      { id: "2", position: { x: 1, y: 1 }, type: "default", data: {} },
      { id: "3", position: { x: 2, y: 2 }, type: "default", data: {} },
      { id: "4", position: { x: 3, y: 3 }, type: "default", data: {} },
      { id: "5", position: { x: 4, y: 4 }, type: "default", data: {} },
    ];

    const edges: Edge[] = [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e4-5", source: "4", target: "5" },
    ];

    // Act
    const result = divideNodesByEdges(nodes, edges);

    // Assert
    expect(result).toHaveLength(2);

    const group1 = result.find((group) => group.some((node) => node.id === "1"));
    const group2 = result.find((group) => group.some((node) => node.id === "4"));

    expect(group1).toHaveLength(3);
    expect(group1.map((node) => node.id)).toContain("1");
    expect(group1.map((node) => node.id)).toContain("2");
    expect(group1.map((node) => node.id)).toContain("3");

    expect(group2).toHaveLength(2);
    expect(group2.map((node) => node.id)).toContain("4");
    expect(group2.map((node) => node.id)).toContain("5");
  });

  it("should return single group when all nodes are connected", () => {
    // Arrange
    const nodes: Node[] = [
      { id: "1", position: { x: 0, y: 0 }, type: "default", data: {} },
      { id: "2", position: { x: 1, y: 1 }, type: "default", data: {} },
      { id: "3", position: { x: 2, y: 2 }, type: "default", data: {} },
    ];

    const edges: Edge[] = [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ];

    // Act
    const result = divideNodesByEdges(nodes, edges);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(3);
    expect(result[0].map((node) => node.id)).toContain("1");
    expect(result[0].map((node) => node.id)).toContain("2");
    expect(result[0].map((node) => node.id)).toContain("3");
  });

  it("should return separate groups when there are no edges", () => {
    // Arrange
    const nodes: Node[] = [
      { id: "1", position: { x: 0, y: 0 }, type: "default", data: {} },
      { id: "2", position: { x: 1, y: 1 }, type: "default", data: {} },
    ];

    const edges: Edge[] = [];

    // Act
    const result = divideNodesByEdges(nodes, edges);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(1);
    expect(result[1]).toHaveLength(1);
    expect(result.flat().map((node) => node.id)).toContain("1");
    expect(result.flat().map((node) => node.id)).toContain("2");
  });
});
