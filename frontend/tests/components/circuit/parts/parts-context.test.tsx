import { PartsProvider, useParts } from "@/components/circuit/parts/parts-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@xyflow/react", () => ({
  useReactFlow: () => ({
    getNodes: vi.fn().mockReturnValue([]),
    setNodes: vi.fn(),
  }),
}));

const TestComponent = () => {
  const { parts, addPart, editPart, deletePart, promoterParts, proteinParts, terminatorParts } = useParts();

  return (
    <div>
      <div data-testid="parts">{JSON.stringify(parts)}</div>
      <button
        type="button"
        onClick={() =>
          addPart({
            name: "TestPart",
            description: "A test part",
            category: "Promoter",
            sequence: "ATGC",
            controlBy: [],
            controlTo: [],
            meta: null,
          })
        }
      >
        Add Part
      </button>

      <div data-testid="promoterParts">{JSON.stringify(promoterParts)}</div>
      <div data-testid="proteinParts">{JSON.stringify(proteinParts)}</div>
      <div data-testid="terminatorParts">{JSON.stringify(terminatorParts)}</div>

      <button
        type="button"
        onClick={() =>
          editPart("TestPart", {
            name: "TestPart",
            description: "An edited test part",
            category: "Protein",
            sequence: "CGTA",
            controlBy: [],
            controlTo: [],
            meta: null,
          })
        }
      >
        Edit Part
      </button>

      <button type="button" onClick={() => deletePart("TestPart")}>
        Delete Part
      </button>
    </div>
  );
};

describe("PartsContext", () => {
  it("should throw an error when useParts is used outside of PartsProvider", () => {
    // Arrange & Act & Assert
    const ConsoleError = console.error;
    console.error = () => {}; // Suppress expected error log

    expect(() => render(<TestComponent />)).toThrow("useParts must be used within a PartsProvider");

    console.error = ConsoleError; // Restore console.error
  });

  it("should provide default context values", () => {
    // Arrange
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );

    // Act
    const parts = screen.getByTestId("parts");
    const promoterParts = screen.getByTestId("promoterParts");
    const proteinParts = screen.getByTestId("proteinParts");
    const terminatorParts = screen.getByTestId("terminatorParts");

    // Assert
    expect(parts.textContent).not.toBe(null);
    expect(promoterParts.textContent).not.toBe(null);
    expect(proteinParts.textContent).not.toBe(null);
    expect(terminatorParts.textContent).not.toBe(null);
  });

  it("should add a new part successfully", async () => {
    // Arrange
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );
    const addButton = screen.getByText("Add Part");

    // Act
    await userEvent.click(addButton);

    // Assert
    expect(JSON.parse(screen.getByTestId("parts").textContent || "{}")).toHaveProperty("TestPart");
  });

  it("should edit an existing part successfully", async () => {
    // Arrange
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );
    const addButton = screen.getByText("Add Part");
    const editButton = screen.getByText("Edit Part");

    await userEvent.click(addButton);

    // Act
    await userEvent.click(editButton);

    // Assert
    const parts = screen.getByTestId("parts");
    const parsedParts = JSON.parse(parts.textContent || "{}");
    expect(parsedParts).toHaveProperty("TestPart");
    expect(parsedParts.TestPart.description).toBe("An edited test part");
    expect(parsedParts.TestPart.category).toBe("Protein");
  });

  it("should delete an existing part successfully", async () => {
    // Arrange
    render(
      <PartsProvider>
        <TestComponent />
      </PartsProvider>,
    );
    const addButton = screen.getByText("Add Part");
    const deleteButton = screen.getByText("Delete Part");

    await userEvent.click(addButton);

    // Act
    await userEvent.click(deleteButton);

    // Assert
    const parts = screen.getByTestId("parts");
    expect(JSON.parse(parts.textContent || "{}")).not.toHaveProperty("TestPart");
  });
});
