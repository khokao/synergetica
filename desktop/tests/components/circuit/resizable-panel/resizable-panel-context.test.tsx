import { PanelProvider, usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { act, renderHook } from "@testing-library/react";

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <PanelProvider>{children}</PanelProvider>;
};

describe("PanelProvider / usePanelContext", () => {
  it("should initialize with both left and right panels closed (false)", () => {
    // Arrange & Act
    const { result } = renderHook(() => usePanelContext(), { wrapper });

    // Assert
    expect(result.current.panelOpenState.left).toBe(false);
    expect(result.current.panelOpenState.right).toBe(false);
  });

  it("should set the left panel to open (true) when openPanel is called", () => {
    // Arrange
    const { result } = renderHook(() => usePanelContext(), { wrapper });

    // Act
    act(() => {
      result.current.openPanel("left");
    });

    // Assert
    expect(result.current.panelOpenState.left).toBe(true);
  });

  it("should set the left panel to closed (false) when closePanel is called", () => {
    // Arrange
    const { result } = renderHook(() => usePanelContext(), { wrapper });

    act(() => {
      result.current.openPanel("left");
    });
    expect(result.current.panelOpenState.left).toBe(true); // Ensure it's open before closing

    // Act
    act(() => {
      result.current.closePanel("left");
    });

    // Assert
    expect(result.current.panelOpenState.left).toBe(false);
  });

  it("should toggle the panel's state and call the corresponding resize when togglePanel is invoked", () => {
    // Arrange
    const { result } = renderHook(() => usePanelContext(), { wrapper });

    // Act & Assert (open)
    act(() => {
      result.current.togglePanel("left");
    });
    // Assert (open)
    expect(result.current.panelOpenState.left).toBe(true);

    // Act & Assert (close)
    act(() => {
      result.current.togglePanel("left");
    });
    expect(result.current.panelOpenState.left).toBe(false);
  });
});
