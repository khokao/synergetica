import { render, screen, waitFor } from "@testing-library/react";
import { ExpandCollapseButton } from "@/components/circuit/resizable-panel/expand-collapse";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";


let openPanels = { left: false, right: true };
const togglePanelMock = vi.fn(() => {
  openPanels.left = !openPanels.left;
});

vi.mock("@/components/circuit/resizable-panel/resizable-panel-context", () => ({
  usePanelContext: () => ({
    openPanels: openPanels,
    togglePanel: togglePanelMock,
  }),
}));

describe("ExpandCollapseButton", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    })

    openPanels = { left: false, right: true };
    togglePanelMock.mockClear();
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })


  it("displays 'Open' tooltip on hover over open button", async () => {
    // Arrange
    render(<ExpandCollapseButton position="left" />);

    // Act
    await userEvent.hover(screen.getByTestId("expand-collapse-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Open" })).toBeInTheDocument();
    });
  });

  it("displays 'Close' tooltip on hover over close button", async () => {
    // Arrange
    render(<ExpandCollapseButton position="right" />);

    // Act
    await userEvent.hover(screen.getByTestId("expand-collapse-button"));
    vi.advanceTimersByTime(500);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Close" })).toBeInTheDocument();
    });
  });

  it("calls togglePanel when the button is clicked", async () => {
    // Arrange
    render(<ExpandCollapseButton position="left" />);

    // Act
    await userEvent.click(screen.getByTestId("expand-collapse-button"));

    // Assert
    expect(togglePanelMock).toHaveBeenCalledTimes(1);
  });
});
