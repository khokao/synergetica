import { ConverterProvider, useConverter } from "@/components/simulation/contexts/converter-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it } from "vitest";

const TestComponent: React.FC = () => {
  const { convertResult, setConvertResult } = useConverter();

  return (
    <div>
      <span data-testid="convert-result">
        {convertResult
          ? `Function: ${convertResult.function_str}, Valid: ${convertResult.valid}, Proteins: ${JSON.stringify(convertResult.protein_id2name)}`
          : "No result"}
      </span>
      <button
        type="button"
        onClick={() =>
          setConvertResult({
            protein_id2name: { foo: "Protein A", bar: "Protein B" },
            function_str: "Test function",
            valid: true,
          })
        }
      >
        Set Result
      </button>
    </div>
  );
};

describe("ConverterContext", () => {
  it("provides a default null value for convertResult when used within a ConverterProvider", () => {
    // Arrange & Act
    render(
      <ConverterProvider>
        <TestComponent />
      </ConverterProvider>,
    );

    // Assert
    expect(screen.getByTestId("convert-result").textContent).toBe("No result");
  });

  it("updates convertResult when setConvertResult is called", async () => {
    // Arrange
    render(
      <ConverterProvider>
        <TestComponent />
      </ConverterProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("button", { name: /set result/i }));

    // Assert
    expect(screen.getByTestId("convert-result").textContent).toBe(
      'Function: Test function, Valid: true, Proteins: {"foo":"Protein A","bar":"Protein B"}',
    );
  });
});
