import { GenerationResultModal } from "@/components/generation/generation-result-modal";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

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
  it("renders the modal content when isOpen is true", () => {
    // Arrange
    const mockData = { parent2child_details: { group1: [{ sequence: "ATGC" }] } };
    const mockSnapshot = {
      nodes: [],
      edges: [],
      proteinParameter: {},
    };

    const setIsOpen = vi.fn();

    // Act
    render(<GenerationResultModal data={mockData} snapshot={mockSnapshot} isOpen={true} setIsOpen={setIsOpen} />);

    // Assert
    expect(screen.getByTestId("circuit-preview")).toBeInTheDocument();
    expect(screen.getByTestId("parameter-preview")).toBeInTheDocument();
    expect(screen.getByTestId("sequence-preview")).toBeInTheDocument();
    expect(screen.getByTestId("export-button")).toBeInTheDocument();
  });

  it("does not render the modal content when isOpen is false", () => {
    // Arrange
    const mockData = { parent2child_details: { group1: [{ sequence: "ATGC" }] } };
    const mockSnapshot = {
      nodes: [],
      edges: [],
      proteinParameter: {},
    };

    const setIsOpen = vi.fn();

    // Act
    render(<GenerationResultModal data={mockData} snapshot={mockSnapshot} isOpen={false} setIsOpen={setIsOpen} />);

    // Assert
    expect(screen.queryByTestId("circuit-preview")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parameter-preview")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sequence-preview")).not.toBeInTheDocument();
    expect(screen.queryByTestId("export-button")).not.toBeInTheDocument();
  });
});
