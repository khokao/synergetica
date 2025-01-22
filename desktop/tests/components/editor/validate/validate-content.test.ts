import { useStrictSchema } from "@/components/editor/schemas/strict-schema";
import { validateContent } from "@/components/editor/validate/validate-content";
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

describe("createMarkers", () => {
  const { strictCircuitSchema } = useStrictSchema();

  it("returns no errors for a fully valid DSL content", () => {
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
    const result = validateContent(validContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toEqual([]);
    expect(result.validationErrors).toEqual([]);
  });

  it("returns an error when Promoter is missing at the start of the chain", () => {
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
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toHaveLength(1);
    expect(result.validationErrors).toEqual([
      {
        message: "Chain must start with Promoter(s).",
        line: 4 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns an error when Protein is missing after Promoter", () => {
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
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toHaveLength(1);
    expect(result.validationErrors).toEqual([
      {
        message: "Protein(s) must follow Promoter(s) before a Terminator.",
        line: 6 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns an error when Terminator is missing at the end of the chain", () => {
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
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toHaveLength(1);
    expect(result.validationErrors).toEqual([
      {
        message: "Chain must end with a Terminator.",
        line: 4 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns no markers and null errors when the content is empty", () => {
    // Arrange
    const emptyContent = "";

    // Act
    const result = validateContent(emptyContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toEqual([]);
    expect(result.validationErrors).toBeNull();
  });

  it("returns multiple errors for invalid part names", () => {
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
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.validationErrors).toEqual([
      {
        message: "Invalid enum value. Expected 'PromoterA', received 'invalidPromoter'",
        line: 3 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
      {
        message: "Invalid enum value. Expected 'ProteinA', received 'invalidProtein'",
        line: 5 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
      {
        message: "Invalid enum value. Expected 'TerminatorA', received 'invalidTerminator'",
        line: 7 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns an error for extra properties in a chain item", () => {
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
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.validationErrors).toEqual([
      {
        message: "Unexpected key in chain item.",
        line: 2 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns errors when 'chain' key is missing or replaced with an invalid key", () => {
    // Arrange
    const invalidContent = `
- notChain:
  - type: Promoter
    name: PromoterA
`;

    // Act
    const result = validateContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.validationErrors).toEqual([
      {
        message: "The 'chain' key must contain an array of chain items.",
        line: 1 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
      {
        message: "Unexpected key in chain object. Only 'chain' is allowed.",
        line: 1 + 1, // 1-based index and 1 line for \n at the start of the content.
      },
    ]);
  });

  it("returns no errors for multiple valid chains in one file", () => {
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
    const result = validateContent(validContent, strictCircuitSchema);

    // Assert
    expect(result.markers).toEqual([]);
    expect(result.validationErrors).toEqual([]);
  });
});
