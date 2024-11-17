import { describe, it, expect } from 'vitest';
import { strictCircuitSchema } from '@/components/editor/schemas/strictSchema';


const validPromoterName = 'PameR';
const validProteinName = 'AmeR';
const validTerminatorName = 'L3S3P31';


describe('strictCircuitSchema', () => {

  it('should successfully parse a valid circuit with promoter(s), protein(s), and terminator', () => {
    // Arrange
    const validCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(validCircuit);

    // Assert
    expect(result.success).toBe(true);
  });

  it('should fail when the chain does not start with a promoter', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when the chain does not end with a terminator', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'protein', name: validProteinName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when a promoter appears after proteins', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'protein', name: validProteinName },
          { type: 'promoter', name: validPromoterName },
          { type: 'terminator', name: validTerminatorName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when a terminator appears before proteins', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'terminator', name: validTerminatorName },
          { type: 'protein', name: validProteinName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when elements appear after the terminator', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
          { type: 'protein', name: validProteinName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when chain items have invalid names', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: 'invalidPromoter' },
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when chain has extra properties', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName },
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
        ],
        extraProperty: 'not allowed',
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

  it('should fail when chain item has extra properties', () => {
    // Arrange
    const invalidCircuit = [
      {
        chain: [
          { type: 'promoter', name: validPromoterName, extra: 'not allowed' },
          { type: 'protein', name: validProteinName },
          { type: 'terminator', name: validTerminatorName },
        ],
      },
    ];

    // Act
    const result = strictCircuitSchema.safeParse(invalidCircuit);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should fail when chain is missing', () => {
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

  it('should fail when chain is empty', () => {
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
