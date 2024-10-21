import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { Simulation } from "@/components/simulation/simulation";
import { render, screen } from "@testing-library/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/simulator-context", () => ({
  useSimulator: vi.fn(),
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
  it("displays message to build circuit when convertResult is null", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: null });
    (useSimulator as Mock).mockReturnValue({ simulationResult: null });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Build the circuit")).toBeInTheDocument();
    expect(screen.getByText("and run the simulation.")).toBeInTheDocument();
  });

  it("displays message for invalid circuit when convertResult is invalid", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: { valid: false } });
    (useSimulator as Mock).mockReturnValue({ simulationResult: null });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Invalid circuit.")).toBeInTheDocument();
    expect(screen.getByText("Please check and retry.")).toBeInTheDocument();
  });

  it("renders Chart, Sliders, and GenerationButtons when convertResult is valid", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: { valid: true } });
    (useSimulator as Mock).mockReturnValue({ simulationResult: [[0, 10, 20]] });

    // Act
    render(<Simulation />);

    // Assert
    expect(screen.getByText("Mocked Chart")).toBeInTheDocument();
    expect(screen.getByText("Mocked Sliders")).toBeInTheDocument();
    expect(screen.getByText("Mocked Generation Buttons")).toBeInTheDocument();
  });
});
