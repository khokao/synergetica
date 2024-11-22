import { looseCircuitSchema } from "@/components/editor/schemas/looseSchema";
// tests/looseSchema.test.ts
import { describe, expect, it } from "vitest";

describe("looseCircuitSchema", () => {
  it("should parse a valid looseCircuitSchema successfully", () => {
    // Arrange
    const validSchema = [
      {
        chain: [{ type: "promoter" }, { type: "protein" }, { type: "terminator" }],
      },
    ];

    // Act
    const result = looseCircuitSchema.safeParse(validSchema);

    // Assert
    expect(result.success).toBe(true);
  });

  it("should fail when an invalid type is present in the chain", () => {
    // Arrange
    const invalidSchema = [
      {
        chain: [{ type: "promoter" }, { type: "invalidType" }],
      },
    ];

    // Act
    const result = looseCircuitSchema.safeParse(invalidSchema);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when the chain property is missing", () => {
    // Arrange
    const invalidSchema = [
      {
        // chain property is missing
      },
    ];

    // Act
    const result = looseCircuitSchema.safeParse(invalidSchema);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when extra properties are present in looseChain", () => {
    // Arrange
    const invalidSchema = [
      {
        chain: [{ type: "promoter" }],
        extraProperty: "not allowed",
      },
    ];

    // Act
    const result = looseCircuitSchema.safeParse(invalidSchema);

    // Assert
    expect(result.success).toBe(false);
  });
});
