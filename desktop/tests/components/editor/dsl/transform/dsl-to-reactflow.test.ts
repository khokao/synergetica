import { dslToReactflow } from "@/components/editor/dsl/transform/dsl-to-reactflow";
import { describe, expect, it } from "vitest";

const parts = {
  PromoterA: {
    name: "PromoterA",
    description: "PromoterA Description",
    category: "Promoter",
    controlBy: [
      {
        name: "ProteinA",
        type: "Repression",
      },
    ],
    controlTo: [],
  },
  ProteinA: {
    name: "ProteinA",
    description: "ProteinA Description",
    category: "Protein",
    controlBy: [],
    controlTo: [
      {
        name: "PromoterA",
        type: "Repression",
      },
    ],
  },
  TerminatorA: {
    name: "TerminatorA",
    description: "TerminatorA Description",
    category: "Terminator",
    controlBy: [],
    controlTo: [],
  },
};

describe("dslToReactflow", () => {
  it("should return empty nodes and edges for empty content", () => {
    const content = "";

    const result = dslToReactflow(content, parts);

    expect(result).toEqual({ nodes: [], edges: [] });
  });

  it("should return null for invalid DSL content", () => {
    const content = `
- chain:
  - type: invalidType
`;

    const result = dslToReactflow(content, parts);

    expect(result).toBeNull();
  });

  it("should generate correct nodes and edges for valid DSL content", () => {
    const content = `
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.nodes.length).toBe(4); // 1 parent node and 3 child nodes
    expect(result?.edges.length).toBe(2);
  });

  it("should handle multiple chains correctly", () => {
    // Arrange
    const content = `
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.nodes.length).toBe(8); // 2 parent nodes and 6 child nodes
    expect(result?.edges.length).toBe(4);
  });

  it("should assign correct parentId to child nodes when chain has multiple items", () => {
    // Arrange
    const content = `
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result).not.toBeNull();
    const nodes = result?.nodes;
    if (nodes) {
      const parentNode = nodes.find((node) => node.type === "parent");
      expect(parentNode).toBeDefined();

      const childNodes = nodes.filter((node) => node.type !== "parent");
      for (const node of childNodes) {
        expect(node.parentId).toBe(parentNode?.id);
      }
    }
  });

  it("should not assign parentId when chain has only one item", () => {
    // Arrange
    const content = `
- chain:
  - type: Promoter
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result).not.toBeNull();
    const nodes = result?.nodes;
    if (nodes) {
      expect(nodes.length).toBe(1);
      expect(nodes[0].parentId).toBeUndefined();
    }
  });

  it("should set leftHandleConnected and rightHandleConnected correctly", () => {
    // Arrange
    const content = `
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result).not.toBeNull();
    const nodes = result?.nodes;
    if (nodes) {
      const promoterNode = nodes.find((node) => node.data.category === "Promoter");
      const proteinNode = nodes.find((node) => node.data.category === "Protein");
      const terminatorNode = nodes.find((node) => node.data.category === "Terminator");

      expect(promoterNode?.data.leftHandleConnected).toBe(false);
      expect(promoterNode?.data.rightHandleConnected).toBe(true);
      expect(proteinNode?.data.leftHandleConnected).toBe(true);
      expect(proteinNode?.data.rightHandleConnected).toBe(true);
      expect(terminatorNode?.data.leftHandleConnected).toBe(true);
      expect(terminatorNode?.data.rightHandleConnected).toBe(false);
    }
  });

  it("should create edges between child nodes correctly", () => {
    // Arrange
    const content = `
- chain:
  - type: Promoter
  - type: Protein
  - type: Terminator
`;

    // Act
    const result = dslToReactflow(content, parts);

    // Assert
    expect(result?.edges.length).toBe(2);
    const edges = result?.edges;
    if (edges && result?.nodes) {
      const childNodes = result.nodes.filter((node) => node.type !== "parent");
      expect(edges[0].source).toBe(childNodes[0].id);
      expect(edges[0].target).toBe(childNodes[1].id);
      expect(edges[1].source).toBe(childNodes[1].id);
      expect(edges[1].target).toBe(childNodes[2].id);
    }
  });
});
