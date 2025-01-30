import { ValidationStatus } from "@/components/circuit/operator/validation-status";
import { useEditorContext } from "@/components/editor/editor-context";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const openPanelMock = vi.fn();

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => {
  return {
    usePanelContext: () => ({
      openPanel: openPanelMock,
    }),
  };
});

vi.mock("@/components/editor/editor-context", () => ({
  useEditorContext: vi.fn(),
}));

describe("ValidationStatus", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders CircleCheck icon and displays tooltip when no validation errors (no circuit)", async () => {
    // Arrange
    const user = userEvent.setup();
    // @ts-ignore
    vi.mocked(useEditorContext).mockReturnValue({ validationError: null }); // no circuit

    // Act
    render(<ValidationStatus />);
    await user.hover(screen.getByTestId("validation-status-button"));

    // Assert
    expect(screen.getByTestId("validation-status-button").querySelector("svg")).toHaveClass("text-green-600");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Circuit is valid");
    });
  });

  it("renders CircleCheck icon when there are no validation errors (valid circuit)", async () => {
    // Arrange
    const user = userEvent.setup();
    // @ts-ignore
    vi.mocked(useEditorContext).mockReturnValue({ validationError: [] }); // valid circuit

    // Act
    render(<ValidationStatus />);
    await user.hover(screen.getByTestId("validation-status-button"));

    // Assert
    expect(screen.getByTestId("validation-status-button").querySelector("svg")).toHaveClass("text-green-600");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Circuit is valid");
    });
  });

  it("renders AlertCircle icon when there are validation errors (invalid circuit)", async () => {
    // Arrange
    const user = userEvent.setup();
    // @ts-ignore
    vi.mocked(useEditorContext).mockReturnValue({ validationError: [{ message: "error msg", line: 1 }] }); // invalid circuit

    // Act
    render(<ValidationStatus />);
    await user.hover(screen.getByTestId("validation-status-button"));

    // Assert
    expect(screen.getByTestId("validation-status-button").querySelector("svg")).toHaveClass("text-red-600");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Circuit has errors");
    });
  });

  it("calls openPanel with 'left' when the button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    // @ts-ignore
    vi.mocked(useEditorContext).mockReturnValue({ validationError: null }); // no circuit

    // Act
    render(<ValidationStatus />);
    await user.click(screen.getByTestId("validation-status-button"));

    // Assert
    expect(openPanelMock).toHaveBeenCalledWith("left");
  });
});
