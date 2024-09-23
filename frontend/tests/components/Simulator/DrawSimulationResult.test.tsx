import { Graph } from "@/components/Simulation/DrawSimulationResult";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSend = vi.fn();
const mockClose = vi.fn();

global.WebSocket = vi.fn(() => ({
  onopen: () => {},
  onmessage: () => {},
  onerror: () => {},
  send: mockSend,
  close: mockClose,
  readyState: WebSocket.OPEN,
})) as unknown as typeof WebSocket;

describe("Graph component", () => {
  const mockconvertResult: ConverterResponseData = {
    num_protein: 2,
    proteins: { RPp8K6j_urCFeMtsm2pZv: "BM3R1", QaBV3nMXJxcNaNN_hE6ji: "AmeR" },
    function_str:
      "def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[0]\n\td1dt = 1e-05 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[2]\n\td3dt = 1e-05 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize WebSocket and display protein parameters when convertResult is provided", () => {
    const setSimulatorResult = vi.fn();

    render(<Graph convertResult={mockconvertResult} setSimulatorResult={setSimulatorResult} />);

    expect(global.WebSocket).toHaveBeenCalledWith("ws://127.0.0.1:8000/ws/simulation");

    for (const protein of Object.values(mockconvertResult.proteins)) {
      const paramInput = screen.getByText(protein);
      expect(paramInput).toBeInTheDocument();
    }
  });

  it("should update protein parameter and send message via WebSocket when slider is changed", () => {
    const setSimulatorResult = vi.fn();

    render(<Graph convertResult={mockconvertResult} setSimulatorResult={setSimulatorResult} />);
    const slider = screen.getAllByRole("slider")[0];

    fireEvent.change(slider, { target: { value: "10" } });

    expect(mockSend).toHaveBeenCalledWith(
      JSON.stringify({
        params: [10, 1],
      }),
    );
  });
});
