import { useStrictSchema } from "@/components/editor/schemas/strictSchema";
import { validateDslContent } from "@/components/editor/utils/dsl-validation";
import { describe, expect, it } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  return {
    useParts: () => ({
      promoterParts: {
        testPromoterName: {
          name: "testPromoterName",
          description: "Test Promoter Description",
          category: "promoter",
          controlBy: [
            {
              name: "testProteinName",
              type: "repression",
            },
          ],
          controlTo: [],
        },
      },
      proteinParts: {
        testProteinName: {
          name: "testProteinName",
          description: "Test Protein Description",
          category: "protein",
          controlBy: [],
          controlTo: [
            {
              name: "testPromoterName",
              type: "repression",
            },
          ],
        },
      },
      terminatorParts: {
        testTerminatorName: {
          name: "testTerminatorName",
          description: "Test Terminator Description",
          category: "terminator",
          controlBy: [],
          controlTo: [],
        },
      },
    }),
  };
});

describe("validateDslContent", () => {
  const { strictCircuitSchema } = useStrictSchema();

  it("should return parsed content and no errors for valid DSL content", () => {
    // Arrange
    const validContent = `
- chain:
  - type: promoter
    name: testPromoterName
  - type: protein
    name: testProteinName
  - type: terminator
    name: testTerminatorName
`;

    // Act
    const result = validateDslContent(validContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).toHaveLength(0);
    expect(result.markers).toHaveLength(0);
  });

  it("should return validation errors and markers for invalid DSL content", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: protein
    name: testProteinName
  - type: terminator
    name: testTerminatorName
`;

    // Act
    const result = validateDslContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should return null parsed content when content is empty", () => {
    // Arrange
    const emptyContent = "";

    // Act
    const result = validateDslContent(emptyContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).toBeNull();
    expect(result.validationErrors).toBeNull();
    expect(result.markers).toHaveLength(0);
  });

  it("should return multiple validation errors for multiple issues", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: promoter
    name: invalidPromoter
  - type: protein
    name: invalidProtein
  - type: terminator
    name: invalidTerminator
`;

    // Act
    const result = validateDslContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).toHaveLength(3);
    expect(result.markers).toHaveLength(3);
  });

  it("should return errors when chain item has extra properties", () => {
    // Arrange
    const invalidContent = `
- chain:
  - type: promoter
    name: testPromoterName
    extra: notAllowed
  - type: protein
    name: testProteinName
  - type: terminator
    name: testTerminatorName
`;

    // Act
    const result = validateDslContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should return errors when chain is missing", () => {
    // Arrange
    const invalidContent = `
- notChain:
  - type: promoter
    name: testPromoterName
`;

    // Act
    const result = validateDslContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should return errors when chain is empty", () => {
    // Arrange
    const invalidContent = `
- chain: []
`;

    // Act
    const result = validateDslContent(invalidContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should handle multiple chains in the content", () => {
    // Arrange
    const validContent = `
- chain:
    - type: promoter
      name: testPromoterName
    - type: protein
      name: testProteinName
    - type: terminator
      name: testTerminatorName
- chain:
    - type: promoter
      name: testPromoterName
    - type: protein
      name: testProteinName
    - type: terminator
      name: testTerminatorName
`;

    // Act
    const result = validateDslContent(validContent, strictCircuitSchema);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).toHaveLength(0);
    expect(result.markers).toHaveLength(0);
  });
});
