import { EditorProvider, type ValidationError, useEditorContext } from "@/components/editor/editor-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";

const TestComponent = () => {
  const { editorContent, setEditorContent, validationError, setValidationError, editMode, setEditMode } =
    useEditorContext();

  return (
    <div>
      <div data-testid="editorContent">{editorContent}</div>
      <button type="button" onClick={() => setEditorContent("New Content")}>
        Set Editor Content
      </button>

      <div data-testid="validationError">{JSON.stringify(validationError)}</div>
      <button type="button" onClick={() => setValidationError([{ message: "Error 1", line: 1 } as ValidationError])}>
        Set Validation Error
      </button>

      <div data-testid="editMode">{editMode}</div>
      <button type="button" onClick={() => setEditMode("monaco-editor")}>
        Set Edit Mode
      </button>
    </div>
  );
};

describe("EditorContext", () => {
  it("should throw an error when useEditorContext is used outside of EditorProvider", () => {
    // Arrange & Act & Assert
    const ConsoleError = console.error;
    console.error = () => {}; // Suppress expected error log

    expect(() => render(<TestComponent />)).toThrow("useEditorContext must be used within an EditorProvider");

    console.error = ConsoleError; // Restore console.error
  });

  it("should provide default context values", () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );

    // Act
    const editorContent = screen.getByTestId("editorContent");
    const validationError = screen.getByTestId("validationError");
    const editMode = screen.getByTestId("editMode");

    // Assert
    expect(editorContent.textContent).toBe("");
    expect(validationError.textContent).toBe("[]");
    expect(editMode.textContent).toBe("reactflow");
  });

  it("should update editorContent when setEditorContent is called", async () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );
    const button = screen.getByText("Set Editor Content");
    const editorContent = screen.getByTestId("editorContent");

    // Act
    await userEvent.click(button);

    // Assert
    expect(editorContent.textContent).toBe("New Content");
  });

  it("should update validationError when setValidationError is called", async () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );
    const button = screen.getByText("Set Validation Error");
    const validationError = screen.getByTestId("validationError");

    // Act
    await userEvent.click(button);

    // Assert
    expect(validationError.textContent).toBe(JSON.stringify([{ message: "Error 1", line: 1 }]));
  });

  it("should update editMode when setEditMode is called", async () => {
    // Arrange
    render(
      <EditorProvider>
        <TestComponent />
      </EditorProvider>,
    );
    const button = screen.getByText("Set Edit Mode");
    const editMode = screen.getByTestId("editMode");

    // Act
    await userEvent.click(button);

    // Assert
    expect(editMode.textContent).toBe("monaco-editor");
  });
});
