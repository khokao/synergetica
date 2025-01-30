import { DnDProvider, useDnD } from "@/components/circuit/dnd/dnd-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const TestComponent = () => {
  const { dndCategory, setDnDCategory } = useDnD();

  return (
    <div>
      <span data-testid="dnd-category">{dndCategory || "No category"}</span>
      <button type="button" onClick={() => setDnDCategory("Promoter")}>
        Set Category
      </button>
    </div>
  );
};

describe("DnDContext", () => {
  it("provides a default null value for the category when used within a DnDProvider", () => {
    // Arrange & Act
    render(
      <DnDProvider>
        <TestComponent />
      </DnDProvider>,
    );

    // Assert
    expect(screen.getByTestId("dnd-category")).toHaveTextContent("No category");
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
    expect(screen.getByTestId("dnd-category")).toHaveTextContent("Promoter");
  });
});
