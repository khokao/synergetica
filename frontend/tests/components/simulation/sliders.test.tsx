import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useProteinParameters } from "@/components/simulation/contexts/protein-parameter-context";
import { Sliders } from "@/components/simulation/sliders";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/protein-parameter-context", () => ({
  useProteinParameters: vi.fn(),
}));

vi.mock("@/components/simulation/hooks/use-websocket-simulation", () => ({
  useWebSocketSimulation: vi.fn(),
}));

describe("Sliders Component", () => {
  it("renders nothing if convertResult is not available", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    // Act
    const { container } = render(<Sliders />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders sliders when convertResult is available", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({
      convertResult: {
        protein_id2name: { foo: "Protein A", bar: "Protein B" },
      },
    });
    (useProteinParameters as Mock).mockReturnValue({
      proteinParameter: { foo: 10, bar: 20 },
      handleProteinParamChange: vi.fn(),
    });

    // Act
    render(<Sliders />);

    // Assert
    expect(screen.getByText("Protein A")).toBeInTheDocument();
    expect(screen.getByText("Protein B")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("calls handleProteinParamChange when slider value changes", () => {
    // Arrange
    const mockHandleProteinParamChange = vi.fn();

    (useConverter as Mock).mockReturnValue({
      convertResult: {
        protein_id2name: { foo: "Protein A", bar: "Protein B" },
      },
    });

    (useProteinParameters as Mock).mockReturnValue({
      proteinParameter: { foo: 10, bar: 20 },
      handleProteinParamChange: mockHandleProteinParamChange,
    });

    // Act
    render(<Sliders />);

    // Change slider value
    const slider = screen.getByText("Protein A");
    userEvent.pointer({ target: slider, offset: 2, keys: "[MouseLeft]" });

    // Assert
    expect(mockHandleProteinParamChange).toHaveBeenCalled();
  });
});
