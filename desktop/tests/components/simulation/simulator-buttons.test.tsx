import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { SimulatorButtons } from "@/components/simulation/simulator-buttons";
import { useSimulator } from "@/components/simulation/simulator-context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const defaultEditorContext = {
  validationError: [],
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

const defaultSimulatorContext = {
  solutions: [],
  formulate: vi.fn(),
  reset: vi.fn(),
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

const defaultPanelContext = {
  openPanels: { right: false },
  togglePanel: vi.fn(),
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

function setupMocks({
  editor = {},
  simulator = {},
  panel = {},
}: {
  editor?: Partial<typeof defaultEditorContext>;
  simulator?: Partial<typeof defaultSimulatorContext>;
  panel?: Partial<typeof defaultPanelContext>;
} = {}) {
  vi.mocked(useEditorContext).mockReturnValue({
    ...defaultEditorContext,
    ...editor,
  });
  vi.mocked(useSimulator).mockReturnValue({
    ...defaultSimulatorContext,
    ...simulator,
  });
  vi.mocked(usePanelContext).mockReturnValue({
    ...defaultPanelContext,
    ...panel,
  });
}

vi.mock("@/components/simulation/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => ({
  usePanelContext: vi.fn(),
}));

describe("SimulatorButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables the Simulate button when validationError is empty", () => {
    // Arrange
    setupMocks({ editor: { validationError: [] } });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");

    // Assert
    expect(simulateButton).toBeEnabled();
  });

  it("disables the Simulate button when validationError exists", () => {
    // Arrange
    setupMocks({ editor: { validationError: [{ message: "An error", line: 1 }] } });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");

    // Assert
    expect(simulateButton).toBeDisabled();
  });

  it("enables the Reset button when solutions exists", () => {
    // Arrange
    setupMocks({ simulator: { solutions: [{ time: 0, ProteinA: 100 }] } });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");

    // Assert
    expect(resetButton).toBeEnabled();
  });

  it("disables the Reset button when convertResult is null", () => {
    // Arrange
    setupMocks({ simulator: { solutions: [] } });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");

    // Assert
    expect(resetButton).toBeDisabled();
  });

  it("calls formulate and togglePanel when the Simulate button is clicked and enabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockFormulate = vi.fn();
    const mockTogglePanel = vi.fn();

    setupMocks({
      simulator: { formulate: mockFormulate },
      panel: { openPanels: { right: false }, togglePanel: mockTogglePanel },
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");
    await user.click(simulateButton);

    // Assert
    expect(mockFormulate).toHaveBeenCalledTimes(1);
    expect(mockTogglePanel).toHaveBeenCalledTimes(1);
  });

  it("calls handleResetSimulate when the Reset button is clicked and enabled", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockReset = vi.fn();

    setupMocks({
      simulator: { solutions: [{ time: 0, ProteinA: 100 }], reset: mockReset },
    });

    render(<SimulatorButtons />);

    // Act
    const resetButton = screen.getByTestId("simulation-reset-button");
    await user.click(resetButton);

    // Assert
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
