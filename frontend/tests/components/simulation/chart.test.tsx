import { Chart } from "@/components/simulation/chart";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { useSimulator } from "@/components/simulation/contexts/simulator-context";
import { render, screen } from "@testing-library/react";
import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

describe("Chart Component", () => {
  it("renders nothing if convertResult or simulationResult is not available", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({ convertResult: null });
    (useSimulator as Mock).mockReturnValue({ simulationResult: null });

    // Act
    const { container } = render(<Chart />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the chart when convertResult and simulationResult are available", () => {
    // Arrange
    (useConverter as Mock).mockReturnValue({
      convertResult: {
        protein_id2name: { foo: "Protein A", bar: "Protein B" },
      },
    });
    (useSimulator as Mock).mockReturnValue({
      simulationResult: [
        [0, 10, 20],
        [1, 15, 25],
      ],
    });

    // Act
    render(<Chart />);

    // Assert
    expect(screen.getByTestId("chart-card")).toBeInTheDocument();
  });
});
