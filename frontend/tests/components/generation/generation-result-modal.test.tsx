import { GenerationResultModal } from "@/components/generation/generation-result-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/generation/circuit-preview", () => ({
  CircuitPreview: () => <div data-testid="circuit-preview" />,
}));

vi.mock("@/components/generation/parameter-preview", () => ({
  ParameterPreview: () => <div data-testid="parameter-preview" />,
}));

vi.mock("@/components/generation/sequence-preview", () => ({
  SequencePreview: () => <div data-testid="sequence-preview" />,
}));

vi.mock("@/components/generation/export-button", () => ({
  ExportButton: () => (
    <button type="button" data-testid="export-button">
      Export
    </button>
  ),
}));

describe("GenerationResultModal Component", () => {
  it("renders the trigger button and opens modal when clicked", async () => {
    // Arrange
    const mockData = { parent2child_details: { group1: [{ sequence: "ATGC" }] } };
    const mockSnapshot = {
      nodes: [],
      edges: [],
      proteinParameter: {},
    };

    // Act
    render(
      <TooltipProvider>
        <GenerationResultModal data={mockData} snapshot={mockSnapshot} />
      </TooltipProvider>,
    );
    userEvent.click(screen.getByTestId("dna-button"));

    // Assert
    waitFor(() => {
      expect(screen.getByTestId("circuit-preview")).toBeInTheDocument();
      expect(screen.getByTestId("parameter-preview")).toBeInTheDocument();
      expect(screen.getByTestId("sequence-preview")).toBeInTheDocument();
      expect(screen.getByTestId("export-button")).toBeInTheDocument();
    });
  });

  it("disables the trigger button when data is null", () => {
    // Arrange
    const mockData = null;
    const mockSnapshot = null;

    // Act
    render(
      <TooltipProvider>
        <GenerationResultModal data={mockData} snapshot={mockSnapshot} />
      </TooltipProvider>,
    );

    // Assert
    const triggerButton = screen.getByTestId("dna-button");
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton).toBeDisabled();
  });
});
