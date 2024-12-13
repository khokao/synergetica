import { useProteinParameters } from "@/components/simulation/hooks/use-protein-parameters";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockConvertResult = {
  protein_id2name: { foo: "Protein A", bar: "Protein B" },
  function_str: "Test function",
  valid: true,
};

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: () => ({
    convertResult: mockConvertResult,
  }),
}));

describe("useProteinParameters", () => {
  it("initializes proteinParameter with default values when convertResult is available", () => {
    // Arrange & Act
    const { result } = renderHook(() => useProteinParameters());

    // Assert
    expect(result.current.proteinParameter).toEqual({ foo: 1, bar: 1 });
  });

  it("updates proteinParameter when handleProteinParamChange is called", () => {
    // Arrange
    const { result } = renderHook(() => useProteinParameters());

    // Act
    act(() => {
      result.current.handleProteinParamChange("foo")([42]);
    });

    // Assert
    expect(result.current.proteinParameter).toEqual({ foo: 42, bar: 1 });
  });
});
