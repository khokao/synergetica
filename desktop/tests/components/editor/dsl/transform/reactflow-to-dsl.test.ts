import { TEMP_NODE_ID } from "@/components/circuit/constants";
import { reactflowToDsl } from "@/components/editor/dsl/transform/reactflow-to-dsl";
import type { Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

describe("reactflowToDsl", () => {
  it("should convert React Flow nodes to correct DSL content", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "parent-1",
        type: "parent",
        position: { x: 0, y: 0 },
        data: {},
      },
      {
        id: "child-1",
        type: "child",
        parentId: "parent-1",
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "PromoterA" },
      },
      {
        id: "child-2",
        type: "child",
        parentId: "parent-1",
        position: { x: 200, y: 0 },
        data: { category: "Protein", name: "ProteinA" },
      },
      {
        id: "child-3",
        type: "child",
        parentId: "parent-1",
        position: { x: 300, y: 0 },
        data: { category: "Terminator", name: "TerminatorA" },
      },
    ];

    // Act
    const result = reactflowToDsl(nodes);

    // Assert
    // Insert \n at the start of the expected DSL for better test code readability
    const expectedDsl = `
- chain:
  - type: Promoter
    name: PromoterA
  - type: Protein
    name: ProteinA
  - type: Terminator
    name: TerminatorA
`;
    expect(`\n${result}`).toBe(expectedDsl);
  });

  it("should handle nodes without parentId as separate chains", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child-1",
        type: "child",
        position: { x: 0, y: 0 },
        data: { category: "Promoter", name: "PromoterA" },
      },
      {
        id: "child-2",
        type: "child",
        position: { x: 0, y: 100 },
        data: { category: "Protein", name: "ProteinA" },
      },
    ];

    // Act
    const result = reactflowToDsl(nodes);

    // Assert
    // Insert \n at the start of the expected DSL for better test code readability
    const expectedDsl = `
- chain:
  - type: Promoter
    name: PromoterA
- chain:
  - type: Protein
    name: ProteinA
`;
    expect(`\n${result}`).toBe(expectedDsl);
  });

  it("should exclude nodes with TEMP_NODE_ID", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child-1",
        type: "child",
        parentId: TEMP_NODE_ID,
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "PromoterA" },
      },
      {
        id: "child-2",
        type: "child",
        position: { x: 0, y: 100 },
        data: { category: "Protein", name: "ProteinA" },
      },
    ];

    // Act
    const result = reactflowToDsl(nodes);

    // Assert
    // Insert \n at the start of the expected DSL for better test code readability
    const expectedDsl = `
- chain:
  - type: Protein
    name: ProteinA
`;
    expect(`\n${result}`).toBe(expectedDsl);
  });

  it("should sort chains based on their Y position", () => {
    // Arrange
    const nodes: Node[] = [
      {
        id: "child-3",
        type: "child",
        parentId: undefined,
        position: { x: 100, y: 100 },
        data: { category: "Terminator", name: "TerminatorA" },
      },
      {
        id: "child-1",
        type: "child",
        parentId: undefined,
        position: { x: 100, y: 0 },
        data: { category: "Promoter", name: "PromoterA" },
      },
    ];

    // Act
    const result = reactflowToDsl(nodes);

    // Assert
    // Insert \n at the start of the expected DSL for better test code readability
    const expectedDsl = `
- chain:
  - type: Promoter
    name: PromoterA
- chain:
  - type: Terminator
    name: TerminatorA
`;
    expect(`\n${result}`).toBe(expectedDsl);
  });
});
