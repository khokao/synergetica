import { DnDProvider, useDnD } from "@/components/circuit/dnd/dnd-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it } from "vitest";

const TestComponent: React.FC = () => {
  const [dndCategory, setDnDCategory] = useDnD();

  return (
    <div>
      <span data-testid="dnd-category">{dndCategory || "No category"}</span>
      <button type="button" onClick={() => setDnDCategory("Test Category")}>
        Set Category
      </button>
    </div>
  );
};

describe("DnDContext", () => {
  it("provides a default null value for the category when used within a DnDProvider", () => {
    // Arrange
    render(
      <DnDProvider>
        <TestComponent />
      </DnDProvider>,
    );

    // Act
    const dndCategoryElement = screen.getByTestId("dnd-category");

    // Assert
    expect(dndCategoryElement.textContent).toBe("No category");
  });

  it("updates the category when setDnDCategory is called", async () => {
    // Arrange
    render(
      <DnDProvider>
        <TestComponent />
      </DnDProvider>,
    );
    const user = userEvent.setup();

    // Act
    const button = screen.getByRole("button", { name: /set category/i });
    await user.click(button);

    // Assert
    const dndCategoryElement = screen.getByTestId("dnd-category");
    expect(dndCategoryElement.textContent).toBe("Test Category");
  });
});
