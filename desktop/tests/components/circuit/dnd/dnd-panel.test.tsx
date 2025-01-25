import { useDnD } from "@/components/circuit/dnd/dnd-context";
import { DnDProvider } from "@/components/circuit/dnd/dnd-context";
import { DnDPanel } from "@/components/circuit/dnd/dnd-panel";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const TestComponent = () => {
  const { dndCategory } = useDnD();
  return <div data-testid="current-category">{dndCategory}</div>;
};

describe("DnDPanel", () => {
  it("displays the tooltip when hovering over an icon", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <DnDProvider>
        <DnDPanel />
      </DnDProvider>,
    );

    // Act
    await user.hover(screen.getByTestId("icon-Promoter"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Promoter" })).toBeInTheDocument();
    });
  });

  it("calls the onDragStart function with the correct node category when dragging starts", () => {
    // Arrange
    render(
      <DnDProvider>
        <DnDPanel />
        <TestComponent />
      </DnDProvider>,
    );

    // Act
    fireEvent.dragStart(screen.getByTestId("icon-Promoter"));

    // Assert
    expect(screen.getByTestId("current-category")).toHaveTextContent("Promoter");
  });
});
