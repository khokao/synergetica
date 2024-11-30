import { useStrictSchema } from "@/components/editor/schemas/strictSchema";
import { describe, expect, it, vi } from "vitest";

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
            {
              name: "testProteinName2",
              type: "activation",
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
        testProteinName2: {
          name: "testProteinName2",
          description: "Test Protein2 Description",
          category: "protein",
          controlBy: [],
          controlTo: [
            {
              name: "testPromoterName",
              type: "activation",
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

describe("strictCircuitSchema", () => {
  const { strictCircuitSchema } = useStrictSchema();

  it("should successfully parse a valid circuit with promoter(s), protein(s), and terminator", () => {
    // Arrange
    const validCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(validCircuit);

    // Assert
    expect(result.success).toBe(true);
  });

  it("should fail when the chain does not start with a promoter", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when the chain does not end with a terminator", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "protein", name: "testProteinName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when a promoter appears after proteins", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "protein", name: "testProteinName" },
          { type: "promoter", name: "testPromoterName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when a terminator appears before proteins", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "terminator", name: "testTerminatorName" },
          { type: "protein", name: "testProteinName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when elements appear after the terminator", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
          { type: "protein", name: "testProteinName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain items have invalid names", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "invalidPromoter" },
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain has extra properties", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName" },
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
        extraProperty: "not allowed",
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Unexpected key in chain object. Only 'chain' is allowed.");
    }
  });

  it("should fail when chain item has extra properties", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: "promoter", name: "testPromoterName", extra: "not allowed" },
          { type: "protein", name: "testProteinName" },
          { type: "terminator", name: "testTerminatorName" },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is missing", () => {
    // Arrange
    const invalidCircuit = [
      {
        // chain is missing
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should fail when chain is empty", () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });
});
