import { DEFAULT_SLIDER_PARAM } from "@/components/simulation/constants";
import {
  ProteinParameterProvider,
  useProteinParameters,
} from "@/components/simulation/contexts/protein-parameter-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
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

const TestComponent: React.FC = () => {
  const { proteinParameter, handleProteinParamChange } = useProteinParameters();

  return (
    <div>
      <div data-testid="protein-parameter">{JSON.stringify(proteinParameter)}</div>
      <button type="button" onClick={() => handleProteinParamChange("foo")([42])}>
        Change Protein foo
      </button>
    </div>
  );
};

describe("ProteinParameterContext", () => {
  it("initializes proteinParameter with default values when convertResult is available", () => {
    // Arrange & Act
    render(
      <ProteinParameterProvider>
        <TestComponent />
      </ProteinParameterProvider>,
    );

    // Assert
    expect(screen.getByTestId("protein-parameter").textContent).toBe(
      JSON.stringify({
        foo: DEFAULT_SLIDER_PARAM,
        bar: DEFAULT_SLIDER_PARAM,
      }),
    );
  });

  it("updates proteinParameter when handleProteinParamChange is called", async () => {
    // Arrange
    render(
      <ProteinParameterProvider>
        <TestComponent />
      </ProteinParameterProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("button", { name: /change protein foo/i }));

    // Assert
    expect(screen.getByTestId("protein-parameter").textContent).toBe(
      JSON.stringify({
        foo: 42,
        bar: DEFAULT_SLIDER_PARAM,
      }),
    );
  });
});
