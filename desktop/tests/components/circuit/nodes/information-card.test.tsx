import { InformationCard } from "@/components/circuit/nodes/information-card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/circuit/parts/parts-context", () => {
  const PromoterA = {
    name: "PromoterA",
    description: "PromoterA Description",
    category: "Promoter",
    sequence: "ATGC",
    controlBy: [
      {
        name: "ProteinA",
        type: "Repression",
      },
    ],
    controlTo: [],
  };
  const ProteinA = {
    name: "ProteinA",
    description: "ProteinA Description",
    category: "Protein",
    sequence: "ATGC",
    controlBy: [],
    controlTo: [
      {
        name: "PromoterA",
        type: "Repression",
      },
    ],
  };
  const TerminatorA = {
    name: "TerminatorA",
    description: "TerminatorA Description",
    category: "Terminator",
    sequence: "ATGC",
    controlBy: [],
    controlTo: [],
  };

  return {
    useParts: vi.fn().mockReturnValue({
      parts: {
        PromoterA: PromoterA,
        ProteinA: ProteinA,
        TerminatorA: TerminatorA,
      },
      promoterParts: { PromoterA },
      proteinParts: { ProteinA },
      terminatorParts: { TerminatorA },
      interactionStore: {
        getProteinsByPromoter: vi.fn(() => [{ from: "ProteinA", to: "PromoterA", type: "Repression" }]),
        getPromotersByProtein: vi.fn(() => [{ from: "ProteinA", to: "PromoterA", type: "Repression" }]),
      },
    }),
  };
});

describe("InformationCard", () => {
  it("renders name, description, control section for Promoter", () => {
    // Arrange & Act
    const data = { name: "PromoterA", description: "PromoterA Description", category: "Promoter" };
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByTestId("information-card-title")).toHaveTextContent(data.name);
    expect(screen.getByTestId("information-card-description")).toHaveTextContent(data.description);
    expect(screen.getByTestId("information-card-content")).toHaveTextContent("PromoterA");
    expect(screen.getByTestId("repression-icon")).toBeInTheDocument();
    expect(screen.getByTestId("information-card-content")).toHaveTextContent("ProteinA");
  });

  it("renders name, description, control section for Protein", () => {
    // Arrange & Act
    const data = { name: "ProteinA", description: "ProteinA Description", category: "Protein" };
    render(<InformationCard data={data} />);

    // Assert
    expect(screen.getByTestId("information-card-title")).toHaveTextContent(data.name);
    expect(screen.getByTestId("information-card-description")).toHaveTextContent(data.description);
    expect(screen.getByTestId("information-card-content")).toHaveTextContent("PromoterA");
    expect(screen.getByTestId("repression-icon")).toBeInTheDocument();
    expect(screen.getByTestId("information-card-content")).toHaveTextContent("ProteinA");
  });

  it("renders name, description, sequence section for Terminator", () => {
    // Arrange & Act
    const data = {
      name: "TerminatorA",
      description: "TerminatorA Description",
      category: "Terminator",
      sequence: "ATGC",
    };
    render(<InformationCard data={data} />);

    expect(screen.getByTestId("information-card-title")).toHaveTextContent(data.name);
    expect(screen.getByTestId("information-card-description")).toHaveTextContent(data.description);
    expect(screen.getByTestId("information-card-content")).toHaveTextContent(data.sequence);
  });
});
