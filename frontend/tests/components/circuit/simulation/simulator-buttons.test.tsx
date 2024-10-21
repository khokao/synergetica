import { render, screen, waitFor } from "@testing-library/react";
import { SimulatorButtons } from "@/components/circuit/simulation/simulator-buttons";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";


const handleResetSimulateMock = vi.fn();
const handleRunSimulateMock = vi.fn();

vi.mock("@/components/circuit/hooks/use-run-simulator", () => ({
  useSimulate: () => ({
    handleResetSimulate: handleResetSimulateMock,
    handleRunSimulate: handleRunSimulateMock,
  }),
}));

describe("SimulatorButtons", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it("displays 'Reset' tooltip on hover over reset button", async () => {
    // Arrange
    render(<SimulatorButtons />);

    // Act
    await userEvent.hover(screen.getByTestId("simulation-reset-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Reset" })).toBeInTheDocument();
    });
  });

  it ("displays 'Simulate' tooltip on hover over simulate button", async () => {
    // Arrange
    render(<SimulatorButtons />);

    // Act
    await userEvent.hover(screen.getByTestId("simulation-run-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Simulate" })).toBeInTheDocument();
    });
  });
});
