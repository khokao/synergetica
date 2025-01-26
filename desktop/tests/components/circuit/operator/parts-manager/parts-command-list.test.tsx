import { PartsCommandList } from "@/components/circuit/operator/parts-manager/parts-command-list";
import { Popover } from "@/components/ui/popover";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
    }),
  };
});

describe("PartsCommandList", () => {
  it("displays Promoter, Protein, and Terminator parts by default", () => {
    // Arrange & Act
    render(
      <Popover>
        <PartsCommandList onSelect={vi.fn()} />
      </Popover>,
    );

    // Assert
    expect(screen.getByText("PromoterA")).toBeInTheDocument();
    expect(screen.getByText("ProteinA")).toBeInTheDocument();
    expect(screen.getByText("TerminatorA")).toBeInTheDocument();
  });

  it("only displays specified categories via includeCategories", () => {
    // Arrange & Act
    render(
      <Popover>
        <PartsCommandList onSelect={vi.fn()} includeCategories={["Promoter", "Terminator"]} />
      </Popover>,
    );

    // Assert
    expect(screen.getByText("PromoterA")).toBeInTheDocument();
    expect(screen.getByText("TerminatorA")).toBeInTheDocument();
    expect(screen.queryByText("ProteinA")).toBeNull();
  });

  it('shows "No results found." if no matching parts are found', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <Popover>
        <PartsCommandList onSelect={vi.fn()} />
      </Popover>,
    );

    // Act
    await user.type(screen.getByPlaceholderText("Search parts..."), "Unknown");

    // Assert
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("calls onSelect when a part is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const mockOnSelect = vi.fn();
    render(
      <Popover>
        <PartsCommandList onSelect={mockOnSelect} />
      </Popover>,
    );

    // Act
    await user.click(screen.getByText("PromoterA"));

    // Assert
    expect(mockOnSelect).toHaveBeenCalledWith("PromoterA");
  });
});
