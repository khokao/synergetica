import { SimulatorButtons } from "@/components/circuit/simulation/simulator-buttons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const handleResetSimulateMock = vi.fn();
const handleRunSimulateMock = vi.fn();

vi.mock("@/components/circuit/hooks/use-run-simulator", () => ({
  useSimulate: () => ({
    handleResetSimulate: handleResetSimulateMock,
    handleRunSimulate: handleRunSimulateMock,
  }),
}));

describe("SimulatorButtons", () => {
  it("calls handleResetSimulate when the reset button is clicked", async () => {
    // Arrange
    render(<SimulatorButtons />);

    // Act
    await userEvent.click(screen.getByTestId("simulation-reset-button"));

    // Assert
    expect(handleResetSimulateMock).toHaveBeenCalledTimes(1);
  });

  it("calls handleRunSimulate when the simulate button is clicked", async () => {
    // Arrange
    render(<SimulatorButtons />);

    // Act
    await userEvent.click(screen.getByTestId("simulation-run-button"));

    // Assert
    expect(handleRunSimulateMock).toHaveBeenCalledTimes(1);
  });
});
