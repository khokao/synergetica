import { TEMP_NODE_ID } from "@/components/circuit/constants";
import { convertReactFlowNodesToDSL } from "@/components/editor/utils/reactflow-to-dsl";
import type { Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("convertReactFlowNodesToDSL", () => {
  it("should convert React Flow nodes to correct DSL content", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "parent1",
        type: "parent",
        position: { x: 0, y: 0 },
        data: {},
      },
      {
        id: "child1",
        type: "child",
        parentId: "parent1",
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "promoter1" },
      },
      {
        id: "child2",
        type: "child",
        parentId: "parent1",
        position: { x: 200, y: 0 },
        data: { category: "Protein", name: "protein1" },
      },
      {
        id: "child3",
        type: "child",
        parentId: "parent1",
        position: { x: 300, y: 0 },
        data: { category: "Terminator", name: "terminator1" },
      },
    ];

    // Act
    const result = convertReactFlowNodesToDSL(nodes);

    // Assert
    const expectedDSL = `- chain:
  - type: Promoter
    name: promoter1
  - type: Protein
    name: protein1
  - type: Terminator
    name: terminator1
`;
    expect(result).toBe(expectedDSL);
  });

  it("should handle nodes without parentId as separate chains", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child1",
        type: "child",
        position: { x: 0, y: 0 },
        data: { category: "Promoter", name: "promoter1" },
      },
      {
        id: "child2",
        type: "child",
        position: { x: 0, y: 100 },
        data: { category: "Protein", name: "protein1" },
      },
    ];

    // Act
    const result = convertReactFlowNodesToDSL(nodes);

    // Assert
    const expectedDSL = `- chain:
  - type: Promoter
    name: promoter1
- chain:
  - type: Protein
    name: protein1
`;
    expect(result).toBe(expectedDSL);
  });

  it("should exclude nodes with TEMP_NODE_ID", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child1",
        type: "child",
        parentId: TEMP_NODE_ID,
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "promoter1" },
      },
      {
        id: "child2",
        type: "child",
        position: { x: 0, y: 100 },
        data: { category: "Protein", name: "protein1" },
      },
    ];

    // Act
    const result = convertReactFlowNodesToDSL(nodes);

    // Assert
    const expectedDSL = `- chain:
  - type: Protein
    name: protein1
`;
    expect(result).toBe(expectedDSL);
  });

  it("should sort chains based on their Y position", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child3",
        type: "child",
        parentId: undefined,
        position: { x: 100, y: 100 },
        data: { category: "Terminator", name: "terminator1" },
      },
      {
        id: "child1",
        type: "child",
        parentId: undefined,
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "promoter1" },
      },
    ];

    // Act
    const result = convertReactFlowNodesToDSL(nodes);

    // Assert
    const expectedDSL = `- chain:
  - type: Promoter
    name: promoter1
- chain:
  - type: Terminator
    name: terminator1
`;
    expect(result).toBe(expectedDSL);
  });
});
