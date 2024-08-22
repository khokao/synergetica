import { Simulation } from "@/components/Simulation/Simulation";
import { callGeneratorAPI } from "@/hooks/useGeneratorAPI";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
import { fireEvent, render, screen } from "@testing-library/react";
import useSWR from "swr";
import { type Mock, vi } from "vitest";

vi.mock("@/hooks/useGeneratorAPI", () => ({
  callGeneratorAPI: vi.fn(),
}));

vi.mock("swr", () => ({
  default: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
}));

describe("Simulation Component", () => {
  const mockConvertResult: ConverterResponseData = {
    num_protein: 2,
    proteins: ["B3MR1", "AmeR"],
    function_str:
      "def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[0]\n\td1dt = 1e-05 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[2]\n\td3dt = 1e-05 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)",
  };

  const mockReseter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(<Simulation ConvertResult={mockConvertResult} reseter={mockReseter} />);

    /*expect(screen.getByTestId("graph-component")).toBeInTheDocument();*/

    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Generate")).toBeInTheDocument();
  });

  it("calls reseter function when Reset button is clicked", () => {
    render(<Simulation ConvertResult={mockConvertResult} reseter={mockReseter} />);

    fireEvent.click(screen.getByText("Reset"));

    expect(mockReseter).toHaveBeenCalledTimes(1);
  });
});
