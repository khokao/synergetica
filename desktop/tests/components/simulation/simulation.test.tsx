import { useEditorContext } from "@/components/editor/editor-context";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { Simulation } from "@/components/simulation/simulation";
import { render, screen } from "@testing-library/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: vi.fn(),
}));

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

vi.mock("@/components/simulation/chart", () => ({
  Chart: vi.fn(() => <div>Mocked Chart</div>),
}));

vi.mock("@/components/simulation/sliders", () => ({
  Sliders: vi.fn(() => <div>Mocked Sliders</div>),
}));

vi.mock("@/components/generation/generation-buttons", () => ({
  GenerationButtons: vi.fn(() => <div>Mocked Generation Buttons</div>),
}));

describe("Simulation Component", () => {
  it("displays message for empty circuit when validationError is null", () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: null });
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Empty circuit.")).toBeInTheDocument();
    expect(screen.getByText("Build the circuit first.")).toBeInTheDocument();
  });

  it("displays message for invalid circuit when validationError has errors", () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({
      validationError: [{ message: "Error", line: 1 }],
    });
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Invalid circuit.")).toBeInTheDocument();
    expect(screen.getByText("Please check the validation error.")).toBeInTheDocument();
  });

  it("displays message when no simulation data and validationError is empty", () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: [] });
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("No simulation data.")).toBeInTheDocument();
    expect(screen.getByText("Click 'Simulate' button.")).toBeInTheDocument();
  });

  it("renders Chart, Sliders, and GenerationButtons when validationError is empty and convertResult is available", () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: [] });
    (useConverter as Mock).mockReturnValue({ convertResult: { data: "test" } });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Mocked Chart")).toBeInTheDocument();
    expect(screen.getByText("Mocked Sliders")).toBeInTheDocument();
    expect(screen.getByText("Mocked Generation Buttons")).toBeInTheDocument();
  });
});
