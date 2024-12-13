import { NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import {
  findRelatedNodes,
  getLeftHandlePosition,
  getRightHandlePosition,
  isNodeOutsideParent,
} from "@/components/circuit/hooks/utils/utils";
import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

const childNode: Node = {
  id: "child",
  position: { x: 100, y: 200 },
  data: {},
};

const parentNode: Node = {
  id: "parent",
  position: { x: 50, y: 50 },
  data: {},
};

const nodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, parentId: undefined, data: {} },
  { id: "2", position: { x: 100, y: 100 }, parentId: "1", data: {} },
];

const edge: Edge = { id: "edge1", source: "1", target: "2", type: "default" };

describe("getLeftHandlePosition", () => {
  it("should return the correct position when there is no parent node", () => {
    // Arrange
    const expectedPosition = { x: childNode.position.x, y: childNode.position.y + NODE_HEIGHT / 2 };

    // Act
    const result = getLeftHandlePosition(childNode, null);

    // Assert
    expect(result).toEqual(expectedPosition);
  });

  it("should return the correct position when there is a parent node", () => {
    // Arrange
    const expectedPosition = {
      x: parentNode.position.x + childNode.position.x,
      y: parentNode.position.y + childNode.position.y + NODE_HEIGHT / 2,
    };

    // Act
    const result = getLeftHandlePosition(childNode, parentNode);

    // Assert
    expect(result).toEqual(expectedPosition);
  });
});

describe("getRightHandlePosition", () => {
  it("should return the correct position when there is no parent node", () => {
    // Arrange
    const expectedPosition = {
      x: childNode.position.x + NODE_WIDTH,
      y: childNode.position.y + NODE_HEIGHT / 2,
    };

    // Act
    const result = getRightHandlePosition(childNode, null);

    // Assert
    expect(result).toEqual(expectedPosition);
  });

  it("should return the correct position when there is a parent node", () => {
    // Arrange
    const expectedPosition = {
      x: parentNode.position.x + childNode.position.x + NODE_WIDTH,
      y: parentNode.position.y + childNode.position.y + NODE_HEIGHT / 2,
    };

    // Act
    const result = getRightHandlePosition(childNode, parentNode);

    // Assert
    expect(result).toEqual(expectedPosition);
  });
});

describe("findRelatedNodes", () => {
  it("should return the correct nodes", () => {
    // Arrange
    const expectedNodes = {
      sourceNode: nodes[0],
      targetNode: nodes[1],
      parentNode: nodes[0],
      siblingNodes: [nodes[1]],
    };

    // Act
    const result = findRelatedNodes(nodes, edge);

    // Assert
    expect(result).toEqual(expectedNodes);
  });

  it("should throw an error if the source node is not found", () => {
    // Arrange
    const invalidEdge = { id: "edge2", source: "invalid", target: "2", type: "default" };

    // Act & Assert
    expect(() => findRelatedNodes(nodes, invalidEdge)).toThrowError("Source node with id invalid not found.");
  });

  it("should throw an error if the target node is not found", () => {
    // Arrange
    const invalidEdge = { id: "edge3", source: "1", target: "invalid", type: "default" };

    // Act & Assert
    expect(() => findRelatedNodes(nodes, invalidEdge)).toThrowError("Target node with id invalid not found.");
  });
});

describe("isNodeOutsideParent", () => {
  it("should return true if the child node is outside the parent node", () => {
    // Arrange
    const parentNode = { id: "parent", position: { x: 0, y: 0 }, width: 50, height: 50, data: {} };
    const childNode = { id: "child", position: { x: 100, y: 100 }, data: {} };

    // Act
    const result = isNodeOutsideParent(childNode, parentNode);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if the child node is inside the parent node", () => {
    // Arrange
    const parentNode = { id: "parent", position: { x: 0, y: 0 }, width: 200, height: 200, data: {} };
    const childNode = { id: "child", position: { x: 50, y: 50 }, data: {} };

    // Act
    const result = isNodeOutsideParent(childNode, parentNode);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false and log a warning if the parent node has undefined width or height", () => {
    // Arrange
    console.warn = vi.fn();
    const parentNode = { id: "parent", position: { x: 0, y: 0 }, width: undefined, height: undefined, data: {} };
    const childNode = { id: "child", position: { x: 50, y: 50 }, data: {} };

    // Act
    const result = isNodeOutsideParent(childNode, parentNode);

    // Assert
    expect(result).toBe(false);
    expect(console.warn).toHaveBeenCalledWith("Parent node's width or height is undefined.");
  });
});
