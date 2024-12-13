import { SimulatorButtons } from "@/components/circuit/simulation/simulator-buttons";
import * as EditorContextModule from "@/components/editor/editor-context";
import * as ConverterContextModule from "@/components/simulation/contexts/converter-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Mock, vi } from "vitest";

const handleResetSimulateMock = vi.fn();
const handleRunSimulateMock = vi.fn();

vi.mock("@/components/circuit/hooks/use-run-simulator", () => ({
  useSimulate: () => ({
    handleResetSimulate: handleResetSimulateMock,
    handleRunSimulate: handleRunSimulateMock,
  }),
}));

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

vi.mock("@/components/simulation/contexts/converter-context", () => ({
  useConverter: vi.fn(),
}));

describe("SimulatorButtons", () => {
  beforeEach(() => {
    handleResetSimulateMock.mockClear();
    handleRunSimulateMock.mockClear();
    (EditorContextModule.useEditorContext as unknown as Mock).mockClear();
    (ConverterContextModule.useConverter as unknown as Mock).mockClear();
  });

  it("enables the Simulate button when validationError is empty", () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: [],
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");

    // Assert
    expect(simulateButton).toBeEnabled();
  });

  it("disables the Simulate button when validationError exists", () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: [{ message: "There is an error", line: 1 }],
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");

    // Assert
    expect(simulateButton).toBeDisabled();
  });

  it("enables the Reset button when convertResult exists", () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: null,
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: {},
    });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");

    // Assert
    expect(resetButton).toBeEnabled();
  });

  it("disables the Reset button when convertResult is null", () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: null,
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");

    // Assert
    expect(resetButton).toBeDisabled();
  });

  it("calls handleRunSimulate when the Simulate button is clicked and enabled", async () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: [],
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");
    await userEvent.click(simulateButton);

    // Assert
    expect(handleRunSimulateMock).toHaveBeenCalledTimes(1);
  });

  it("does not call handleRunSimulate when the Simulate button is clicked and disabled", async () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: [{ message: "There is an error", line: 1 }],
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");
    await userEvent.click(simulateButton);

    // Assert
    expect(handleRunSimulateMock).not.toHaveBeenCalled();
  });

  it("calls handleResetSimulate when the Reset button is clicked and enabled", async () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: null,
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: {},
    });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");
    await userEvent.click(resetButton);

    // Assert
    expect(handleResetSimulateMock).toHaveBeenCalledTimes(1);
  });

  it("does not call handleResetSimulate when the Reset button is clicked and disabled", async () => {
    // Arrange
    (EditorContextModule.useEditorContext as unknown as Mock).mockReturnValue({
      validationError: null,
    });
    (ConverterContextModule.useConverter as unknown as Mock).mockReturnValue({
      convertResult: null,
    });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");
    await userEvent.click(resetButton);

    // Assert
    expect(handleResetSimulateMock).not.toHaveBeenCalled();
  });
});
