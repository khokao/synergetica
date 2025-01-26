import { PartEditManager } from "@/components/circuit/operator/parts-manager/part-edit-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockEditPart = vi.fn();

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    PromoterA: {
      name: "PromoterA",
      description: "PromoterA Description",
      category: "Promoter",
      sequence: "ATGC",
      controlBy: [],
      params: {
        Ydef: 1.0,
      },
    },
  };
  const proteinParts = {
    ProteinA: {
      name: "ProteinA",
      description: "ProteinA Description",
      category: "Protein",
      sequence: "ATGC",
      controlBy: [],
      params: {
        Dp: 0,
        TIRb: 0,
      },
    },
  };
  const terminatorParts = {
    TerminatorA: {
      name: "TerminatorA",
      description: "TerminatorA Description",
      category: "Terminator",
      sequence: "ATGC",
      controlBy: [],
      params: {},
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
      editPart: mockEditPart,
    }),
  };
});

describe("PartEditManager Component", () => {
  it("renders edit button with tooltip", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await user.hover(screen.getByTestId("part-edit-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Edit parts");
    });
  });

  it("opens popover and displays parts when edit button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-edit-button"));

    // Assert
    expect(screen.getByText("PromoterA")).toBeInTheDocument();
    expect(screen.getByText("ProteinA")).toBeInTheDocument();
    expect(screen.getByText("TerminatorA")).toBeInTheDocument();
  });

  it("opens edit dialog with correct content when a part is selected", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-edit-button"));
    await user.click(screen.getByText("PromoterA"));

    // Assert
    expect(screen.getByText("Edit PromoterA")).toBeInTheDocument();
    expect(screen.getByText("Update the specifications for this part.")).toBeInTheDocument();
    expect(screen.getByText("DNA Sequence")).toBeInTheDocument();
    expect(screen.getByText("Controlled By")).toBeInTheDocument();
  });

  it("updates the part when save button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-edit-button"));
    await user.click(screen.getByText("PromoterA"));

    await user.clear(screen.getByLabelText("DNA Sequence"));
    await user.type(screen.getByLabelText("DNA Sequence"), "GGCC");

    await user.click(screen.getByTestId("part-edit-save-button"));

    // Assert
    await waitFor(() => {
      expect(mockEditPart).toHaveBeenCalledWith("PromoterA", expect.objectContaining({ sequence: "GGCC" }));
    });
  });

  it("closes the dialog when cancel button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-edit-button"));
    await user.click(screen.getByText("PromoterA"));
    await user.click(screen.getByTestId("part-edit-cancel-button"));

    // Assert
    expect(screen.queryByText("Edit testPart")).not.toBeInTheDocument();
  });
});
