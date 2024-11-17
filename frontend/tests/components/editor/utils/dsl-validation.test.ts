import { validateDslContent } from "@/components/editor/utils/dsl-validation";
import { describe, expect, it } from "vitest";

const validPromoterName = "PameR";
const validProteinName = "AmeR";
const validTerminatorName = "L3S3P31";

describe("validateDslContent", () => {
  it("should return parsed content and no errors for valid DSL content", () => {
    // Arrange
    const validContent = `
- chain:
  - type: promoter
    name: ${validPromoterName}
  - type: protein
    name: ${validProteinName}
  - type: terminator
    name: ${validTerminatorName}
`;

    // Act
    const result = validateDslContent(validContent);

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
    name: ${validProteinName}
  - type: terminator
    name: ${validTerminatorName}
`;

    // Act
    const result = validateDslContent(invalidContent);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should return null parsed content when content is empty", () => {
    // Arrange
    const emptyContent = "";

    // Act
    const result = validateDslContent(emptyContent);

    // Assert
    expect(result.parsedContent).toBeNull();
    expect(result.validationErrors).toHaveLength(0);
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
    const result = validateDslContent(invalidContent);

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
    name: ${validPromoterName}
    extra: notAllowed
  - type: protein
    name: ${validProteinName}
  - type: terminator
    name: ${validTerminatorName}
`;

    // Act
    const result = validateDslContent(invalidContent);

    // Assert
    expect(result.validationErrors).not.toHaveLength(0);
    expect(result.markers).not.toHaveLength(0);
  });

  it("should return errors when chain is missing", () => {
    // Arrange
    const invalidContent = `
- notChain:
  - type: promoter
    name: ${validPromoterName}
`;

    // Act
    const result = validateDslContent(invalidContent);

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
    const result = validateDslContent(invalidContent);

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
      name: ${validPromoterName}
    - type: protein
      name: ${validProteinName}
    - type: terminator
      name: ${validTerminatorName}
- chain:
    - type: promoter
      name: ${validPromoterName}
    - type: protein
      name: ${validProteinName}
    - type: terminator
      name: ${validTerminatorName}
`;

    // Act
    const result = validateDslContent(validContent);

    // Assert
    expect(result.parsedContent).not.toBeNull();
    expect(result.validationErrors).toHaveLength(0);
    expect(result.markers).toHaveLength(0);
  });
});
