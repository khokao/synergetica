import { ValidationStatus } from "@/components/circuit/operator/validation-status";
import { useEditorContext } from "@/components/editor/editor-context";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Mock, vi } from "vitest";

let openPanels = { left: false, right: false };
const togglePanelMock = vi.fn(() => {
  openPanels.left = !openPanels.left;
});

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => ({
  usePanelContext: () => ({
    openPanels: openPanels,
    togglePanel: togglePanelMock,
  }),
}));

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

describe("ValidationStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    openPanels = { left: false, right: false };
    togglePanelMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays tooltip on hover over button", async () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: null });

    render(<ValidationStatus />);

    // Act
    await userEvent.hover(screen.getByTestId("validation-status-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Validation status");
    });
  });

  it("renders CircleCheck icon when there are no validation errors", () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: null });

    render(<ValidationStatus />);

    // Assert
    const icon = screen.getByTestId("validation-status-button").querySelector("svg");
    expect(icon).toHaveClass("!text-green-600");
  });

  it("renders AlertCircle icon when there are validation errors", () => {
    // Arrange
    const errors = ["Error 1", "Error 2"];
    (useEditorContext as Mock).mockReturnValue({ validationError: errors });

    render(<ValidationStatus />);

    // Assert
    const icon = screen.getByTestId("validation-status-button").querySelector("svg");
    expect(icon).toHaveClass("!text-red-600");
  });

  it("calls togglePanel with 'left' when the button is clicked and panel is closed", async () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: null });
    openPanels.left = false;

    render(<ValidationStatus />);

    // Act
    await userEvent.click(screen.getByTestId("validation-status-button"));

    // Assert
    expect(togglePanelMock).toHaveBeenCalledTimes(1);
  });

  it("does not call togglePanel when the panel is already open", async () => {
    // Arrange
    (useEditorContext as Mock).mockReturnValue({ validationError: null });
    openPanels.left = true;

    render(<ValidationStatus />);

    // Act
    await userEvent.click(screen.getByTestId("validation-status-button"));

    // Assert
    expect(togglePanelMock).not.toHaveBeenCalled();
  });
});
