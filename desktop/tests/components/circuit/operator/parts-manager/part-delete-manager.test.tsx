import { PartDeleteManager } from "@/components/circuit/operator/parts-manager/part-delete-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockDeletePart = vi.fn();

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    PromoterA: {
      name: "PromoterA",
      description: "PromoterA Description",
      category: "Promoter",
      controlBy: [],
    },
  };
  const proteinParts = {
    ProteinA: {
      name: "ProteinA",
      description: "ProteinA Description",
      category: "Protein",
      controlBy: [],
    },
  };
  const terminatorParts = {
    TerminatorA: {
      name: "TerminatorA",
      description: "TerminatorA Description",
      category: "Terminator",
      controlBy: [],
    },
  };

  return {
    useParts: () => ({
      promoterParts: promoterParts,
      proteinParts: proteinParts,
      terminatorParts: terminatorParts,
      deletePart: mockDeletePart,
    }),
  };
});

describe("PartDeleteManager Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders delete button with tooltip", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await user.hover(screen.getByTestId("part-delete-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Delete parts" })).toBeInTheDocument();
    });
  });

  it("opens popover and displays parts when delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-delete-button"));

    // Assert
    expect(screen.getByText("PromoterA")).toBeInTheDocument();
    expect(screen.getByText("ProteinA")).toBeInTheDocument();
    expect(screen.getByText("TerminatorA")).toBeInTheDocument();
  });

  it("opens delete dialog with correct content when a part is selected", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-delete-button"));
    await user.click(screen.getByText("PromoterA"));

    // Assert
    expect(screen.getByText("Delete PromoterA")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this part?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("cancels deletion when cancel button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-delete-button"));
    await user.click(screen.getByText("PromoterA"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Assert
    expect(screen.queryByText("Delete PromoterA")).not.toBeInTheDocument();
    expect(screen.queryByText("Are you sure you want to delete this part?")).not.toBeInTheDocument();
  });

  it("calls deletePart and closes dialog when delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartDeleteManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-delete-button"));
    await user.click(screen.getByText("PromoterA"));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Assert
    expect(mockDeletePart).toHaveBeenCalledWith("PromoterA");
    expect(screen.queryByText("Delete PromoterA")).not.toBeInTheDocument();
    expect(screen.queryByText("Are you sure you want to delete this part?")).not.toBeInTheDocument();
  });
});
