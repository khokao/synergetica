import { useStrictSchema } from "@/components/editor/schemas/strict-schema";
import { parseAndCheck } from "@/components/editor/validate/parse-and-check";
import { describe, expect, it } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  return {
    useParts: () => ({
      promoterParts: {
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
      },
      proteinParts: {
        ProteinA: {
          name: "ProteinA",
          description: "Test Protein Description",
          category: "Protein",
          controlBy: [],
          controlTo: [
            {
              name: "PromoterA",
              type: "Repression",
            },
          ],
        },
      },
      terminatorParts: {
        TerminatorA: {
          name: "TerminatorA",
          description: "Test Terminator Description",
          category: "Terminator",
          controlBy: [],
          controlTo: [],
        },
      },
    }),
  };
});

describe("parseAndCheck", () => {
  const { strictCircuitSchema } = useStrictSchema();

  it("should return parsed content and no errors for valid DSL content", () => {
    // Arrange
    const validContent = `
- chain:
  - type: Promoter
    name: PromoterA
  - type: Protein
    name: ProteinA
  - type: Terminator
    name: TerminatorA
`;

    // Act
    const result = parseAndCheck(validContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toEqual([]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return validation errors when Promoter is missing in the chain", () => {
    // Arrange
    const invalidContent = `
- chain:
  # - type: Promoter
  #   name: PromoterA
  - type: Protein
    name: ProteinA
  - type: Terminator
    name: TerminatorA
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].path).toEqual([0, "chain", 0]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return validation errors when Protein is missing after Promoter", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: Promoter
    name: PromoterA
  # - type: Protein
  #   name: ProteinA
  - type: Terminator
    name: TerminatorA
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].path).toEqual([0, "chain", 1]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return validation errors when Terminator is missing at the end of the chain", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: Promoter
    name: PromoterA
  - type: Protein
    name: ProteinA
  # - type: Terminator
  #   name: TerminatorA
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].path).toEqual([0, "chain", 1]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return null parsed content when content is empty", () => {
    // Arrange
    const emptyContent = "";

    // Act
    const result = parseAndCheck(emptyContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).toBeNull();
    expect(result.issues).toHaveLength(0);
    expect(result.doc.contents).toBeNull();
  });

  it("should return multiple validation errors for multiple issues", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: Promoter
    name: invalidPromoter
  - type: Protein
    name: invalidProtein
  - type: Terminator
    name: invalidTerminator
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(3);
    expect(result.issues[0].path).toEqual([0, "chain", 0, "name"]);
    expect(result.issues[1].path).toEqual([0, "chain", 1, "name"]);
    expect(result.issues[2].path).toEqual([0, "chain", 2, "name"]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return errors when chain item has extra properties", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: Promoter
    name: PromoterA
    extra: notAllowed
  - type: Protein
    name: ProteinA
  - type: Terminator
    name: TerminatorA
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].path).toEqual([0, "chain", 0]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should return errors when chain is missing", () => {
    // Arrange
    const invalidContent = `
- notChain:
  - type: Promoter
    name: PromoterA
`;

    // Act
    const result = parseAndCheck(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(2); // 1 for missing chain and 1 for containing invalid key
    expect(result.issues[0].path).toEqual([0, "chain"]);
    expect(result.issues[1].path).toEqual([0]);
    expect(result.doc.contents).not.toBeNull();
  });

  it("should handle multiple chains in the content", () => {
    // Arrange
    const validContent = `
- chain:
    - type: Promoter
      name: PromoterA
    - type: Protein
      name: ProteinA
    - type: Terminator
      name: TerminatorA
- chain:
    - type: Promoter
      name: PromoterA
    - type: Protein
      name: ProteinA
    - type: Terminator
      name: TerminatorA
`;

    // Act
    const result = parseAndCheck(validContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.issues).toHaveLength(0);
    expect(result.doc.contents).not.toBeNull();
  });
});
