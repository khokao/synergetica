import { PartAddManager } from "@/components/circuit/operator/parts-manager/part-add-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockAddPart = vi.fn();

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
      addPart: mockAddPart,
    }),
  };
});

describe("PartAddManager Component", () => {
  beforeEach(() => {
    mockAddPart.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders add button with tooltip", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.hover(screen.getByTestId("part-add-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Add parts");
    });
  });

  it("opens dialog when add button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-add-button"));

    // Assert
    expect(screen.getByText("Add New Part")).toBeInTheDocument();
    expect(screen.getByText("Fill in the necessary information to create a new part.")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("DNA Sequence")).toBeInTheDocument();
    expect(screen.getByText("Controlled By")).toBeInTheDocument();
    expect(screen.getByText("Control To")).toBeInTheDocument();
  });

  it('shows MetaFields when category is "protein"', async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-add-button"));
    fireEvent.click(screen.getByText("Select category"));
    await userEvent.click(within(await screen.findByRole("listbox")).getByText("Protein"));

    // Assert
    waitFor(() => {
      expect(screen.getByText("Meta")).toBeInTheDocument();
    });
  });

  it('does not show MetaFields when category is not "protein"', async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-add-button"));
    fireEvent.click(screen.getByText("Select category"));
    await userEvent.click(within(await screen.findByRole("listbox")).getByText("Promoter"));

    // Assert
    waitFor(() => {
      expect(screen.getByText("Meta")).not.toBeInTheDocument();
    });
  });

  it("closes dialog when cancel button is clicked", async () => {
    // Arrange
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await userEvent.click(screen.getByTestId("part-add-button"));
    await userEvent.click(screen.getByTestId("part-add-cancel-button"));

    // Assert
    expect(screen.queryByText("Add New Part")).not.toBeInTheDocument();
  });
});
