import { addNearestEdge, createNearestEdge } from "@/components/GUI/utils/createNearestEdge";
import type { Node } from "reactflow";
import { describe, expect, it } from "vitest";

describe("createNearestEdge Utility Functions", () => {
  // Arrange
  const nodes: Node[] = [
    {
      id: "1",
      type: "child",
      position: { x: 100, y: 100 },
      data: {
        leftHandleStyle: { top: 10, left: 10 },
        rightHandleStyle: { top: 10, left: 110 },
        leftHandleConnected: false,
        rightHandleConnected: false,
      },
    },
    {
      id: "2",
      type: "child",
      position: { x: 300, y: 100 },
      data: {
        leftHandleStyle: { top: 10, left: 10 },
        rightHandleStyle: { top: 10, left: 110 },
        leftHandleConnected: false,
        rightHandleConnected: false,
      },
    },
    {
      id: "3",
      type: "child",
      position: { x: 500, y: 100 },
      data: {
        leftHandleStyle: { top: 10, left: 10 },
        rightHandleStyle: { top: 10, left: 110 },
        leftHandleConnected: false,
        rightHandleConnected: false,
      },
    },
  ];

  it("should create an edge between nearest nodes", () => {
    // Act
    const edge = createNearestEdge(nodes[0], nodes);

    // Assert
    expect(edge).toBeTruthy();
    expect(edge.source).toBe("1");
    expect(edge.target).toBe("2");
  });

  it("should return null when there is no nearest node within minimum distance", () => {
    // Arrange
    const distantNodes: Node[] = [
      {
        id: "1",
        type: "child",
        position: { x: 100, y: 100 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      },
      {
        id: "2",
        type: "child",
        position: { x: 1000, y: 1000 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      },
    ];

    // Act
    const edge = createNearestEdge(distantNodes[0], distantNodes);

    // Assert
    expect(edge).toBeNull();
  });

  it("should return null when handle is already connected", () => {
    // Arrange
    const connectedNodes: Node[] = [
      {
        id: "1",
        type: "child",
        position: { x: 100, y: 100 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      },
      {
        id: "2",
        type: "child",
        position: { x: 1000, y: 1000 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: true,
          rightHandleConnected: true,
        },
      },
    ];

    // Act
    const edge = createNearestEdge(connectedNodes[0], connectedNodes);

    // Assert
    expect(edge).toBeNull();
  });

  it("should add nearest edge to edges list", () => {
    // Arrange
    const edges = [];

    // Act
    const updatedEdges = addNearestEdge(nodes[1], nodes, edges);

    // Assert
    expect(updatedEdges).toHaveLength(1);
    expect(updatedEdges[0].source).toBe("1");
    expect(updatedEdges[0].target).toBe("2");
  });

  it("should not add an edge if no nearest node is found", () => {
    // Arrange
    const distantNodes: Node[] = [
      {
        id: "1",
        type: "child",
        position: { x: 100, y: 100 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      },
      {
        id: "2",
        type: "child",
        position: { x: 1000, y: 1000 },
        data: {
          leftHandleStyle: { top: 10, left: 10 },
          rightHandleStyle: { top: 10, left: 110 },
          leftHandleConnected: false,
          rightHandleConnected: false,
        },
      },
    ];

    const edges = [];

    // Act
    const updatedEdges = addNearestEdge(distantNodes[0], distantNodes, edges);

    // Assert
    expect(updatedEdges).toHaveLength(0);
  });
});
