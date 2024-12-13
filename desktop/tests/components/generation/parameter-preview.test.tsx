import { ParameterPreview } from "@/components/generation/parameter-preview";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { render, screen } from "@testing-library/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/contexts/converter-context");

describe("ParameterPreview Component", () => {
  it("renders nothing when snapshot is null", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    // Act
    const { container } = render(<ParameterPreview snapshot={null} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when convertResult is null", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: null });

    const mockSnapshot = {
      proteinParameter: { foo: 10, bar: 20 },
    };

    // Act
    const { container } = render(<ParameterPreview snapshot={mockSnapshot} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders protein sliders when snapshot and convertResult are provided", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({
      convertResult: {
        protein_id2name: { foo: "Protein A", bar: "Protein B" },
      },
    });
    const mockSnapshot = {
      proteinParameter: { foo: 10, bar: 20 },
    };

    // Act
    render(<ParameterPreview snapshot={mockSnapshot} />);

    // Assert
    expect(screen.getByText("Protein A")).toBeInTheDocument();
    expect(screen.getByText("Protein B")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
