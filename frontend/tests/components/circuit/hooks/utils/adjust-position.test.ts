import { EDGE_LENGTH, NODE_WIDTH } from "@/components/circuit/constants";
import { adjustNodePositionsAndConnectHandles } from "@/components/circuit/hooks/utils/adjust-position";
import { describe, expect, it } from "vitest";

describe("adjustNodePositionsAndConnectHandles", () => {
  it("should adjust the position of the source node when it is the adjusted node", () => {
    // Arrange
    const sourceNode = {
      id: "sourceNode",
      position: { x: 100, y: 100 },
      data: { rightHandleConnected: false },
    };
    const targetNode = {
      id: "targetNode",
      position: { x: 200, y: 100 },
      data: { leftHandleConnected: false },
    };
    const parentNode = null;
    const adjustedNode = sourceNode;

    // Act
    adjustNodePositionsAndConnectHandles(adjustedNode, sourceNode, targetNode, parentNode);

    // Assert
    const expectedPosition = {
      x: targetNode.position.x - NODE_WIDTH - EDGE_LENGTH,
      y: targetNode.position.y,
    };
    expect(sourceNode.position).toEqual(expectedPosition);
    expect(sourceNode.data.rightHandleConnected).toBe(true);
    expect(targetNode.data.leftHandleConnected).toBe(true);
  });

  it("should adjust the position of the target node when the source node is the adjusted node", () => {
    // Arrange
    const sourceNode = {
      id: "sourceNode",
      position: { x: 100, y: 100 },
      data: { rightHandleConnected: false },
    };
    const targetNode = {
      id: "targetNode",
      position: { x: 200, y: 100 },
      data: { leftHandleConnected: false },
    };
    const parentNode = null;
    const adjustedNode = targetNode;

    // Act
    adjustNodePositionsAndConnectHandles(adjustedNode, sourceNode, targetNode, parentNode);

    // Assert
    const expectedPosition = {
      x: sourceNode.position.x + NODE_WIDTH + EDGE_LENGTH,
      y: sourceNode.position.y,
    };
    expect(targetNode.position).toEqual(expectedPosition);
    expect(sourceNode.data.rightHandleConnected).toBe(true);
    expect(targetNode.data.leftHandleConnected).toBe(true);
  });
});
