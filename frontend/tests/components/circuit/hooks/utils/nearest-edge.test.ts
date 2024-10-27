import { NODE_CONNECT_DISTANCE } from "@/components/circuit/constants";
import { createChildNode } from "@/components/circuit/hooks/utils/create-node";
import { createNearestEdge } from "@/components/circuit/hooks/utils/nearest-edge";
import { describe, expect, it } from "vitest";

describe("createNearestEdge", () => {
  it("should return null when there are no nodes in proximity to connect", () => {
    // Arrange
    const sourceNode = createChildNode({ x: 0, y: 0 }, "source-category");
    const targetNode = createChildNode({ x: 1000, y: 1000 }, "target-category");
    const nodes = [sourceNode, targetNode];

    // Act
    const result = createNearestEdge(sourceNode, targetNode, nodes);

    // Assert
    expect(result).toBeNull();
  });

  it("should create an edge between two nodes when they are close enough", () => {
    // Arrange
    const sourceNode = createChildNode({ x: 0, y: 0 }, "source-category");
    const targetNode = createChildNode({ x: NODE_CONNECT_DISTANCE - 1, y: 0 }, "target-category");
    const nodes = [sourceNode, targetNode];

    // Act
    const result = createNearestEdge(sourceNode, targetNode, nodes);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.source).toBe(sourceNode.id);
    expect(result?.target).toBe(targetNode.id);
  });

  it("should prefer the nearest node if multiple are in range", () => {
    // Arrange
    const sourceNode = createChildNode({ x: 0, y: 0 }, "source-category");
    const closerTargetNode = createChildNode({ x: NODE_CONNECT_DISTANCE + 1, y: 0 }, "closer-target-category");
    const fartherTargetNode = createChildNode({ x: NODE_CONNECT_DISTANCE + 1000, y: 0 }, "farther-target-category");
    const nodes = [sourceNode, closerTargetNode, fartherTargetNode];

    // Act
    const result = createNearestEdge(sourceNode, fartherTargetNode, nodes);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.source).toBe(sourceNode.id);
    expect(result?.target).toBe(closerTargetNode.id);
  });

  it("should return null if nodes are connected already by handles", () => {
    // Arrange
    const sourceNode = createChildNode({ x: 0, y: 0 }, "source-category");
    const targetNode = createChildNode({ x: NODE_CONNECT_DISTANCE - 1, y: 0 }, "target-category");
    sourceNode.data.rightHandleConnected = true;
    targetNode.data.leftHandleConnected = true;
    const nodes = [sourceNode, targetNode];

    // Act
    const result = createNearestEdge(sourceNode, targetNode, nodes);

    // Assert
    expect(result).toBeNull();
  });
});
