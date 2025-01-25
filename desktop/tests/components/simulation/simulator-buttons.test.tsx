import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { useEditorContext } from "@/components/editor/editor-context";
import { useApiStatus } from "@/components/simulation/api-status-context";
import { SimulatorButtons } from "@/components/simulation/simulator-buttons";
import { useSimulator } from "@/components/simulation/simulator-context";
import { render, screen, waitFor } from "@testing-library/react";
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
  openPanel: vi.fn(),
  // biome-ignore  lint/suspicious/noExplicitAny: For brevity and clarity.
} as any;

const defaultApiStatusContext = {
  isHealthcheckOk: true,
};

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

vi.mock("@/components/simulation/api-status-context", () => ({
  useApiStatus: vi.fn(),
}));

vi.mock("@/components/simulation/simulator-context", () => ({
  useSimulator: vi.fn(),
}));

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => ({
  usePanelContext: vi.fn(),
}));

function setupMocks({
  editor = {},
  simulator = {},
  panel = {},
  apiStatus = {},
}: {
  editor?: Partial<typeof defaultEditorContext>;
  simulator?: Partial<typeof defaultSimulatorContext>;
  panel?: Partial<typeof defaultPanelContext>;
  apiStatus?: Partial<typeof defaultApiStatusContext>;
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

  vi.mocked(useApiStatus).mockReturnValue({
    ...defaultApiStatusContext,
    ...apiStatus,
  });
}

describe("SimulatorButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows Zap icon when isHealthcheckOk is true", () => {
    // Arrange
    setupMocks({ apiStatus: { isHealthcheckOk: true } });

    // Act
    render(<SimulatorButtons />);

    // Assert
    expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("zapoff-icon")).not.toBeInTheDocument();
  });

  it("shows ZapOff icon when isHealthcheckOk is false", () => {
    // Arrange
    setupMocks({ apiStatus: { isHealthcheckOk: false } });

    // Act
    render(<SimulatorButtons />);

    // Assert
    expect(screen.getByTestId("zapoff-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("zap-icon")).not.toBeInTheDocument();
  });

  it("shows tooltip when hovering over Zap icon", async () => {
    // Arrange
    setupMocks({ apiStatus: { isHealthcheckOk: true } });
    const user = userEvent.setup();

    render(<SimulatorButtons />);

    // Act
    user.hover(screen.getByTestId("zap-icon"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "API connected" })).toBeInTheDocument();
    });
  });

  it("shows tooltip when hovering over ZapOff icon", async () => {
    // Arrange
    setupMocks({ apiStatus: { isHealthcheckOk: false } });
    const user = userEvent.setup();

    render(<SimulatorButtons />);

    // Act
    user.hover(screen.getByTestId("zapoff-icon"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "API not connected" })).toBeInTheDocument();
    });
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
    const mockOpenPanel = vi.fn();

    setupMocks({
      simulator: { formulate: mockFormulate },
      panel: { openPanel: mockOpenPanel },
    });

    render(<SimulatorButtons />);

    // Act
    const simulateButton = screen.getByTestId("simulation-run-button");
    await user.click(simulateButton);

    // Assert
    expect(mockFormulate).toHaveBeenCalledTimes(1);
    expect(mockOpenPanel).toHaveBeenCalledTimes(1);
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
