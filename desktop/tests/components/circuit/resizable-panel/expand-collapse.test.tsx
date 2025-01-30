import { ExpandCollapseButton } from "@/components/circuit/resizable-panel/expand-collapse";
import { PanelProvider } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ExpandCollapseButton", () => {
  it("displays 'Open' tooltip on hover over open button", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PanelProvider>
        <ExpandCollapseButton position="left" />
      </PanelProvider>,
    );

    // Act
    await user.hover(screen.getByTestId("expand-collapse-button"));

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("tooltip", { name: "Open" })).toBeInTheDocument();
    });
  });

  it("displays 'Close' tooltip on hover after the panel is toggled open", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <PanelProvider>
        <ExpandCollapseButton position="left" />
      </PanelProvider>,
    );

    // Act
    await user.click(screen.getByTestId("expand-collapse-button"));

    // Assert
    await user.unhover(screen.getByTestId("expand-collapse-button")); // unhover before hovering again
    await user.hover(screen.getByTestId("expand-collapse-button"));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Close");
    });
  });
});
