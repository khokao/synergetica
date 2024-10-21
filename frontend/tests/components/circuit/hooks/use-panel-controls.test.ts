
import { renderHook, act } from "@testing-library/react";
import { usePanelControls } from "@/components/circuit/hooks/use-panel-controls";

const createMockPanelRef = () => ({
  resize: vi.fn(),
});

describe("usePanelControls", () => {
  it("should initialize with both panels closed", () => {
    // Arrange
    const { result } = renderHook(() => usePanelControls());

    // Act & Assert
    expect(result.current.openPanels.left).toBe(false);
    expect(result.current.openPanels.right).toBe(false);
  });

  it("should toggle the left panel and resize it correctly", () => {
    // Arrange
    const { result } = renderHook(() => usePanelControls());
    const leftPanelRef = createMockPanelRef();
    // @ts-ignore
    result.current.panelRefs.left.current = leftPanelRef;

    // Act
    act(() => {
      result.current.togglePanel("left");
    });

    // Assert
    expect(leftPanelRef.resize).toHaveBeenCalledWith(25.0);
    expect(result.current.openPanels.left).toBe(true);

    // Act
    act(() => {
      result.current.togglePanel("left");
    });

    // Assert
    expect(leftPanelRef.resize).toHaveBeenCalledWith(0);
    expect(result.current.openPanels.left).toBe(false);
  });

  it("should toggle the right panel and resize it correctly", () => {
    // Arrange
    const { result } = renderHook(() => usePanelControls());
    const rightPanelRef = createMockPanelRef();
    // @ts-ignore
    result.current.panelRefs.right.current = rightPanelRef;

    // Act
    act(() => {
      result.current.togglePanel("right");
    });

    // Assert
    expect(rightPanelRef.resize).toHaveBeenCalledWith(25.0);
    expect(result.current.openPanels.right).toBe(true);

    // Act
    act(() => {
      result.current.togglePanel("right");
    });

    // Assert
    expect(rightPanelRef.resize).toHaveBeenCalledWith(0);
    expect(result.current.openPanels.right).toBe(false);
  });

  it("should not toggle if panelRef is null", () => {
    // Arrange
    const { result } = renderHook(() => usePanelControls());

    // Act
    act(() => {
      result.current.togglePanel("left");
    });

    // Assert
    expect(result.current.openPanels.left).toBe(false);
  });
});
