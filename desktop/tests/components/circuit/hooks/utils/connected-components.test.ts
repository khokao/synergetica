import { getConnectedComponents } from "@/components/circuit/hooks/utils/connected-components";
import { describe, expect, it } from "vitest";

describe("getConnectedComponents", () => {
  it("should return a single group when all nodes are connected", () => {
    // Arrange
    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: {} },
      { id: "2", position: { x: 0, y: 0 }, data: {} },
      { id: "3", position: { x: 0, y: 0 }, data: {} },
    ];

    const edges = [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ];

    // Act
    const result = getConnectedComponents(nodes, edges);

    // Assert
    expect(result).toHaveLength(1); // One group
    expect(result[0]).toHaveLength(3); // All 3 nodes should be in the group
  });

  it("should return multiple groups when nodes are not fully connected", () => {
    // Arrange
    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: {} },
      { id: "2", position: { x: 0, y: 0 }, data: {} },
      { id: "3", position: { x: 0, y: 0 }, data: {} },
      { id: "4", position: { x: 0, y: 0 }, data: {} },
    ];

    const edges = [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e3-4", source: "3", target: "4" },
    ];

    // Act
    const result = getConnectedComponents(nodes, edges);

    // Assert
    expect(result).toHaveLength(2); // Two groups
    expect(result[0]).toHaveLength(2); // Group 1: Nodes 1 and 2
    expect(result[1]).toHaveLength(2); // Group 2: Nodes 3 and 4
  });

  it("should return each node as its own group when there are no edges", () => {
    // Arrange
    const nodes = [
      { id: "1", position: { x: 0, y: 0 }, data: {} },
      { id: "2", position: { x: 0, y: 0 }, data: {} },
      { id: "3", position: { x: 0, y: 0 }, data: {} },
    ];

    const edges = [];

    // Act
    const result = getConnectedComponents(nodes, edges);

    // Assert
    expect(result).toHaveLength(3); // Three groups
    expect(result[0]).toHaveLength(1); // Group 1: Node 1
    expect(result[1]).toHaveLength(1); // Group 2: Node 2
    expect(result[2]).toHaveLength(1); // Group 3: Node 3
  });

  it("should return an empty array when there are no nodes", () => {
    // Arrange
    const nodes = [];
    const edges = [];

    // Act
    const result = getConnectedComponents(nodes, edges);

    // Assert
    expect(result).toHaveLength(0); // No groups
  });
});
