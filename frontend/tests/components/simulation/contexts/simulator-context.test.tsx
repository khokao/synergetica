import { SimulatorProvider, useSimulator } from "@/components/simulation/contexts/simulator-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { describe, expect, it } from "vitest";

const TestComponent: React.FC = () => {
  const { simulationResult, setSimulationResult } = useSimulator();

  return (
    <div>
      <span data-testid="simulation-result">{simulationResult ? JSON.stringify(simulationResult) : "No result"}</span>
      <button
        type="button"
        onClick={() =>
          setSimulationResult([
            [1, 2],
            [3, 4],
          ])
        }
      >
        Set Result
      </button>
    </div>
  );
};

describe("SimulatorContext", () => {
  it("provides a default null value for simulationResult when used within a SimulatorProvider", () => {
    // Arrange & Act
    render(
      <SimulatorProvider>
        <TestComponent />
      </SimulatorProvider>,
    );

    // Assert
    expect(screen.getByTestId("simulation-result").textContent).toBe("No result");
  });

  it("updates simulationResult when setSimulationResult is called", async () => {
    // Arrange
    render(
      <SimulatorProvider>
        <TestComponent />
      </SimulatorProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("button", { name: /set result/i }));

    // Assert
    expect(screen.getByTestId("simulation-result").textContent).toBe(
      JSON.stringify([
        [1, 2],
        [3, 4],
      ]),
    );
  });
});
