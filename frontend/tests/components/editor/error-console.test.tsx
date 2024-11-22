import { EditorProvider } from "@/components/editor/editor-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { EditorConsole } from "@/components/editor/error-console";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";

const TestComponent = () => {
  const { setValidationError } = useEditorContext();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setValidationError([
            { message: "Error 1", line: 10 },
            { message: "Error 2", line: 20 },
          ])
        }
      >
        Set Errors
      </button>
      <button type="button" onClick={() => setValidationError([])}>
        Clear Errors
      </button>
      <EditorConsole />
    </div>
  );
};

describe("EditorConsole", () => {
  it('should display "All Good!" when there are no validation errors', () => {
    // Arrange
    render(
      <EditorProvider>
        <EditorConsole />
      </EditorProvider>,
    );

    // Assert
    expect(screen.getByText("All Good!")).toBeInTheDocument();
    expect(screen.getByText("No syntax issues found in YAML file")).toBeInTheDocument();
  });

  it("should display validation errors when there are errors", async () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );

    const setErrorsButton = screen.getByText("Set Errors");

    // Act
    await userEvent.click(setErrorsButton);

    // Assert
    expect(screen.getByText("Validation Errors")).toBeInTheDocument();
    expect(screen.getByText("Line 10: Error 1")).toBeInTheDocument();
    expect(screen.getByText("Line 20: Error 2")).toBeInTheDocument();
  });

  it('should display "All Good!" after clearing validation errors', async () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );

    const setErrorsButton = screen.getByText("Set Errors");
    const clearErrorsButton = screen.getByText("Clear Errors");

    // Act
    await userEvent.click(setErrorsButton);
    await userEvent.click(clearErrorsButton);

    // Assert
    expect(screen.getByText("All Good!")).toBeInTheDocument();
    expect(screen.getByText("No syntax issues found in YAML file")).toBeInTheDocument();
    expect(screen.queryByText("Validation Errors")).not.toBeInTheDocument();
    expect(screen.queryByText("Line 10: Error 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Line 20: Error 2")).not.toBeInTheDocument();
  });
});
