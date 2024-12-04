import { PartEditManager } from "@/components/circuit/operator/parts-manager/part-edit-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockEditPart = vi.fn((p) => {});

vi.mock("@/components/circuit/parts/parts-context", () => {
  const promoterParts = {
    testPromoterName: {
      name: "testPromoterName",
      description: "Test Promoter Description",
      category: "Promoter",
      sequence: "ATGC",
      controlBy: [],
      controlTo: [],
      meta: null,
    },
  };
  const proteinParts = {
    testProteinName: {
      name: "testProteinName",
      description: "Test Protein Description",
      category: "Protein",
      sequence: "ATGC",
      controlBy: [],
      controlTo: [],
      meta: {
        Pmax: 0,
        Ymax: 0,
        Ymin: 0,
        K: 0,
        n: 0,
        Dp: 0,
      },
    },
  };
  const terminatorParts = {
    testTerminatorName: {
      name: "testTerminatorName",
      description: "Test Terminator Description",
      category: "Terminator",
      sequence: "ATGC",
      controlBy: [],
      controlTo: [],
      meta: null,
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
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.hover(screen.getByTestId("part-edit-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Edit parts");
    });
  });

  it("opens popover and displays parts when edit button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-edit-button"));

    // Assert
    expect(screen.getByText("testPromoterName")).toBeInTheDocument();
    expect(screen.getByText("testProteinName")).toBeInTheDocument();
    expect(screen.getByText("testTerminatorName")).toBeInTheDocument();
  });

  it("opens edit dialog with correct content when a part is selected", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-edit-button"));
    await userEvent.click(screen.getByText("testPromoterName"));

    // Assert
    expect(screen.getByText("Edit testPromoterName")).toBeInTheDocument();
    expect(screen.getByText("Update the specifications for this part.")).toBeInTheDocument();
    expect(screen.getByText("DNA Sequence")).toBeInTheDocument();
    expect(screen.getByText("Controlled By")).toBeInTheDocument();
    expect(screen.getByText("Control To")).toBeInTheDocument();
  });

  it("updates the part when save button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-edit-button"));
    await userEvent.click(screen.getByText("testPromoterName"));

    await userEvent.clear(screen.getByLabelText("DNA Sequence"));
    await userEvent.type(screen.getByLabelText("DNA Sequence"), "GGCC");

    await userEvent.click(screen.getByTestId("part-edit-save-button"));

    // Assert
    await waitFor(() => {
      expect(mockEditPart).toHaveBeenCalledWith("testPromoterName", expect.objectContaining({ sequence: "GGCC" }));
    });
  });

  it("closes the dialog when cancel button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartEditManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-edit-button"));
    await userEvent.click(screen.getByText("testPromoterName"));
    await userEvent.click(screen.getByTestId("part-edit-cancel-button"));

    // Assert
    expect(screen.queryByText("Edit testPart")).not.toBeInTheDocument();
  });
});
