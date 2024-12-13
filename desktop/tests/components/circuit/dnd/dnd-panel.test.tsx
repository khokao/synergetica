import { DnDPanel } from "@/components/circuit/dnd/dnd-panel";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const setDnDCategoryMock = vi.fn();

vi.mock("@/components/circuit/dnd/dnd-context", () => ({
  useDnD: () => [null, setDnDCategoryMock],
}));

describe("DnDPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays the tooltip when hovering over an icon", async () => {
    // Arrange
    render(<DnDPanel />);

    // Act
    userEvent.hover(screen.getByTestId("icon-Promoter"));
    userEvent.hover(screen.getByTestId("icon-Protein"));
    userEvent.hover(screen.getByTestId("icon-Terminator"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Promoter" })).toBeInTheDocument();
      expect(screen.getByRole("tooltip", { name: "Protein" })).toBeInTheDocument();
      expect(screen.getByRole("tooltip", { name: "Terminator" })).toBeInTheDocument();
    });
  });

  it("calls the onDragStart function with the correct node category when dragging starts", () => {
    // Arrange
    render(<DnDPanel />);

    // Act
    fireEvent.dragStart(screen.getByTestId("icon-Promoter"));

    // Assert
    expect(setDnDCategoryMock).toHaveBeenCalledWith("Promoter");
  });
});
