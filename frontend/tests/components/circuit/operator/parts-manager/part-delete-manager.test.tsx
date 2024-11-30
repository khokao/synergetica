import { PartDeleteManager } from "@/components/circuit/operator/parts-manager/part-delete-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockDeletePart = vi.fn((p) => {});

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    testPromoterName: {
      name: "testPromoterName",
      description: "Test Promoter Description",
      category: "promoter",
      controlBy: [],
      controlTo: [],
    },
  };
  const proteinParts = {
    testProteinName: {
      name: "testProteinName",
      description: "Test Protein Description",
      category: "protein",
      controlBy: [],
      controlTo: [],
    },
  };
  const terminatorParts = {
    testTerminatorName: {
      name: "testTerminatorName",
      description: "Test Terminator Description",
      category: "terminator",
      controlBy: [],
      controlTo: [],
    },
  };

  return {
    useParts: () => ({
      parts: {
        ...promoterParts,
        ...proteinParts,
        ...terminatorParts,
      },
      promoterParts: promoterParts,
      proteinParts: proteinParts,
      terminatorParts: terminatorParts,
      deletePart: mockDeletePart,
    }),
  };
});

describe("PartDeleteManager Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders delete button with tooltip", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.hover(screen.getByTestId("part-delete-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Delete parts" })).toBeInTheDocument();
    });
  });

  it("opens popover and displays parts when delete button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-delete-button"));

    // Assert
    expect(screen.getByText("testPromoterName")).toBeInTheDocument();
    expect(screen.getByText("testProteinName")).toBeInTheDocument();
    expect(screen.getByText("testTerminatorName")).toBeInTheDocument();
  });

  it("opens delete dialog with correct content when a part is selected", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-delete-button"));
    await userEvent.click(screen.getByText("testPromoterName"));

    // Assert
    expect(screen.getByText("Delete testPromoterName")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this part?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("cancels deletion when cancel button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-delete-button"));
    await userEvent.click(screen.getByText("testPromoterName"));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Assert
    expect(screen.queryByText("Delete testPromoterName")).not.toBeInTheDocument();
    expect(screen.queryByText("Are you sure you want to delete this part?")).not.toBeInTheDocument();
  });

  it("calls deletePart and closes dialog when delete button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-delete-button"));
    await userEvent.click(screen.getByText("testPromoterName"));
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Assert
    expect(mockDeletePart).toHaveBeenCalledWith("testPromoterName");
    expect(screen.queryByText("Delete testPromoterName")).not.toBeInTheDocument();
    expect(screen.queryByText("Are you sure you want to delete this part?")).not.toBeInTheDocument();
  });
});
