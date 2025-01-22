import { useStrictSchema } from "@/components/editor/schemas/strict-schema";
import { describe, expect, it, vi } from "vitest";

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
            {
              name: "ProteinB",
              type: "Activation",
            },
          ],
          controlTo: [],
        },
      },
      proteinParts: {
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
        ProteinB: {
          name: "ProteinB",
          description: "ProteinB Description",
          category: "Protein",
          controlBy: [],
          controlTo: [
            {
              name: "PromoterA",
              type: "Activation",
            },
          ],
        },
      },
      terminatorParts: {
        TerminatorA: {
          name: "TerminatorA",
          description: "TerminatorA Description",
          category: "Terminator",
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
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
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Protein", name: "ProteinA" },
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Protein", name: "ProteinA" },
          { type: "Promoter", name: "PromoterA" },
          { type: "Terminator", name: "TerminatorA" },
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Terminator", name: "TerminatorA" },
          { type: "Protein", name: "ProteinA" },
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
          { type: "Protein", name: "ProteinA" },
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
          { type: "Promoter", name: "invalidPromoter" },
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
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
          { type: "Promoter", name: "PromoterA" },
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
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
          { type: "Promoter", name: "PromoterA", extra: "not allowed" },
          { type: "Protein", name: "ProteinA" },
          { type: "Terminator", name: "TerminatorA" },
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
