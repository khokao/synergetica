import { PartAddManager } from "@/components/circuit/operator/parts-manager/part-add-manager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockAddPart = vi.fn();

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
      addPart: mockAddPart,
    }),
  };
});

describe("PartAddManager Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders add button with tooltip", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await user.hover(screen.getByTestId("part-add-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Add parts");
    });
  });

  it("opens dialog when add button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-add-button"));

    // Assert
    expect(screen.getByText("Add New Part")).toBeInTheDocument();
    expect(screen.getByText("Fill in the necessary information to create a new part.")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("DNA Sequence")).toBeInTheDocument();
  });

  it('shows ControlFields and ParamsFields when category is "promoter"', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-add-button"));
    fireEvent.click(screen.getByText("Select category"));
    await user.click(within(await screen.findByRole("listbox")).getByText("Promoter"));

    // Assert
    waitFor(() => {
      expect(screen.getByText("Controlled By")).toBeInTheDocument();
      expect(screen.getByText("Parameters")).toBeInTheDocument();
    });
  });

  it('shows ParamsFields when category is "protein"', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-add-button"));
    fireEvent.click(screen.getByText("Select category"));
    await user.click(within(await screen.findByRole("listbox")).getByText("Protein"));

    // Assert
    waitFor(() => {
      expect(screen.getByText("Controlled By")).not.toBeInTheDocument();
      expect(screen.getByText("Parameters")).toBeInTheDocument();
    });
  });

  it("closes dialog when cancel button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <PartAddManager />
      </TooltipProvider>,
    );

    // Act
    await user.click(screen.getByTestId("part-add-button"));
    await user.click(screen.getByTestId("part-add-cancel-button"));

    // Assert
    expect(screen.queryByText("Add New Part")).not.toBeInTheDocument();
  });
});
